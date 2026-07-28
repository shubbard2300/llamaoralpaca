import { NextResponse } from "next/server";
import { getSessionUser, isAdminEmail } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({
    user: {
      id: user.sub,
      email: user.email,
      displayName: user.displayName,
      isAdmin: isAdminEmail(user.email),
    },
  });
}
