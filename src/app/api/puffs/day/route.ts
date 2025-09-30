import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import CONSTANTS from "@/constants";

interface PuffEntry {
  count: number;
  max: number;
}

const KEY_PREFIX = "puffs:";

function getMonthKey(year: number, month: number) {
  return `${KEY_PREFIX}${year}-${String(month).padStart(2, "0")}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Missing date" }, { status: 400 });
  }

  try {
    const redis = getRedis();
    const [y, m] = date.split("-").map(Number);
    const key = getMonthKey(y, m);

    const monthData = (await redis.get<Record<string, PuffEntry>>(key)) || {};

    return NextResponse.json(monthData[date] || { count: 0, max: 30 });
  } catch {
    // fallback for dev
    return NextResponse.json({ count: 0, max: 30 });
  }
}

export async function POST(request: Request) {
  const { date, count, max } = await request.json();

  if (!date) {
    return NextResponse.json({ error: "Missing date" }, { status: 400 });
  }

  try {
    const redis = getRedis();
    const [y, m] = date.split("-").map(Number);
    const key = getMonthKey(y, m);

    const existing = (await redis.get<Record<string, PuffEntry>>(key)) || {};

    const prev = existing[date] || { count: 0, max: CONSTANTS.TOTAL_PUFFS };
    existing[date] = {
      count: typeof count === "number" ? count : prev.count,
      max: typeof max === "number" ? max : prev.max
    };

    await redis.set(key, existing);
    return NextResponse.json({ status: "ok", data: existing[date] });
  } catch {
    return NextResponse.json({
      status: "ok",
      data: { count: count ?? 0, max: max ?? 30 },
      warning: "redis not configured"
    });
  }
}
