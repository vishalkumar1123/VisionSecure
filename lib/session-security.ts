import type { JWT } from "next-auth/jwt"

export const ADMIN_IDLE_TIMEOUT_MS = 5 * 60_000

export function isSessionTokenActive(token: JWT | null): token is JWT {
  return Boolean(
    token &&
    typeof token.exp === "number" &&
    token.exp * 1000 > Date.now() &&
    typeof token.lastActivity === "number" &&
    Date.now() - token.lastActivity < ADMIN_IDLE_TIMEOUT_MS
  )
}
