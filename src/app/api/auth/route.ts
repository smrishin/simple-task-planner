import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { code } = await request.json();

  if (code === process.env.ACCESS_CODE) {
    const res = NextResponse.json({ ok: true });

    // Set cookie for 24 hours
    res.cookies.set("access", "granted", {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 // 24 hours in seconds
    });

    return res;
  } else {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
