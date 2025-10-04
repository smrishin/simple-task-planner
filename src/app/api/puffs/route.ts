import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import CONSTANTS from "@/constants";

interface PuffEntry {
  count: number;
  max: number;
  lastPuffAt?: string | null;
}

const KEY_PREFIX = "puffs:";

function getMonthKey(year: number, month: number) {
  return `${KEY_PREFIX}${String(year)}-${String(month).padStart(2, "0")}`;
}

function isIsoDate(date: string) {
  // Very basic check for YYYY-MM-DD
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date || !isIsoDate(date)) {
    return NextResponse.json(
      { error: "Missing or invalid date" },
      { status: 400 }
    );
  }

  const [y, m] = date.split("-").map(Number);
  const key = getMonthKey(y, m);

  try {
    const redis = getRedis();

    const monthData: Record<string, PuffEntry> =
      (await redis.get<Record<string, PuffEntry>>(key)) ?? {};

    return NextResponse.json(
      monthData[date] ?? {
        count: 0,
        max: CONSTANTS.TOTAL_PUFFS,
        lastPuffAt: null
      }
    );
  } catch {
    return NextResponse.json({
      count: 0,
      max: CONSTANTS.TOTAL_PUFFS,
      lastPuffAt: null
    });
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const date: string | undefined = body?.date;
  const count: number | undefined = body?.count;
  const max: number | undefined = body?.max;

  if (!date || !isIsoDate(date)) {
    return NextResponse.json(
      { error: "Missing or invalid date" },
      { status: 400 }
    );
  }

  const [y, m] = date.split("-").map(Number);
  const key = getMonthKey(y, m);

  try {
    const redis = getRedis();

    const existing: Record<string, PuffEntry> =
      (await redis.get<Record<string, PuffEntry>>(key)) ?? {};

    const prev = existing[date] ?? {
      count: 0,
      max: CONSTANTS.TOTAL_PUFFS,
      lastPuffAt: null
    };

    const updated: PuffEntry = {
      count: typeof count === "number" ? count : prev.count,
      max: typeof max === "number" ? max : prev.max,
      lastPuffAt: new Date().toISOString()
    };

    existing[date] = updated;

    await redis.set(key, existing);

    return NextResponse.json({ status: "ok", data: updated });
  } catch {
    return NextResponse.json({
      status: "ok",
      data: {
        count: count ?? 0,
        max: max ?? CONSTANTS.TOTAL_PUFFS,
        lastPuffAt: new Date().toISOString()
      },
      warning: "redis not configured"
    });
  }
}
