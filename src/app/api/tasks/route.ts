import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) return NextResponse.json([], { status: 400 });

  const tasks = await redis.get(`tasks:${date}`);
  return NextResponse.json(tasks ?? []);
}

export async function POST(request: Request) {
  const { date, tasks } = await request.json();

  if (!date)
    return NextResponse.json({ error: "Missing date" }, { status: 400 });

  await redis.set(`tasks:${date}`, tasks);
  return NextResponse.json({ status: "ok" });
}
