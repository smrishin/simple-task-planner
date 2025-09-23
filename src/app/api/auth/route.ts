import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { code } = await request.json();

  if (code === process.env.ACCESS_CODE) {
    // Create a redirect response to /view and set the cookie on it
    const redirectUrl = new URL("/view", request.url);
    const res = NextResponse.redirect(redirectUrl);

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
