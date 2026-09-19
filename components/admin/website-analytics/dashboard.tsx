"use client"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import DateFilter, { presetRange, type Range } from "./date-filter"
import { ReportTable, type Report } from "./report-table"
import Trend from "./trend"
import AcquisitionChart from "./acquisition-chart"
import { Performance, IndexMonitor } from "./monitoring"
import { action, api, ErrorNotice, MetricCard, Panel } from "./shared"

type Data = { reports: Record<string, Report>; note: string }
export const sections = [["overview", "Website Overview"], ["traffic", "Traffic Analytics"], ["search", "Google Search"], ["keywords", "Keywords"], ["pages", "Pages"], ["indexing", "Indexing"], ["performance", "Site Performance"]]
const searchColumns: [string, string][] = [["clicks", "Clicks"], ["impressions", "Impressions"], ["ctr", "CTR"], ["position", "Position"]]
export default function WebsiteDashboard({ section }: { section: string }) {
  const [range, setRange] = useState<Range>(() => presetRange("28 Days")), [data, setData] = useState<Data | null>(null), [error, setError] = useState(""), [busy, setBusy] = useState(true), [page, setPage] = useState(""), [connection, setConnection] = useState("Checking Google connection…")
  const monitoring = ["indexing", "performance"].includes(section)
  const requestVersion = useRef(0)
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem("vs-website-range") || "null")
      if (saved && /^\d{4}-\d{2}-\d{2}$/.test(saved.start) && /^\d{4}-\d{2}-\d{2}$/.test(saved.end) && typeof saved.compare === "boolean") setRange(saved)
    } catch { /* Storage may be disabled; date controls still work. */ }
  }, [])
  function changeRange(value: Range) { setRange(value); try { sessionStorage.setItem("vs-website-range", JSON.stringify(value)) } catch { /* Optional preference storage. */ } }
  const endpoint = `/api/admin/website-analytics/${section}?${new URLSearchParams({ ...range, compare: String(range.compare), ...(page ? { page } : {}) })}`
  const load = useCallback(async (refresh = false, signal?: AbortSignal) => {
    if (monitoring) { setBusy(false); return }
    const version = ++requestVersion.current
    setBusy(true); setError(""); setData(null)
    try { const result = await api<Data>(endpoint, refresh ? "POST" : "GET", signal); if (!signal?.aborted && version === requestVersion.current) setData(result) } catch (e) { if ((e as Error).name !== "AbortError" && version === requestVersion.current) setError((e as Error).message) } finally { if (!signal?.aborted && version === requestVersion.current) setBusy(false) }
  }, [endpoint, monitoring])
  useEffect(() => { const c = new AbortController(); void load(false, c.signal); return () => c.abort() }, [load])
  useEffect(() => { const c = new AbortController(); api<{ connected: boolean; analytics: string; search: string }>("/api/admin/integrations/google/status", "GET", c.signal).then(r => setConnection(r.connected ? `Analytics: ${r.analytics} · Search: ${r.search}` : "Google not connected")).catch(e => { if (e.name !== "AbortError") setConnection("Connection status unavailable") }); return () => c.abort() }, [])
  const reports = data?.reports || {}, totals = reports.totals?.data?.[0], old = reports.totalsPrevious?.data?.[0], search = reports.searchTotals?.data?.[0], oldSearch = reports.searchTotalsPrevious?.data?.[0]
  const compare = (value: unknown) => range.compare ? value ?? null : undefined
  const dates = Object.values(reports).flatMap(r => r.fetchedAt ? [r.fetchedAt] : []).sort()
  const latestSearch = reports.searchTrend?.data?.map(r => String(r.date)).sort().at(-1)
  const showTraffic = ["overview", "traffic", "pages"].includes(section), showSearch = section !== "traffic"
  return <div className="min-w-0 space-y-5 text-foreground">
    <header><p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Website & Marketing</p><h1 className="text-2xl font-bold sm:text-3xl">Website Analytics & SEO</h1><p className="mt-2 text-sm text-muted-foreground">Track website traffic, Google Search visibility, indexing, performance and lead generation.</p><div className="mt-3 flex flex-wrap items-center gap-3 text-xs"><span className="break-words rounded-full bg-muted px-3 py-2">{connection}</span><Link href="/admin/settings/integrations" className="underline underline-offset-4">Manage Google connection</Link></div></header>
    <nav aria-label="Website analytics sections" className="flex flex-wrap gap-2">{sections.map(([key, label]) => <Link key={key} href={`/admin/website-analytics${key === "overview" ? "" : `/${key}`}`} aria-current={section === key ? "page" : undefined} className={`${action} ${section === key ? "bg-accent text-accent-foreground" : ""}`}>{label}</Link>)}</nav>
    {!monitoring && <Panel title={sections.find(s => s[0] === section)?.[1] || "Overview"}><div className="flex flex-wrap items-end justify-between gap-3"><DateFilter range={range} onChange={changeRange}/><button className={action} disabled={busy} onClick={() => load(true)}>Refresh</button></div><p className="mt-3 text-xs text-muted-foreground">{dates.length ? `Oldest report refresh: ${new Date(dates[0]).toLocaleString()}` : "No reports loaded"} · {latestSearch ? `Latest returned Search Console date: ${latestSearch}` : "Search Console latest data date unavailable"}</p></Panel>}
    {page && <div className="flex flex-wrap items-center gap-3 rounded-xl bg-muted p-3 text-sm"><span className="min-w-0 break-all">Page detail: {page}</span><button className={action} onClick={() => setPage("")}>Clear page filter</button><p className="w-full text-xs text-muted-foreground">GA4 matches the landing path without a query string; Search Console matches the exact URL. These are separate reports, not a joined attribution dataset.</p></div>}
    {error && <ErrorNotice error={error}/>}
    {busy && !monitoring && <div role="status" aria-label="Loading website analytics" className="grid grid-cols-2 gap-3 lg:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <div key={i} className="h-28 rounded-2xl bg-muted motion-safe:animate-pulse"/>)}</div>}
    {!busy && !monitoring && <>
      {reports.totals?.error && <ErrorNotice error={reports.totals.error}/>} {reports.searchTotals?.error && <ErrorNotice error={reports.searchTotals.error}/>}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {showTraffic && <><MetricCard label="Users" value={totals?.totalUsers} previous={compare(old?.totalUsers)}/><MetricCard label="Sessions" value={totals?.sessions} previous={compare(old?.sessions)}/><MetricCard label="Views" value={totals?.screenPageViews} previous={compare(old?.screenPageViews)}/><MetricCard label="Organic users" value={reports.channels?.data?.find(r => r.sessionDefaultChannelGroup === "Organic Search")?.totalUsers} previous={compare(reports.channelsPrevious?.data?.find(r => r.sessionDefaultChannelGroup === "Organic Search")?.totalUsers)}/></>}
        {showSearch && <><MetricCard label="Google clicks" value={search?.clicks} previous={compare(oldSearch?.clicks)}/><MetricCard label="Google impressions" value={search?.impressions} previous={compare(oldSearch?.impressions)}/><MetricCard label="Search CTR" value={search?.ctr} previous={compare(oldSearch?.ctr)} percent/><MetricCard label="Average position" value={search?.position} previous={compare(oldSearch?.position)} lowerBetter/></>}
        {section === "overview" && <><MetricCard label="Website leads" value={null}/><MetricCard label="Lead conversion rate" value={null}/></>}
      </div>
      {showTraffic && <div className="grid min-w-0 gap-5 xl:grid-cols-2"><Trend title="Website traffic trend" report={reports.trend}/><AcquisitionChart report={reports.channels}/></div>}{showSearch && <Trend title="Google Search trend" report={reports.searchTrend} search/>}
      {showTraffic && <><div className="grid min-w-0 gap-5 xl:grid-cols-2"><ReportTable title="Traffic acquisition" identity="sessionDefaultChannelGroup" report={reports.channels} columns={[["sessionDefaultChannelGroup", "Channel"], ["totalUsers", "Users"], ["sessions", "Sessions"], ["engagementRate", "Engagement"]]}/><ReportTable title="Devices" identity="deviceCategory" report={reports.devices} columns={[["deviceCategory", "Device"], ["totalUsers", "Users"], ["sessions", "Sessions"], ["engagementRate", "Engagement"]]}/></div><ReportTable title="Geography" identity="city" report={reports.geography} columns={[["country", "Country"], ["region", "Region"], ["city", "City"], ["totalUsers", "Users"], ["sessions", "Sessions"]]}/><ReportTable title="Landing pages" identity="landingPagePlusQueryString" report={reports.landingPages} previous={reports.landingPagesPrevious} columns={[["landingPagePlusQueryString", "Landing page"], ["totalUsers", "Users"], ["sessions", "Sessions"], ["engagementRate", "Engagement"], ["keyEvents", "Key events"]]}/></>}
      {showSearch && <><ReportTable title="Search queries" identity="query" report={reports.queries} previous={reports.queriesPrevious} opportunities columns={[["query", "Query"], ...searchColumns]}/><ReportTable title="Page search performance" identity="page" report={reports.searchPages} previous={reports.searchPagesPrevious} columns={[["page", "Page"], ...searchColumns]} onPage={setPage}/></>}
      <p className="text-xs leading-5 text-muted-foreground">{data?.note || "Metrics are unavailable until Google returns data. Historical website lead attribution is not reliable."}</p>
      {section === "overview" && <Panel title="Website health & next actions"><ul className="space-y-3 text-sm"><li>Search visibility: {reports.searchTotals?.error ? "Needs attention — check Google permissions." : search ? "Data available — review search trend and query opportunities." : "Unavailable"}</li><li>Organic traffic: {totals ? "Data available — review acquisition by channel." : "Unavailable"}</li><li>Indexing: <Link className="underline" href="/admin/website-analytics/indexing">Check important URLs</Link></li><li>Performance: <Link className="underline" href="/admin/website-analytics/performance">Run mobile and desktop tests</Link></li><li>Lead conversion: unavailable until trustworthy CRM attribution is collected.</li><li>Technical SEO crawler and historical monitoring: Phase 2.</li></ul></Panel>}
    </>}
    {section === "indexing" && <IndexMonitor/>}{(section === "performance" || (section === "pages" && page)) && <Performance url={page || "/"}/>}
  </div>
}
