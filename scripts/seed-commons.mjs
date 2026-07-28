// Seeds the images table with real, freely-licensed llama & alpaca photos
// pulled from Wikimedia Commons (public domain / CC-licensed photography),
// storing proper photographer attribution alongside each image.
//
// NOTE: this script needs outbound internet access to commons.wikimedia.org.
// It could not be exercised end-to-end in the sandbox this was written in
// (that sandbox's network is allowlisted to only a few hosts), so run it
// once for real after deploying and check the console output / DB row count.
//
// Usage: npm run seed:commons

import pg from "pg";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";

// Mirrors lib/storage.ts's fallback logic in plain JS so this standalone
// script doesn't need a TypeScript loader just to seed the DB.
async function storeImage(buffer, contentType) {
  const ext = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
  const filename = `uploads/${nanoid(16)}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(filename, buffer, {
      access: "public",
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return blob.url;
  }

  const localDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(localDir, { recursive: true });
  const localName = `${nanoid(16)}.${ext}`;
  await writeFile(path.join(localDir, localName), buffer);
  return `/uploads/${localName}`;
}

const COMMONS_API = "https://commons.wikimedia.org/w/api.php";
const USER_AGENT = "LlamaOrAlpacaGame/1.0 (https://github.com/shubbard2300/llamaoralpaca; contact via GitHub issues)";

const CATEGORIES = {
  llama: "Category:Lama glama",
  alpaca: "Category:Vicugna pacos",
};

const TARGET_PER_SPECIES = 30; // aim well past 50 combined after filtering
const IMAGE_WIDTH = 900; // requested thumbnail width in px

const SKIP_WORDS = [
  "map",
  "distribution",
  "logo",
  "coat of arms",
  "skeleton",
  "clipart",
  "clip art",
  "diagram",
  "icon",
  "stamp",
  "postage",
  "location",
  "range",
  "taxobox",
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stripHtml(input) {
  if (!input) return null;
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim() || null;
}

async function commonsApi(params) {
  const url = new URL(COMMONS_API);
  url.search = new URLSearchParams({ format: "json", origin: "*", ...params }).toString();
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`Commons API error ${res.status} for ${url}`);
  return res.json();
}

async function listCategoryFiles(category, limit) {
  const files = [];
  let cmcontinue;
  while (files.length < limit) {
    const data = await commonsApi({
      action: "query",
      list: "categorymembers",
      cmtitle: category,
      cmtype: "file",
      cmlimit: "50",
      ...(cmcontinue ? { cmcontinue } : {}),
    });
    const members = data.query?.categorymembers ?? [];
    files.push(...members.map((m) => m.title));
    cmcontinue = data.continue?.cmcontinue;
    if (!cmcontinue || members.length === 0) break;
    await sleep(200);
  }
  return files.slice(0, limit);
}

function looksLikePhoto(title) {
  const lower = title.toLowerCase();
  if (!/\.(jpe?g|png|webp)$/i.test(title)) return false;
  return !SKIP_WORDS.some((w) => lower.includes(w));
}

async function fetchImageInfo(title) {
  const data = await commonsApi({
    action: "query",
    titles: title,
    prop: "imageinfo",
    iiprop: "url|extmetadata|mime",
    iiurlwidth: String(IMAGE_WIDTH),
  });
  const pages = data.query?.pages ?? {};
  const page = Object.values(pages)[0];
  const info = page?.imageinfo?.[0];
  if (!info) return null;
  if (info.mime && !/^image\/(jpeg|png|webp)$/.test(info.mime)) return null;

  const meta = info.extmetadata ?? {};
  return {
    imageUrl: info.thumburl || info.url,
    pageUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(title)}`,
    artist: stripHtml(meta.Artist?.value) || "Wikimedia Commons contributor",
    license: meta.LicenseShortName?.value || "See Commons page for license",
  };
}

async function downloadBuffer(url) {
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }

  const client = new pg.Client({ connectionString });
  await client.connect();

  let totalInserted = 0;

  try {
    for (const [species, category] of Object.entries(CATEGORIES)) {
      console.log(`\n=== ${species} (${category}) ===`);
      const titles = await listCategoryFiles(category, TARGET_PER_SPECIES * 2);
      const photoTitles = titles.filter(looksLikePhoto).slice(0, TARGET_PER_SPECIES);
      console.log(`Found ${titles.length} files, ${photoTitles.length} look like real photos.`);

      for (const title of photoTitles) {
        try {
          const info = await fetchImageInfo(title);
          if (!info) {
            console.log(`  skip (no imageinfo): ${title}`);
            continue;
          }

          const existing = await client.query("select id from images where attribution_url = $1", [info.pageUrl]);
          if (existing.rows.length > 0) {
            console.log(`  already seeded: ${title}`);
            continue;
          }

          const buffer = await downloadBuffer(info.imageUrl);
          const storedUrl = await storeImage(buffer, "image/jpeg");

          await client.query(
            `insert into images (url, species, status, source, attribution_name, attribution_url, license)
             values ($1, $2, 'approved', 'seed', $3, $4, $5)`,
            [storedUrl, species, info.artist, info.pageUrl, info.license]
          );
          totalInserted += 1;
          console.log(`  + ${title} (by ${info.artist})`);
        } catch (err) {
          console.log(`  error on ${title}:`, err.message);
        }
        await sleep(250);
      }
    }
  } finally {
    await client.end();
  }

  console.log(`\nDone. Inserted ${totalInserted} new photos.`);
}

main().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});
