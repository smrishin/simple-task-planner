import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { code } = await request.json();

  if (code === process.env.ACCESS_CODE) {
    return NextResponse.json({ ok: true });
  } else {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
