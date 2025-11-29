import { kv } from '@vercel/kv';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Rate limiting using Vercel KV (Redis)
 * @param key - Unique key for rate limiting (e.g., "checkout:192.168.1.1")
 * @param limit - Maximum number of requests
 * @param windowMs - Time window in milliseconds
 * @returns Rate limit result
 */
export async function checkRateLimitKV(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  // Проверяем наличие KV_REST_API_URL
  if (!process.env.KV_REST_API_URL) {
    console.warn('[Rate Limit] KV_REST_API_URL not configured, rate limiting disabled');
    return {
      allowed: true,
      remaining: limit,
      resetTime: Date.now() + windowMs,
    };
  }

  try {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Используем sorted set для хранения timestamp'ов
    const rateLimitKey = `ratelimit:${key}`;

    // Удаляем старые записи вне окна
    await kv.zremrangebyscore(rateLimitKey, 0, windowStart);

    // Получаем количество запросов в текущем окне
    const count = await kv.zcard(rateLimitKey);

    if (count >= limit) {
      // Получаем время самого старого запроса для вычисления resetTime
      const oldestRequest = await kv.zrange(rateLimitKey, 0, 0, { withScores: true });
      const resetTime = oldestRequest.length > 0
        ? (oldestRequest[1] as number) + windowMs
        : now + windowMs;

      return {
        allowed: false,
        remaining: 0,
        resetTime,
      };
    }

    // Добавляем текущий запрос
    await kv.zadd(rateLimitKey, { score: now, member: `${now}-${Math.random()}` });

    // Устанавливаем TTL для автоматической очистки
    await kv.expire(rateLimitKey, Math.ceil(windowMs / 1000));

    return {
      allowed: true,
      remaining: limit - count - 1,
      resetTime: now + windowMs,
    };
  } catch (error) {
    console.error('[Rate Limit KV] Error:', error);
    // В случае ошибки разрешаем запрос (fail-open)
    return {
      allowed: true,
      remaining: limit,
      resetTime: Date.now() + windowMs,
    };
  }
}

/**
 * Проверка rate limit для COD заказов (3 заказа в час с одного IP)
 */
export async function checkCODRateLimit(ip: string): Promise<RateLimitResult> {
  const limit = 3; // 3 заказа
  const windowMs = 60 * 60 * 1000; // 1 час
  return checkRateLimitKV(`cod:${ip}`, limit, windowMs);
}
