"use client"
import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts"
import type { Report } from "./report-table"
import { control, ErrorNotice, Panel } from "./shared"
export default function Trend({ title, report, search = false }: { title: string; report?: Report; search?: boolean }) {
  const [aggregation, setAggregation] = useState("Daily")
  const groups = new Map<string, Record<string, string | number>>()
  for (const row of report?.data || []) {
    const raw = String(row.date), day = /^\d{8}$/.test(raw) ? `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6)}` : raw
    const date = new Date(day)
    if (aggregation === "Weekly") date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7))
    const label = aggregation === "Monthly" ? day.slice(0, 7) : aggregation === "Weekly" ? date.toISOString().slice(0, 10) : day
    const value = groups.get(label) || { date: label }
    // Sessions/views are additive. Unique daily users are never summed into a weekly/monthly user count.
    for (const key of search ? ["clicks", "impressions"] : aggregation === "Daily" ? ["totalUsers", "sessions", "screenPageViews"] : ["sessions", "screenPageViews"]) value[key] = Number(value[key] || 0) + Number(row[key] || 0)
    groups.set(label, value)
  }
  const keys = search ? ["clicks", "impressions"] : aggregation === "Daily" ? ["totalUsers", "sessions", "screenPageViews"] : ["sessions", "screenPageViews"]
  return <Panel title={title}><select aria-label={`${title} aggregation`} className={`${control} mb-3`} value={aggregation} onChange={e => setAggregation(e.target.value)}>{["Daily", "Weekly", "Monthly"].map(a => <option key={a}>{a}</option>)}</select>{report?.error ? <ErrorNotice error={report.error}/> : !groups.size ? <p className="py-12 text-center text-sm text-muted-foreground">No trend data for this period.</p> : <div className="h-72 min-w-0"><ResponsiveContainer width="100%" height="100%"><LineChart data={[...groups.values()].sort((a, b) => String(a.date).localeCompare(String(b.date)))}><CartesianGrid stroke="var(--border)" strokeDasharray="3 3"/><XAxis dataKey="date" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}/><YAxis width={45} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}/>{search && <YAxis yAxisId="right" orientation="right" width={50} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}/>}<Tooltip contentStyle={{ background: "var(--card)", color: "var(--foreground)", borderColor: "var(--border)", borderRadius: 12 }}/><Legend/>{keys.map((key, i) => <Line key={key} dataKey={key} name={key === "totalUsers" ? "Users" : key === "screenPageViews" ? "Views" : key} yAxisId={search && key === "impressions" ? "right" : 0} stroke={["#08A8E8", "#79C914", "#F59E0B"][i]} strokeWidth={2} dot={false} isAnimationActive={false}/>)}</LineChart></ResponsiveContainer></div>}{!search && aggregation !== "Daily" && <p className="mt-2 text-xs text-muted-foreground">Unique users are shown only at daily granularity to avoid double-counting.</p>}</Panel>
}
