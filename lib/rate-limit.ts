// Simple in-memory rate limiting for API protection
// Note: In production with multiple instances, use Redis instead

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitConfig {
  maxRequests: number;  // Maximum requests allowed
  windowMs: number;     // Time window in milliseconds
}

// Default configs for different endpoints
export const RATE_LIMIT_CONFIGS = {
  checkout: { maxRequests: 10, windowMs: 60 * 1000 },      // 10 requests per minute
  webhook: { maxRequests: 100, windowMs: 60 * 1000 },     // 100 per minute (Stripe may retry)
  econt: { maxRequests: 30, windowMs: 60 * 1000 },        // 30 per minute
  syncStripe: { maxRequests: 5, windowMs: 60 * 1000 },    // 5 per minute (admin only)
} as const;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = identifier;

  const entry = rateLimitStore.get(key);

  // If no entry or window expired, create new entry
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

// Get identifier from request (IP or fallback)
export function getRequestIdentifier(req: Request): string {
  // Try to get real IP from various headers
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const cfConnectingIp = req.headers.get('cf-connecting-ip'); // Cloudflare

  if (cfConnectingIp) return `ip:${cfConnectingIp}`;
  if (realIp) return `ip:${realIp}`;
  if (forwarded) return `ip:${forwarded.split(',')[0].trim()}`;

  // Fallback - use a combination of headers as fingerprint
  const userAgent = req.headers.get('user-agent') || 'unknown';
  return `ua:${userAgent.slice(0, 50)}`;
}

// Helper to create rate limit response
export function createRateLimitResponse(resetTime: number) {
  const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
  return new Response(
    JSON.stringify({ error: 'Too many requests. Please try again later.' }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Reset': resetTime.toString(),
      },
    }
  );
}
