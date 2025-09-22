import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.SIMPLE_TASK_PLANNER_STORAGE_KV_REST_API_URL!,
  token: process.env.SIMPLE_TASK_PLANNER_STORAGE_KV_REST_API_TOKEN!
});
