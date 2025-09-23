import { NextResponse } from "next/server";

export async function POST() {
  // Clear the access cookie by setting it with maxAge 0
  const res = NextResponse.json({ ok: true });

  res.cookies.set("access", "", {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0
  });

  return res;
}
