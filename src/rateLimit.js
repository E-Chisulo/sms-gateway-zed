/**
 * Rate limiter using Cloudflare KV.
 *
 * Strategy: sliding window per API key.
 * Each key tracks a request count + window expiry stored in KV.
 * Defaults: 100 requests per 60 seconds per API key.
 */

const RATE_LIMIT = 100;        // max requests per window
const WINDOW_SECONDS = 60;     // window size in seconds

export async function checkRateLimit(apiKey, kvStore) {
  const rateLimitKey = `ratelimit:${apiKey}`;
  const now = Math.floor(Date.now() / 1000);

  let data = { count: 0, windowStart: now };

  try {
    const stored = await kvStore.get(rateLimitKey);
    if (stored) {
      data = JSON.parse(stored);
    }
  } catch (_) {
    return { allowed: true, remaining: RATE_LIMIT };
  }

  if (now - data.windowStart >= WINDOW_SECONDS) {
    data = { count: 0, windowStart: now };
  }

  data.count += 1;

  const allowed = data.count <= RATE_LIMIT;
  const remaining = Math.max(0, RATE_LIMIT - data.count);
  const resetAt = data.windowStart + WINDOW_SECONDS;

  try {
    await kvStore.put(rateLimitKey, JSON.stringify(data), {
      expirationTtl: WINDOW_SECONDS + 10,
    });
  } catch (_) {
    return { allowed: true, remaining };
  }

  return { allowed, remaining, resetAt };
}
