import { NextRequest, NextResponse } from "next/server";
import { queryOne, query } from "@/lib/db";
import { storeImage } from "@/lib/storage";

// One-time (idempotent, safe to re-run) endpoint that pulls real,
// freely-licensed llama & alpaca photography from Wikimedia Commons and
// inserts it pre-approved. Gated by SEED_TOKEN since it's expensive and
// scrapes a third party - not meant to be publicly triggerable.
//
// Mirrors scripts/seed-commons.mjs; kept as a route (rather than reusing
// that script directly) so it can run on Vercel's infrastructure, which has
// real internet access, without needing a local machine or CLI.

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Keep in sync with lib/schema.sql - duplicated here because serverless
// functions can't reliably read arbitrary repo files at runtime.
const SCHEMA_SQL = `
create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  display_name text not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_type where typname = 'species') then
    create type species as enum ('llama', 'alpaca');
  end if;
  if not exists (select 1 from pg_type where typname = 'image_status') then
    create type image_status as enum ('pending', 'approved', 'rejected');
  end if;
  if not exists (select 1 from pg_type where typname = 'image_source') then
    create type image_source as enum ('seed', 'user');
  end if;
end
$$;

create table if not exists images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  species species not null,
  status image_status not null default 'pending',
  source image_source not null default 'user',
  uploader_id uuid references users(id) on delete set null,
  attribution_name text,
  attribution_url text,
  license text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references users(id) on delete set null
);

create index if not exists images_status_species_idx on images (status, species);
create index if not exists images_uploader_idx on images (uploader_id);
`;

const COMMONS_API = "https://commons.wikimedia.org/w/api.php";
const USER_AGENT = "LlamaOrAlpacaGame/1.0 (https://github.com/shubbard2300/llamaoralpaca; contact via GitHub issues)";

const CATEGORIES: Record<"llama" | "alpaca", string> = {
  llama: "Category:Lama glama",
  alpaca: "Category:Vicugna pacos",
};

const SKIP_WORDS = [
  "map", "distribution", "logo", "coat of arms", "skeleton", "clipart",
  "clip art", "diagram", "icon", "stamp", "postage", "location", "range", "taxobox",
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stripHtml(input?: string | null): string | null {
  if (!input) return null;
  return input.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() || null;
}

async function commonsApi(params: Record<string, string>) {
  const url = new URL(COMMONS_API);
  url.search = new URLSearchParams({ format: "json", origin: "*", ...params }).toString();
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`Commons API error ${res.status} for ${url}`);
  return res.json();
}

async function listCategoryFiles(category: string, limit: number): Promise<string[]> {
  const files: string[] = [];
  let cmcontinue: string | undefined;
  while (files.length < limit) {
    const data: any = await commonsApi({
      action: "query",
      list: "categorymembers",
      cmtitle: category,
      cmtype: "file",
      cmlimit: "50",
      ...(cmcontinue ? { cmcontinue } : {}),
    });
    const members = data.query?.categorymembers ?? [];
    files.push(...members.map((m: any) => m.title));
    cmcontinue = data.continue?.cmcontinue;
    if (!cmcontinue || members.length === 0) break;
    await sleep(150);
  }
  return files.slice(0, limit);
}

function looksLikePhoto(title: string): boolean {
  const lower = title.toLowerCase();
  if (!/\.(jpe?g|png|webp)$/i.test(title)) return false;
  return !SKIP_WORDS.some((w) => lower.includes(w));
}

type ImageInfo = { imageUrl: string; pageUrl: string; artist: string; license: string };

async function fetchImageInfo(title: string): Promise<ImageInfo | null> {
  const data: any = await commonsApi({
    action: "query",
    titles: title,
    prop: "imageinfo",
    iiprop: "url|extmetadata|mime",
    iiurlwidth: "900",
  });
  const pages = data.query?.pages ?? {};
  const page: any = Object.values(pages)[0];
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

async function downloadBuffer(url: string): Promise<Buffer> {
  // Wikimedia's image CDN rate-limits bursty anonymous traffic (429). Retry
  // with backoff a few times before giving up on this one image.
  const maxAttempts = 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    if (res.status === 429 && attempt < maxAttempts) {
      const retryAfter = Number(res.headers.get("retry-after"));
      const wait = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1500 * attempt;
      await sleep(wait);
      continue;
    }
    throw new Error(`Failed to download ${url}: ${res.status}`);
  }
  throw new Error(`Failed to download ${url}: exhausted retries`);
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!process.env.SEED_TOKEN || token !== process.env.SEED_TOKEN) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const perSpeciesParam = req.nextUrl.searchParams.get("perSpecies");
  const perSpecies = Math.max(1, Math.min(50, Number(perSpeciesParam) || 25));

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN is not set - add a Blob store in the Vercel Storage tab first." },
      { status: 400 }
    );
  }

  // Idempotent - safe if it's already been run (create table/type "if not exists").
  await query(SCHEMA_SQL);

  const results: Record<string, { found: number; candidates: number; inserted: number; skipped: string[] }> = {};

  for (const [species, category] of Object.entries(CATEGORIES) as Array<["llama" | "alpaca", string]>) {
    const titles = await listCategoryFiles(category, perSpecies * 3);
    const photoTitles = titles.filter(looksLikePhoto).slice(0, perSpecies * 2);
    let inserted = 0;
    const skipped: string[] = [];

    for (const title of photoTitles) {
      if (inserted >= perSpecies) break;
      try {
        const info = await fetchImageInfo(title);
        if (!info) {
          skipped.push(`${title}: no imageinfo`);
          continue;
        }

        const existing = await queryOne("select id from images where attribution_url = $1", [info.pageUrl]);
        if (existing) {
          skipped.push(`${title}: already seeded`);
          continue;
        }

        const buffer = await downloadBuffer(info.imageUrl);
        const storedUrl = await storeImage(buffer, "image/jpeg");

        await query(
          `insert into images (url, species, status, source, attribution_name, attribution_url, license)
           values ($1, $2, 'approved', 'seed', $3, $4, $5)`,
          [storedUrl, species, info.artist, info.pageUrl, info.license]
        );
        inserted += 1;
      } catch (err: any) {
        skipped.push(`${title}: ${err.message}`);
      }
      await sleep(500);
    }

    results[species] = { found: titles.length, candidates: photoTitles.length, inserted, skipped };
  }

  return NextResponse.json({ ok: true, perSpecies, results });
}
