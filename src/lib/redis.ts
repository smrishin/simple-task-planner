import { Redis } from "@upstash/redis";

if (
  !process.env.SIMPLE_TASK_PLANNER_STORAGE_KV_REST_API_URL ||
  !process.env.SIMPLE_TASK_PLANNER_STORAGE_KV_REST_API_TOKEN
) {
  throw new Error(
    "Missing Upstash Redis configuration in environment variables"
  );
}

export const redis = new Redis({
  url: process.env.SIMPLE_TASK_PLANNER_STORAGE_KV_REST_API_URL!,
  token: process.env.SIMPLE_TASK_PLANNER_STORAGE_KV_REST_API_TOKEN!
});
