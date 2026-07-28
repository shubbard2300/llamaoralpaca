import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { queryOne } from "@/lib/db";
import { ALLOWED_TYPES, MAX_UPLOAD_BYTES, storeImage } from "@/lib/storage";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "You need to be signed in to upload a photo." }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const species = String(form.get("species") ?? "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
  }
  if (species !== "llama" && species !== "alpaca") {
    return NextResponse.json({ error: "Choose whether this is a llama or an alpaca." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
    return NextResponse.json({ error: "Only JPEG, PNG, or WEBP images are allowed." }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Image is too large (8MB max)." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await storeImage(buffer, file.type);

  const row = await queryOne<{ id: string; status: string }>(
    `insert into images (url, species, status, source, uploader_id, attribution_name, license)
     values ($1, $2, 'pending', 'user', $3, $4, 'Community submission')
     returning id, status`,
    [url, species, user.sub, user.displayName]
  );

  return NextResponse.json({
    image: row,
    message: "Thanks! Your photo is in the review queue and will appear in the game once approved.",
  });
}
