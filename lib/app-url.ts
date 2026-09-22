import "server-only"

/** Security-sensitive URLs come exclusively from deployment configuration. */
export function appUrl() {
  const configured = process.env.AUTH_URL || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL
  if (!configured) throw new Error("APP_URL_REQUIRED")
  const url = new URL(configured)
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
  if (url.username || url.password || url.search || url.hash || url.pathname !== "/" || !(url.protocol === "https:" || (local && url.protocol === "http:"))) throw new Error("INVALID_APP_URL")
  return url.origin
}

export function appUrlConflicts() {
  const origin = appUrl()
  return ["AUTH_URL", "NEXTAUTH_URL", "NEXT_PUBLIC_APP_URL", "NEXT_PUBLIC_SITE_URL"].filter(name => {
    if (!process.env[name]) return false
    try { return new URL(process.env[name]!).origin !== origin } catch { return true }
  })
}
