import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";

export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * Stores an uploaded image and returns its public URL.
 * Uses Vercel Blob in production; falls back to public/uploads for local dev
 * so the whole upload flow can be exercised without cloud credentials.
 */
export async function storeImage(buffer: Buffer, contentType: string): Promise<string> {
  const ext = EXT_BY_TYPE[contentType] ?? "bin";
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
