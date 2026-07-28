import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, isAdminEmail } from "@/lib/auth";
import { queryOne } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { id } = await params;
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const action = body?.action;
  if (action !== "approve" && action !== "reject") {
    return NextResponse.json({ error: "action must be 'approve' or 'reject'." }, { status: 400 });
  }

  const status = action === "approve" ? "approved" : "rejected";
  const row = await queryOne(
    `update images
     set status = $1, reviewed_at = now(), reviewed_by = $2
     where id = $3 and status = 'pending'
     returning id, status`,
    [status, user.sub, id]
  );

  if (!row) {
    return NextResponse.json({ error: "Image not found or already reviewed." }, { status: 404 });
  }
  return NextResponse.json({ image: row });
}
