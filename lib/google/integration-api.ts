import "server-only"
import { randomBytes } from "node:crypto"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import Integration, { GoogleOAuthState, GoogleReportCache, GoogleRateLimit } from "@/models/GoogleIntegration"
import { appOrigin, configurationMissing, digest, encryptToken, decryptToken, GoogleError } from "./security"
import { credentials, oauth, scopes, verify, safeError, propertyId, siteUrl } from "./oauth"

export const json = (value: unknown, status = 200) => NextResponse.json(value, { status, headers: { "Cache-Control": "private, no-store" } })
export async function rateLimit(id: string, maximum = 30, windowMs = 60000) {
  const bucket = Math.floor(Date.now() / windowMs)
  const result = await GoogleRateLimit.findOneAndUpdate({ _id: `${id}:${bucket}` }, { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(Date.now() + windowMs * 2) } }, { upsert: true, new: true })
  if (result.count > maximum) throw new GoogleError("RATE_LIMITED_TRY_LATER", 429)
}
export async function integrationAPI(request: Request, action: string) {
  try {
    const { user, response } = await requireAdmin()
    if (response) return response
    const origin = appOrigin(request)
    if (request.method === "POST" && request.headers.get("origin") !== origin) return json({ error: "INVALID_ORIGIN" }, 403)
    await rateLimit(`integration:${user!.id}`, 30)
    const jar = await cookies(), cookieName = "vs-google-state"
    if (action === "connect") {
      const redirectUri = `${origin}/api/admin/integrations/google/callback`, client = oauth(redirectUri)
      const state = randomBytes(32).toString("base64url")
      const { codeVerifier, codeChallenge } = await client.generateCodeVerifierAsync()
      await GoogleOAuthState.create({ _id: digest(state), userId: user!.id, verifier: encryptToken(codeVerifier), redirectUri, expiresAt: new Date(Date.now() + 10 * 60000) })
      jar.set(cookieName, state, { httpOnly: true, secure: origin.startsWith("https:"), sameSite: "lax", path: "/api/admin/integrations/google", maxAge: 600 })
      return json({ url: client.generateAuthUrl({ scope: scopes, access_type: "offline", prompt: "consent", state, code_challenge: codeChallenge, code_challenge_method: "S256" as import("google-auth-library").CodeChallengeMethod }) })
    }
    if (action === "callback") {
      const params = new URL(request.url).searchParams, state = params.get("state") || ""
      const finish = (status: string) => {
        jar.delete(cookieName)
        const result = NextResponse.redirect(`${origin}/admin/settings/integrations?google=${status}`)
        result.headers.set("Referrer-Policy", "no-referrer"); result.headers.set("Cache-Control", "no-store")
        return result
      }
      if (!state || jar.get(cookieName)?.value !== state) return finish("invalid_state")
      const pending = await GoogleOAuthState.findOneAndDelete({ _id: digest(state), userId: user!.id, expiresAt: { $gt: new Date() } })
      if (!pending) return finish("expired_state")
      if (params.has("error")) return finish("consent_denied")
      if (!params.get("code")) return finish("missing_code")
      try {
        const client = oauth(pending.redirectUri)
        const { tokens } = await client.getToken({ code: params.get("code")!, codeVerifier: decryptToken(pending.verifier), redirect_uri: pending.redirectUri })
        if (!tokens.refresh_token) return finish("refresh_token_missing")
        client.setCredentials(tokens)
        let email: string | undefined
        if (tokens.id_token) {
          const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: process.env.GOOGLE_CLIENT_ID })
          const identity = ticket.getPayload()
          if (identity?.email_verified) email = identity.email
        }
        const checks = await verify(client)
        await Integration.findOneAndUpdate({ _id: "primary" }, { $set: { encryptedRefreshToken: encryptToken(tokens.refresh_token), accountEmail: email || "", grantedScopes: (tokens.scope || "").split(" "), revision: randomBytes(16).toString("hex"), connectedAt: new Date(), ...checks } }, { upsert: true })
        await GoogleReportCache.deleteMany({ _id: /^report:/ })
        return finish(checks.analytics === "Connected" && checks.search === "Connected" ? "connected" : "partial")
      } catch { return finish("connection_failed") }
    }
    if (action === "disconnect") {
      const record = await Integration.findOneAndDelete({ _id: "primary" }).select("+encryptedRefreshToken")
      await GoogleOAuthState.deleteMany({})
      await GoogleReportCache.deleteMany({ _id: /^report:/ })
      let revoked = true
      if (record?.encryptedRefreshToken) {
        try { await oauth().revokeToken(decryptToken(record.encryptedRefreshToken)) } catch { revoked = false }
      }
      return json({ disconnected: true, revoked })
    }
    if (action === "test") {
      await rateLimit("google-test", 6)
      const { client, revision } = await credentials()
      const checks = await verify(client)
      await Integration.updateOne({ _id: "primary", revision }, { $set: checks })
    }
    const record = await Integration.findById("primary").lean()
    return json({ connected: Boolean(record), accountEmail: record?.accountEmail || null, analytics: record?.analytics || "Not connected", search: record?.search || "Not connected", lastVerifiedAt: record?.lastVerifiedAt || null, missing: configurationMissing(), propertyId: propertyId(), siteUrl: siteUrl(), pagespeed: process.env.GOOGLE_PAGESPEED_API_KEY ? "API key configured; run a test to verify" : "Keyless access on demand; quota may require an API key" })
  } catch (error) { const safe = safeError(error); return json({ error: safe.code }, safe.status) }
}
