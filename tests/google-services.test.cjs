const assert = require("node:assert/strict")
const fs = require("node:fs")
const vm = require("node:vm")
const ts = require("typescript")
const { randomBytes } = require("node:crypto")
const path = require("node:path")
function load(file, mocks = {}) {
  const loaded = { exports: {} }
  const js = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText
  vm.runInNewContext(js, { module: loaded, exports: loaded.exports, require: name => name === "server-only" ? {} : name in mocks ? mocks[name] : require(name), Buffer, process, URL, Date, AbortSignal, console, setTimeout }, { filename: file })
  return loaded.exports
}
const security = load("lib/google/security.ts")
const dates = load("lib/google/dates.ts")
process.env.GOOGLE_TOKEN_ENCRYPTION_KEY = randomBytes(32).toString("hex")
const secret = "test-only-refresh-token"
const a = security.encryptToken(secret), b = security.encryptToken(secret)
assert.notEqual(a, b)
assert(!a.includes(secret))
assert.equal(security.decryptToken(a), secret)
assert.throws(() => security.decryptToken(a.slice(0, -4) + "AAAA"))
process.env.GOOGLE_TOKEN_ENCRYPTION_KEY = randomBytes(32).toString("hex")
assert.throws(() => security.decryptToken(a))
delete process.env.GOOGLE_TOKEN_ENCRYPTION_KEY
assert.throws(() => security.encryptToken(secret))
assert(security.configurationMissing().includes("GOOGLE_TOKEN_ENCRYPTION_KEY"))
assert.throws(() => security.appOrigin(new Request("https://attacker.example/api")))
assert.equal(security.appOrigin(new Request("https://visionsecuretech.in/api")), "https://visionsecuretech.in")
assert.deepEqual(JSON.parse(JSON.stringify(dates.previousRange({ startDate: "2024-03-01", endDate: "2024-03-31" }))), { startDate: "2024-01-30", endDate: "2024-02-29" })
for (const [start, end] of [["2025-02-29", "2025-03-01"], ["2025-02-31", "2025-03-01"], ["2025-03-02", "2025-03-01"], ["2020-01-01", "2025-01-01"], ["bad", "2025-01-01"]]) assert.throws(() => dates.dateRange(start, end))
assert.equal(dates.dateRange("2024-02-29", "2024-03-01").startDate, "2024-02-29")
const monitoring = load("lib/google/monitoring.ts", {
  "@/lib/services": { services: [{ slug: "cctv-surveillance" }] }, "@/lib/blogs": { blogPosts: [{ slug: "camera-guide" }] },
  "./oauth": {}, "./security": security, "@/models/GoogleIntegration": {}, "./reports": {}, "./integration-api": {},
})
for (const url of ["https://evil.example/", "http://visionsecuretech.in/", "https://visionsecuretech.in.evil.example/", "https://user:pass@visionsecuretech.in/", "/admin", "/?secret=x", "/#fragment", "//127.0.0.1/"]) assert.throws(() => monitoring.publicUrl(url))
assert.equal(monitoring.publicUrl("/services/cctv-surveillance"), "https://visionsecuretech.in/services/cctv-surveillance")
const speed = monitoring.summarizeSpeed({ lighthouseResult: { categories: { performance: { score: 0 } }, audits: {} } })
assert.equal(speed.scores.performance, 0)
assert.equal(speed.scores.seo, null)
assert.equal(speed.lab["largest-contentful-paint"], null)
assert.equal(speed.field, null)
assert.throws(() => monitoring.summarizeSpeed({ lighthouseResult: { runtimeError: { code: "FAILED" } } }))
const calls = []
const reports = load("lib/google/reports.ts", {
  "@/models/GoogleIntegration": {}, "./security": security, "./dates": dates,
  "./oauth": { propertyId: () => "544810814", siteUrl: () => "https://visionsecuretech.in/", googleRequest: async (_client, url, data) => { calls.push({ url, data }); return { rows: [] } } },
})
async function apiTests() {
  await reports.ga({}, { startDate: "2025-01-01", endDate: "2025-01-02" }, [], ["sessions"])
  await reports.search({}, { startDate: "2025-01-01", endDate: "2025-01-02" }, ["query"])
  assert(calls[0].url.includes("properties/544810814:runReport"))
  assert.equal(calls[1].data.dataState, "final")
  assert.equal(calls[1].data.rowLimit, 10000)
  let active = 0, peak = 0
  const boundedReports = load("lib/google/reports.ts", {
    "@/models/GoogleIntegration": { GoogleReportCache: { findById: () => ({ lean: async () => null }), findOneAndUpdate: async () => {} } },
    "./security": security, "./dates": dates,
    "./oauth": {
      propertyId: () => "544810814", siteUrl: () => "https://visionsecuretech.in/", safeError: error => error,
      googleRequest: async (_client, url) => { active++; peak = Math.max(peak, active); await new Promise(resolve => setTimeout(resolve, 2)); active--; if (url.includes("webmasters")) throw new security.GoogleError("PERMISSION_OR_API_DISABLED"); return { rows: [] } },
    },
  })
  const partial = await boundedReports.report({}, "revision", "overview", { startDate: "2025-01-01", endDate: "2025-01-02" }, true, false)
  assert(peak <= 4); assert.equal(partial.reports.totals.error, null); assert.equal(partial.reports.searchTotals.error, "PERMISSION_OR_API_DISABLED"); assert.equal(partial.reports.totalsPrevious.error, null)
  const { NextResponse } = require("next/server")
  let user = null, origin = "https://visionsecuretech.in"
  let cookie = "state", consumed = false, providerCalls = 0, stored = null, revokedToken = null
  process.env.GOOGLE_TOKEN_ENCRYPTION_KEY = randomBytes(32).toString("hex")
  const stateModel = { findOneAndDelete: async filter => { assert.equal(filter.userId, "admin-fixture"); if (consumed) return null; consumed = true; return { redirectUri: origin + "/api/admin/integrations/google/callback", verifier: security.encryptToken("pkce-test-verifier") } }, deleteMany: async () => {} }
  const configModel = {
    findOneAndUpdate: async (_filter, update) => { stored = { ...update.$set } },
    findById: () => ({ lean: async () => stored }),
    findOneAndDelete: () => ({ select: async () => { const old = stored; stored = null; return old } }),
  }
  const integration = load("lib/google/integration-api.ts", {
    "next/headers": { cookies: async () => ({ get: () => ({ value: cookie }), delete: () => {}, set: () => {} }) },
    "next/server": { NextResponse }, "@/lib/admin-auth": { requireAdmin: async () => ({ user, response: user ? null : NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }) },
    "@/models/GoogleIntegration": { __esModule: true, default: configModel, GoogleOAuthState: stateModel, GoogleReportCache: { deleteMany: async () => {} }, GoogleRateLimit: { findOneAndUpdate: async () => ({ count: 1 }) } },
    "./security": security,
    "./oauth": {
      propertyId: () => "544810814", siteUrl: () => "https://visionsecuretech.in/",
      safeError: e => e instanceof security.GoogleError ? e : new security.GoogleError("FAILED"),
      verify: async () => ({ analytics: "Connected", search: "PERMISSION_OR_API_DISABLED", lastVerifiedAt: new Date() }),
      oauth: () => ({ getToken: async args => { providerCalls++; assert.equal(args.codeVerifier, "pkce-test-verifier"); return { tokens: { refresh_token: "test-refresh-secret", access_token: "test-access-secret", scope: "analytics.readonly" } } }, setCredentials: () => {}, revokeToken: async token => { revokedToken = token } }),
    },
  })
  const req = (suffix, opts) => new Request(origin + "/api/admin/integrations/google/" + suffix, opts)
  assert.equal((await integration.integrationAPI(req("status"), "status")).status, 401)
  user = { id: "admin-fixture", role: "admin" }
  assert.equal((await integration.integrationAPI(req("disconnect", { method: "POST", headers: { origin: "https://evil.example" } }), "disconnect")).status, 403)
  const invalid = await integration.integrationAPI(req("callback?state=wrong&code=test"), "callback")
  assert(invalid.headers.get("location").endsWith("google=invalid_state")); assert.equal(providerCalls, 0)
  cookie = "state"
  const denied = await integration.integrationAPI(req("callback?state=state&error=access_denied"), "callback")
  assert(denied.headers.get("location").endsWith("google=consent_denied")); assert.equal(consumed, true)
  const replay = await integration.integrationAPI(req("callback?state=state&code=test"), "callback")
  assert(replay.headers.get("location").endsWith("google=expired_state")); assert.equal(providerCalls, 0)
  consumed = false
  const connected = await integration.integrationAPI(req("callback?state=state&code=test"), "callback")
  assert(connected.headers.get("location").endsWith("google=partial"))
  assert.equal(connected.headers.get("referrer-policy"), "no-referrer")
  assert.equal(providerCalls, 1)
  assert.equal(security.decryptToken(stored.encryptedRefreshToken), "test-refresh-secret")
  assert(!JSON.stringify(stored).includes("test-refresh-secret"))
  assert(!JSON.stringify(stored).includes("test-access-secret"))
  const view = await (await integration.integrationAPI(req("status"), "status")).text()
  assert(!view.includes("encryptedRefreshToken")); assert(!view.includes("test-refresh-secret")); assert(!view.includes("test-access-secret"))
  const disconnected = await integration.integrationAPI(req("disconnect", { method: "POST", headers: { origin } }), "disconnect")
  assert.equal(disconnected.status, 200); assert.equal(stored, null); assert.equal(revokedToken, "test-refresh-secret")
  for (const file of fs.readdirSync("components/admin/website-analytics")) {
    const source = fs.readFileSync(path.join("components/admin/website-analytics", file), "utf8")
    assert(!/from ["'].*lib\/google\/(oauth|security|integration-api)/.test(source))
  }
  console.log("PASS Google services: authenticated encryption, date validation/comparison, URL allowlist, unavailable metrics, API contracts, admin guard, CSRF, OAuth state/replay, PKCE code exchange, encrypted persistence, partial permission, sanitized status, revocation/disconnect, client boundary")
}
apiTests().catch(error => { console.error(error); process.exitCode = 1 })
