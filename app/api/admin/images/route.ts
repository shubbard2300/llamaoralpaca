import { NextResponse } from "next/server";
import { getSessionUser, isAdminEmail } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const user = await getSessionUser();
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const images = await query(
    `select i.id, i.url, i.species, i.status, i.created_at,
            u.email as uploader_email, u.display_name as uploader_name
     from images i
     left join users u on u.id = i.uploader_id
     where i.status = 'pending'
     order by i.created_at asc
     limit 100`
  );
  return NextResponse.json({ images });
}
