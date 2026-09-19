import "server-only"
import type { OAuth2Client } from "google-auth-library"
import { GoogleReportCache } from "@/models/GoogleIntegration"
import { digest } from "./security"
import { googleRequest, propertyId, siteUrl, safeError } from "./oauth"
import { type DateRange, previousRange } from "./dates"

export type Row = Record<string, string | number | null>
type GAResponse = { rows?: { dimensionValues?: { value: string }[]; metricValues: { value: string }[] }[]; metadata?: { timeZone?: string }; rowCount?: number }
export async function ga(client: OAuth2Client, range: DateRange, dimensions: string[], metrics: string[], page?: string): Promise<Row[]> {
  const result = await googleRequest<GAResponse>(client, `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId()}:runReport`, {
    dateRanges: [range], dimensions: dimensions.map(name => ({ name })), metrics: metrics.map(name => ({ name })), limit: 10000,
    ...(dimensions.includes("date") ? { orderBys: [{ dimension: { dimensionName: "date" } }] } : { orderBys: [{ metric: { metricName: metrics[0] }, desc: true }] }),
    ...(page ? { dimensionFilter: { filter: { fieldName: "landingPagePlusQueryString", stringFilter: { matchType: "EXACT", value: new URL(page).pathname } } } } : {}),
  })
  return (result.rows || []).map(row => Object.fromEntries([...dimensions.map((name, i) => [name, row.dimensionValues?.[i]?.value ?? ""]), ...metrics.map((name, i) => [name, row.metricValues[i]?.value === undefined ? null : Number(row.metricValues[i].value)])]))
}
type SearchResponse = { rows?: { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number }[] }
export async function search(client: OAuth2Client, range: DateRange, dimensions: string[], page?: string): Promise<Row[]> {
  const result = await googleRequest<SearchResponse>(client, `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl())}/searchAnalytics/query`, { ...range, dimensions, dataState: "final", type: "web", rowLimit: 10000, ...(page ? { dimensionFilterGroups: [{ filters: [{ dimension: "page", operator: "equals", expression: page }] }] } : {}) })
  return (result.rows || []).map(row => ({ ...Object.fromEntries(dimensions.map((key, i) => [key, row.keys?.[i] || ""])), clicks: row.clicks, impressions: row.impressions, ctr: row.ctr, position: row.position }))
}
export async function cached<T>(key: string, ttl: number, fn: () => Promise<T>, refresh = false) {
  const prior = await GoogleReportCache.findById(key).lean()
  if (prior && +new Date(prior.expiresAt) > Date.now() && !refresh) return { data: prior.data as T, fetchedAt: new Date(prior.fetchedAt).toISOString() }
  const data = await fn(), fetchedAt = new Date()
  await GoogleReportCache.findOneAndUpdate({ _id: key }, { $set: { data, fetchedAt, expiresAt: new Date(Date.now() + ttl) } }, { upsert: true })
  return { data, fetchedAt: fetchedAt.toISOString() }
}
export async function report(client: OAuth2Client, revision: string, section: string, range: DateRange, compare: boolean, refresh: boolean, page?: string) {
  const previous = previousRange(range)
  const entries: [string, () => Promise<Row[]>][] = []
  const add = (name: string, fn: (r: DateRange) => Promise<Row[]>) => { entries.push([name, () => fn(range)]); if (compare) entries.push([`${name}Previous`, () => fn(previous)]) }
  if (["overview", "traffic", "pages"].includes(section)) {
    add("totals", r => ga(client, r, [], ["totalUsers", "sessions", "screenPageViews", "engagementRate", "keyEvents"], page))
    add("trend", r => ga(client, r, ["date"], ["totalUsers", "sessions", "screenPageViews"], page))
    add("channels", r => ga(client, r, ["sessionDefaultChannelGroup"], ["totalUsers", "sessions", "engagementRate"], page))
    add("devices", r => ga(client, r, ["deviceCategory"], ["totalUsers", "sessions", "engagementRate"], page))
    add("geography", r => ga(client, r, ["country", "region", "city"], ["totalUsers", "sessions"], page))
    add("landingPages", r => ga(client, r, ["landingPagePlusQueryString"], ["totalUsers", "sessions", "engagementRate", "keyEvents"], page))
  }
  if (section !== "traffic") {
    add("searchTotals", r => search(client, r, [], page))
    add("searchTrend", r => search(client, r, ["date"], page))
    add("queries", r => search(client, r, ["query"], page))
    add("searchPages", r => search(client, r, ["page"], page))
  }
  const run = async ([name, fn]: [string, () => Promise<Row[]>]) => {
    try {
      const result = await cached(`report:${revision}:${digest(JSON.stringify([propertyId(), siteUrl(), name, range, compare, page]))}`, name.startsWith("search") || name.startsWith("queries") ? 45 * 60000 : 20 * 60000, fn, refresh)
      return [name, { ...result, error: null }]
    } catch (error) { return [name, { data: null, fetchedAt: null, error: safeError(error).code }] }
  }
  // Keep this dashboard below GA4's per-property concurrent request quota.
  const results: unknown[][] = []
  for (let index = 0; index < entries.length; index += 4) {
    results.push(...await Promise.all(entries.slice(index, index + 4).map(run)))
  }
  return { reports: Object.fromEntries(results), range, previous: compare ? previous : null, note: "Search Console uses finalized data and Pacific dates; GA4 uses the property time zone. Tables contain up to 10,000 top rows; privacy filtering can omit queries. Website lead attribution is unavailable because historical source defaults are not reliable." }
}
