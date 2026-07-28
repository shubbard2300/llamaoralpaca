import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import { createSessionToken, sessionCookieOptions, SESSION_COOKIE, verifyPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  const user = await queryOne<{ id: string; email: string; display_name: string; password_hash: string }>(
    "select id, email, display_name, password_hash from users where email = $1",
    [email]
  );

  // Same generic error whether the email is unknown or the password is wrong,
  // so login attempts can't be used to enumerate registered accounts.
  const invalid = () => NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

  if (!user) return invalid();
  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) return invalid();

  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    displayName: user.display_name,
  });

  const res = NextResponse.json({ user: { id: user.id, email: user.email, displayName: user.display_name } });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
