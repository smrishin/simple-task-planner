import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

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
  const year = Number(searchParams.get("year"));
  const month = Number(searchParams.get("month"));

  if (!year || !month) {
    return NextResponse.json(
      { error: "Missing year or month" },
      { status: 400 }
    );
  }

  try {
    const redis = getRedis();
    const key = getMonthKey(year, month);
    const data = (await redis.get<Record<string, PuffEntry>>(key)) || {};

    return NextResponse.json({ data });
  } catch {
    // fallback for dev
    return NextResponse.json({ data: {} });
  }
}
