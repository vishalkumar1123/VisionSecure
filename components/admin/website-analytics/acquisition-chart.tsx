"use client"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { Panel, ErrorNotice } from "./shared"
import type { Report } from "./report-table"
export default function AcquisitionChart({ report }: { report?: Report }) {
  return <Panel title="Sessions by channel">{report?.error ? <ErrorNotice error={report.error}/> : !report?.data?.length ? <p className="text-sm text-muted-foreground">No acquisition data available.</p> : <div className="h-72 min-w-0"><ResponsiveContainer width="100%" height="100%"><BarChart data={report.data.slice(0, 10)} layout="vertical" margin={{ left: 8, right: 15 }}><CartesianGrid stroke="var(--border)" strokeDasharray="3 3"/><XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}/><YAxis type="category" dataKey="sessionDefaultChannelGroup" width={85} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}/><Tooltip contentStyle={{ background: "var(--card)", color: "var(--foreground)", borderColor: "var(--border)", borderRadius: 12 }}/><Bar dataKey="sessions" name="Sessions" fill="#08A8E8" radius={[0, 5, 5, 0]} isAnimationActive={false}/></BarChart></ResponsiveContainer></div>}</Panel>
}
