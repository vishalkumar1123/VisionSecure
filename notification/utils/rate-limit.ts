const attempts = new Map<string, { count: number; resetAt: number }>()

export function allowRateLimitedRequest(key: string, maxRequests = 8, windowMs = 60_000): boolean {
  const now = Date.now()
  const current = attempts.get(key)
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (current.count >= maxRequests) return false
  current.count += 1
  return true
}
