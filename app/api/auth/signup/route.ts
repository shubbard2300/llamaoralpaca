import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import {
  createSessionToken,
  hashPassword,
  isValidEmail,
  sessionCookieOptions,
  SESSION_COOKIE,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");
  const displayName = String(body?.displayName ?? "").trim().slice(0, 60) || email.split("@")[0];

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const existing = await queryOne("select id from users where email = $1", [email]);
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await queryOne<{ id: string; email: string; display_name: string }>(
    `insert into users (email, display_name, password_hash)
     values ($1, $2, $3)
     returning id, email, display_name`,
    [email, displayName, passwordHash]
  );
  if (!user) {
    return NextResponse.json({ error: "Could not create account." }, { status: 500 });
  }

  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    displayName: user.display_name,
  });

  const res = NextResponse.json({ user: { id: user.id, email: user.email, displayName: user.display_name } });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
