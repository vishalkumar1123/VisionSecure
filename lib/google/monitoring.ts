import "server-only"
import { services } from "@/lib/services"
import { blogPosts } from "@/lib/blogs"
import { credentials, googleRequest, siteUrl } from "./oauth"
import { GoogleError, digest } from "./security"
import { GoogleReportCache } from "@/models/GoogleIntegration"
import { cached } from "./reports"
import { rateLimit } from "./integration-api"

export const publicPaths = ["/", "/about", "/contact", "/services", "/projects", "/gallery", "/faq", "/blog", ...services.map(s => `/services/${s.slug}`), ...blogPosts.map(b => `/blog/${b.slug}`)]
export function publicUrl(value: string) {
  let url: URL
  try { url = new URL(value, "https://visionsecuretech.in") } catch { throw new GoogleError("INVALID_URL", 400) }
  if (url.origin !== "https://visionsecuretech.in" || url.username || url.password || url.search || url.hash || !publicPaths.includes(url.pathname)) throw new GoogleError("INVALID_PUBLIC_URL", 400)
  return url.href
}
type Audit = { id: string; title: string; description?: string; score: number | null; displayValue?: string; numericValue?: number; details?: { overallSavingsMs?: number; overallSavingsBytes?: number; items?: { url?: string }[] } }
type PageSpeed = { lighthouseResult?: { fetchTime?: string; runtimeError?: unknown; categories?: Record<string, { score: number | null }>; audits?: Record<string, Audit> }; loadingExperience?: { metrics?: Record<string, { percentile?: number; category?: string }> } }
export function summarizeSpeed(result: PageSpeed) {
  const lighthouse = result.lighthouseResult
  if (!lighthouse || lighthouse.runtimeError) throw new GoogleError("PAGESPEED_TEST_FAILED")
  const audits = lighthouse.audits || {}
  return {
    testedAt: lighthouse.fetchTime || new Date().toISOString(),
    scores: Object.fromEntries(["performance", "accessibility", "best-practices", "seo"].map(name => [name, typeof lighthouse.categories?.[name]?.score === "number" ? Math.round(lighthouse.categories[name].score! * 100) : null])),
    lab: Object.fromEntries(["first-contentful-paint", "largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift", "speed-index"].map(name => [name, audits[name]?.displayValue ?? null])),
    field: result.loadingExperience?.metrics || null,
    issues: Object.values(audits).filter(a => typeof a.score === "number" && a.score < 0.9).slice(0, 30).map(a => ({ id: a.id, title: a.title, recommendation: a.description || "", severity: a.score! < 0.5 ? "High" : "Moderate", savingsMs: a.details?.overallSavingsMs ?? null, savingsBytes: a.details?.overallSavingsBytes ?? null, resources: (a.details?.items || []).flatMap(i => i.url ? [i.url] : []).slice(0, 10), detail: a.displayValue || null })),
  }
}
export async function speed(url: string, strategy: "mobile" | "desktop", run: boolean) {
  const key = `speed:${digest(url)}:${strategy}`
  const prior = await GoogleReportCache.findById(key).lean()
  if (!run) return prior ? { data: prior.data, fetchedAt: prior.fetchedAt } : { data: null, fetchedAt: null }
  await rateLimit(`speed:${strategy}:${digest(url)}`, 1, 5 * 60000)
  await rateLimit("speed:global", 12, 60 * 60000)
  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed")
  endpoint.searchParams.set("url", url); endpoint.searchParams.set("strategy", strategy)
  for (const category of ["performance", "accessibility", "best-practices", "seo"]) endpoint.searchParams.append("category", category)
  // PageSpeed supports unauthenticated/key-based requests; do not request unrelated OAuth scopes.
  if (process.env.GOOGLE_PAGESPEED_API_KEY) endpoint.searchParams.set("key", process.env.GOOGLE_PAGESPEED_API_KEY)
  return cached(key, 7 * 86400000, async () => {
    const response = await fetch(endpoint, { cache: "no-store", signal: AbortSignal.timeout(85000) })
    if (!response.ok) throw new GoogleError(response.status === 429 ? "PAGESPEED_QUOTA_EXCEEDED" : "PAGESPEED_CONFIGURATION_REQUIRED", response.status === 429 ? 429 : 503)
    return summarizeSpeed(await response.json())
  }, true)
}
export async function indexing(url?: string, inspect = false) {
  const { client, revision } = await credentials()
  if (url) {
    if (inspect) await rateLimit("inspection:global", 20, 60 * 60000)
    const key = `report:${revision}:inspection:${digest(url)}`
    if (!inspect) { const prior = await GoogleReportCache.findById(key).lean(); return { data: prior?.data || null, fetchedAt: prior?.fetchedAt || null } }
    return cached(key, 86400000, async () => {
      const result = await googleRequest<{ inspectionResult?: { indexStatusResult?: Record<string, string> } }>(client, "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", { inspectionUrl: url, siteUrl: siteUrl(), languageCode: "en-US" })
      const source = result.inspectionResult?.indexStatusResult || {}
      return Object.fromEntries(["verdict", "coverageState", "robotsTxtState", "indexingState", "lastCrawlTime", "googleCanonical", "userCanonical", "pageFetchState"].map(k => [k, source[k] || null]))
    })
  }
  return cached(`report:${revision}:sitemaps`, 60 * 60000, () => googleRequest(client, `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl())}/sitemaps`))
}
