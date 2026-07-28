import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const images = await query(
    `select id, url, species, status, created_at
     from images
     where uploader_id = $1
     order by created_at desc
     limit 50`,
    [user.sub]
  );
  return NextResponse.json({ images });
}
