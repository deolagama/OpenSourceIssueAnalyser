import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

let redisClient = null;
let redisAvailable = false;

/**
 * Creates and returns a singleton Redis client.
 * Falls back gracefully if Redis is unavailable.
 */
const createRedisClient = () => {
  const client = new Redis(REDIS_URL, {
    // Disable auto-reconnect so a missing Redis doesn't spam logs
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => {
      // Give up after 3 retries — keeps startup fast when Redis is absent
      if (times >= 3) return null;
      return Math.min(times * 200, 2000);
    },
    lazyConnect: true, // Don't connect until we call client.connect()
  });

  client.on("connect", () => {
    redisAvailable = true;
    console.log("✅ Redis connected successfully");
  });

  client.on("error", (err) => {
    if (redisAvailable) {
      // Only log once when connection is first lost
      console.warn("⚠️  Redis connection lost:", err.message);
    }
    redisAvailable = false;
  });

  client.on("close", () => {
    redisAvailable = false;
  });

  return client;
};

// Initialise the client once
redisClient = createRedisClient();

// Attempt to connect (non-blocking — errors are caught by the error listener)
redisClient.connect().catch((err) => {
  console.warn("⚠️  Redis unavailable — caching disabled:", err.message);
  redisAvailable = false;
});

/**
 * Returns true when Redis is currently reachable.
 */
export const isRedisAvailable = () => redisAvailable;

export default redisClient;
