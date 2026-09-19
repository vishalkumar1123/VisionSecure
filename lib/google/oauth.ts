import "server-only"
import { OAuth2Client } from "google-auth-library"
import Integration from "@/models/GoogleIntegration"
import { decryptToken, GoogleError, configurationMissing } from "./security"

export const scopes = ["https://www.googleapis.com/auth/analytics.readonly", "https://www.googleapis.com/auth/webmasters.readonly", "openid", "email"]
export const propertyId = () => process.env.GA4_PROPERTY_ID || "544810814"
export const siteUrl = () => process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || "https://visionsecuretech.in/"
export function oauth(redirectUri?: string) {
  if (configurationMissing().length) throw new GoogleError("CONFIGURATION_REQUIRED")
  return new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, redirectUri)
}
export async function credentials() {
  const record = await Integration.findById("primary").select("+encryptedRefreshToken").lean()
  if (!record?.encryptedRefreshToken) throw new GoogleError("NOT_CONNECTED", 409)
  const client = oauth()
  client.setCredentials({ refresh_token: decryptToken(record.encryptedRefreshToken) })
  return { client, revision: String(record.revision) }
}
export function safeError(error: unknown) {
  if (error instanceof GoogleError) return error
  const e = error as { response?: { status?: number; data?: { error?: string | { status?: string; errors?: { reason?: string }[] } } } }
  const status = e.response?.status
  const detail = e.response?.data?.error
  if (typeof detail === "object" && (detail?.status === "RESOURCE_EXHAUSTED" || detail?.errors?.some(item => /quota|rateLimit|dailyLimit/i.test(item.reason || "")))) return new GoogleError("QUOTA_EXCEEDED", 429)
  if (e.response?.data?.error === "invalid_grant" || status === 401) return new GoogleError("AUTH_REVOKED_RECONNECT", 401)
  if (status === 403) return new GoogleError("PERMISSION_OR_API_DISABLED", 403)
  if (status === 429) return new GoogleError("QUOTA_EXCEEDED", 429)
  return new GoogleError("GOOGLE_API_UNAVAILABLE")
}
export async function googleRequest<T>(client: OAuth2Client, url: string, data?: unknown): Promise<T> {
  try { return (await client.request<T>({ url, method: data === undefined ? "GET" : "POST", ...(data === undefined ? {} : { data }), timeout: 25000, retry: false })).data }
  catch (error) { throw safeError(error) }
}
export async function verify(client: OAuth2Client) {
  const check = async (fn: () => Promise<unknown>) => { try { await fn(); return "Connected" } catch (error) { return safeError(error).code } }
  const analytics = await check(() => googleRequest(client, `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId()}:runReport`, { dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }], metrics: [{ name: "sessions" }], limit: 1 }))
  const search = await check(() => googleRequest(client, `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl())}`))
  return { analytics, search, lastVerifiedAt: new Date() }
}
