import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import type { Task } from "@/components/TaskRow";

const genId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

const ensureIds = (tasks: Task[]) =>
  tasks.map((t) => ({ ...t, id: t.id ?? genId() }));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) return NextResponse.json([], { status: 400 });

  try {
    const redis = getRedis();
    const tasks = await redis.get(`tasks:${date}`);
    return NextResponse.json(tasks ?? []);
  } catch {
    // If redis not configured, return empty array for dev/build
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  const { date, tasks } = await request.json();

  if (!date)
    return NextResponse.json({ error: "Missing date" }, { status: 400 });

  try {
    const redis = getRedis();
    const candidate = ensureIds(Array.isArray(tasks) ? tasks : []);

    // Filter out invalid tasks before saving
    const toSave = candidate.filter((t) => {
      const hasStart = typeof t.start === "string" && t.start.trim() !== "";
      const hasTask = typeof t.task === "string" && t.task.trim() !== "";
      return hasStart && hasTask;
    });

    await redis.set(`tasks:${date}`, toSave);
    return NextResponse.json({ status: "ok" });
  } catch {
    // If redis not configured, pretend save succeeded (dev)
    return NextResponse.json({ status: "ok", warning: "redis not configured" });
  }
}
