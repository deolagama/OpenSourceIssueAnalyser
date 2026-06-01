import githubApi from "../config/github.js";
import redisClient, { isRedisAvailable } from "../config/redis.js";

const CACHE_TTL_SECONDS = 600; // 10 minutes

/**
 * Builds a deterministic cache key for a given repo's issues.
 * Format: repo:{owner}:{repo}:issues
 */
const buildCacheKey = (owner, repo) => `repo:${owner}:${repo}:issues`;

/**
 * Fetches open issues for a GitHub repo.
 * Checks Redis cache first; falls back to GitHub API on cache miss.
 * Stores the API response in Redis with a 10-minute TTL.
 * If Redis is unavailable the function still works — caching is silently skipped.
 */
export const fetchIssues = async (owner, repo, maxPages = 2) => {
  const cacheKey = buildCacheKey(owner, repo);

  // ── 1. Cache lookup ──────────────────────────────────────────────────────
  if (isRedisAvailable()) {
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log(`🗂️  Cache HIT  → ${cacheKey}`);
        return JSON.parse(cached);
      }
      console.log(`🔍  Cache MISS → ${cacheKey}`);
    } catch (err) {
      // Redis read failed — continue to fetch from GitHub
      console.warn("⚠️  Redis read error, falling back to GitHub API:", err.message);
    }
  }

  // ── 2. Fetch from GitHub API ─────────────────────────────────────────────
  const allIssues = [];

  for (let page = 1; page <= maxPages; page++) {
    const res = await githubApi.get(`/repos/${owner}/${repo}/issues`, {
      params: {
        state: "open",
        per_page: 100,
        page,
        sort: "updated",
        direction: "desc"
      }
    });

    const issues = res.data.filter(issue => !issue.pull_request); // GitHub returns PRs too
    allIssues.push(...issues);

    // Stop early if we got fewer than per_page (last page)
    if (res.data.length < 100) break;
  }

  // ── 3. Store in cache ────────────────────────────────────────────────────
  if (isRedisAvailable()) {
    try {
      await redisClient.set(cacheKey, JSON.stringify(allIssues), "EX", CACHE_TTL_SECONDS);
      console.log(`💾  Cached ${allIssues.length} issues → ${cacheKey} (TTL: ${CACHE_TTL_SECONDS}s)`);
    } catch (err) {
      // Redis write failed — data still returned to caller
      console.warn("⚠️  Redis write error, cache not stored:", err.message);
    }
  }

  return allIssues;
};
