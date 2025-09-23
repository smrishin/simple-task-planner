import { Redis } from "@upstash/redis";

let _redis: Redis | null = null;

export function getRedis() {
  if (_redis) return _redis;

  const url = process.env.SIMPLE_TASK_PLANNER_STORAGE_KV_REST_API_URL;
  const token = process.env.SIMPLE_TASK_PLANNER_STORAGE_KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Missing Upstash Redis configuration in environment variables"
    );
  }

  _redis = new Redis({ url, token });
  return _redis;
}

// Backwards-compatible export when env is present at runtime
try {
  if (
    process.env.SIMPLE_TASK_PLANNER_STORAGE_KV_REST_API_URL &&
    process.env.SIMPLE_TASK_PLANNER_STORAGE_KV_REST_API_TOKEN
  ) {
    _redis = new Redis({
      url: process.env.SIMPLE_TASK_PLANNER_STORAGE_KV_REST_API_URL,
      token: process.env.SIMPLE_TASK_PLANNER_STORAGE_KV_REST_API_TOKEN
    });
  }
} catch {
  /* ignore during build-time */
}

export { _redis as redis };
