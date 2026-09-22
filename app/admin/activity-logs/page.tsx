"use client"

import { useEffect, useState } from "react"
import { History, RefreshCw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Log {
  _id: string
  userId: { name?: string; email?: string } | null
  changes?: { event?: string }
  action: string
  resourceType?: string
  status: "success" | "failed"
  createdAt: string
}
interface Results { data: Log[]; total: number; page: number; pages: number }
const actions = ["LOGIN", "LOGOUT", "PASSWORD_RESET", "LEAD_CREATED", "LEAD_UPDATED", "LEAD_STATUS_CHANGED", "LEAD_ASSIGNED", "NOTE_ADDED", "USER_CREATED", "USER_UPDATED", "USER_DELETED", "EMAIL_VERIFIED", "QUOTATION_CREATED", "SERVICE_TICKET_CREATED", "CUSTOMER_CENTER"]
const label = (value: string) => value.toLowerCase().replaceAll("_", " ")

export default function ActivityLogsPage() {
  const [filters, setFilters] = useState({ action: "", start: "", end: "" })
  const [applied, setApplied] = useState(filters)
  const [page, setPage] = useState(1)
  const [refresh, setRefresh] = useState(0)
  const [result, setResult] = useState<Results | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      setLoading(true)
      setError("")
      const query = new URLSearchParams({ page: String(page), limit: "25" })
      if (applied.action) query.set("action", applied.action)
      if (applied.start) query.set("startDate", new Date(`${applied.start}T00:00:00`).toISOString())
      if (applied.end) query.set("endDate", new Date(`${applied.end}T23:59:59.999`).toISOString())
      try {
        const response = await fetch(`/api/activity-logs?${query}`, { signal: controller.signal, cache: "no-store" })
        const json = await response.json()
        if (!response.ok) throw new Error(json.error || "Unable to load activity logs.")
        if (!Array.isArray(json.data?.data)) throw new Error("Unexpected response. Please try again.")
        setResult(json.data)
      } catch (failure) {
        if (!controller.signal.aborted) { setResult(null); setError(failure instanceof Error ? failure.message : "Unable to load activity logs.") }
      } finally { if (!controller.signal.aborted) setLoading(false) }
    }
    void load()
    return () => controller.abort()
  }, [applied, page, refresh])

  return <div className="space-y-6 text-foreground">
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="flex items-center gap-3 text-3xl font-bold"><History className="text-brand-green" />Activity Log</h1><p className="mt-2 text-sm text-muted-foreground">Review recorded account and CRM activity. Times use your browser's local timezone.</p></div>
      <Button variant="outline" disabled={loading} onClick={() => setRefresh((value) => value + 1)}><RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</Button>
    </header>
    <form className="grid items-end gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2 xl:grid-cols-4" onSubmit={(event) => {
      event.preventDefault()
      if (filters.start && filters.end && filters.start > filters.end) { setError("End date must be on or after the start date."); return }
      setPage(1); setApplied({ ...filters })
    }}>
      <label className="space-y-2 text-sm font-medium">Activity<select className="h-10 w-full rounded-md border border-input bg-background px-3 capitalize" value={filters.action} onChange={(event) => setFilters({ ...filters, action: event.target.value })}><option value="">All activities</option>{actions.map((action) => <option key={action} value={action}>{label(action)}</option>)}</select></label>
      <label className="space-y-2 text-sm font-medium">From<Input type="date" value={filters.start} onChange={(event) => setFilters({ ...filters, start: event.target.value })} /></label>
      <label className="space-y-2 text-sm font-medium">To<Input type="date" min={filters.start || undefined} value={filters.end} onChange={(event) => setFilters({ ...filters, end: event.target.value })} /></label>
      <div className="flex gap-2"><Button type="submit" disabled={loading} className="bg-accent text-accent-foreground hover:bg-brand-hover">Apply</Button><Button type="button" variant="outline" onClick={() => { const empty = { action: "", start: "", end: "" }; setFilters(empty); setApplied(empty); setPage(1) }}>Clear</Button></div>
    </form>
    {error && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</p>}
    <section className="overflow-hidden rounded-2xl border border-border bg-card" aria-busy={loading} aria-label="Recorded activities">
      {loading ? <div role="status" className="flex items-center justify-center gap-2 p-12 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" />Loading activity...</div> : result?.data.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-muted text-muted-foreground"><tr>{["Time", "User", "Activity", "Resource", "Result"].map((heading) => <th scope="col" key={heading} className="px-5 py-4 font-medium">{heading}</th>)}</tr></thead><tbody>{result.data.map((log) => <tr key={log._id} className="border-t border-border hover:bg-muted/50">
        <td className="whitespace-nowrap px-5 py-4"><time dateTime={log.createdAt}>{new Date(log.createdAt).toLocaleString()}</time></td>
        <td className="px-5 py-4"><p className="font-medium">{log.userId?.name || (log.action === "CUSTOMER_CENTER" ? "System" : "Deleted or unavailable user")}</p><p className="text-xs text-muted-foreground">{log.userId?.email}</p></td>
        <td className="px-5 py-4 capitalize">{label(log.action)}{log.action === "CUSTOMER_CENTER" && log.changes?.event && <span className="block text-xs text-muted-foreground">{label(log.changes.event)}</span>}</td><td className="px-5 py-4">{log.resourceType || "System"}</td>
        <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${log.status === "success" ? "bg-accent/10 text-brand-green" : "bg-destructive/10 text-destructive"}`}>{log.status}</span></td>
      </tr>)}</tbody></table></div> : <p className="p-12 text-center text-muted-foreground">{error ? "Activity is currently unavailable." : "No recorded activity matches these filters."}</p>}
    </section>
    {result && !loading && <div className="flex flex-wrap items-center justify-between gap-3 text-sm"><p className="text-muted-foreground">{result.total} records &middot; Page {page} of {Math.max(1, result.pages)}</p><div className="flex gap-2"><Button variant="outline" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</Button><Button variant="outline" disabled={page >= result.pages} onClick={() => setPage((value) => value + 1)}>Next</Button></div></div>}
  </div>
}
