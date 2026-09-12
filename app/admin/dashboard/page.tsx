"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { Activity, ArrowRight, BarChart3, CalendarDays, CheckCircle2, ClipboardList, RefreshCw, TrendingDown, TrendingUp, Users, UserPlus } from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type Lead = {
  _id: string
  name: string
  phone: string
  service?: string
  status?: string
  createdAt?: string
}

type AnalyticsData = {
  totalLeads: number
  activeLeads: number
  newLeads: number
  followUpLeads: number
  quotationLeads: number
  installationLeads: number
  convertedLeads: number
  closedLeads: number
  todayLeads: number
  conversionRate: number
  latestLeads: Lead[]
  dailyTrend: Array<{ date: string; label: string; total: number }>
  current30Days: number
  previous30Days: number
  leadTrendPercentage: number
}

const statusClass: Record<string, string> = {
  New: "bg-sky-400/10 text-sky-300 ring-sky-400/20",
  "In Discussion": "bg-violet-400/10 text-violet-300 ring-violet-400/20",
  "Follow-Up": "bg-amber-400/10 text-amber-300 ring-amber-400/20",
  "Quotation Sent": "bg-fuchsia-400/10 text-fuchsia-300 ring-fuchsia-400/20",
  "Installation Scheduled": "bg-cyan-400/10 text-cyan-300 ring-cyan-400/20",
  "Installed Successfully": "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  Cancelled: "bg-rose-400/10 text-rose-300 ring-rose-400/20",
}

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const reduceMotion = useReducedMotion()

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const response = await fetch("/api/analytics", { cache: "no-store" })
      if (!response.ok) throw new Error("Unable to load dashboard data")
      setData(await response.json() as AnalyticsData)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void loadDashboard() }, [loadDashboard])

  const pipeline = useMemo(() => [
    { label: "New", value: data?.newLeads ?? 0, color: "bg-sky-400" },
    { label: "Follow-ups", value: data?.followUpLeads ?? 0, color: "bg-amber-400" },
    { label: "Quotations", value: data?.quotationLeads ?? 0, color: "bg-violet-400" },
    { label: "Installation", value: data?.installationLeads ?? 0, color: "bg-cyan-400" },
    { label: "Installed", value: data?.convertedLeads ?? 0, color: "bg-emerald-400" },
  ], [data])
  const pipelineMax = Math.max(1, ...pipeline.map((item) => item.value))

  if (loading) return <DashboardSkeleton />

  if (error || !data) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="max-w-md rounded-2xl border border-white/10 bg-[#10151d] p-8 text-center"><Activity className="mx-auto h-8 w-8 text-cyan-300" /><h1 className="mt-4 text-xl font-bold text-white">Dashboard data could not be loaded</h1><p className="mt-2 text-sm leading-6 text-slate-400">Please check your connection and try again.</p><button type="button" onClick={() => void loadDashboard()} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2.5 font-semibold text-slate-950"><RefreshCw className="h-4 w-4" />Retry</button></div></div>
  }

  const cards = [
    { label: "Total leads", value: data.totalLeads, detail: `${data.activeLeads} active in pipeline`, icon: Users, color: "text-cyan-300", href: "/admin/leads" },
    { label: "New today", value: data.todayLeads, detail: `${data.newLeads} new leads overall`, icon: UserPlus, color: "text-sky-300", href: "/admin/leads" },
    { label: "Conversion rate", value: `${data.conversionRate}%`, detail: `${data.convertedLeads} converted leads`, icon: BarChart3, color: "text-emerald-300", href: "/admin/analytics" },
    { label: "Follow-ups", value: data.followUpLeads, detail: "Require timely action", icon: CalendarDays, color: "text-amber-300", href: "/admin/leads" },
  ]

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-8 text-white">
      <header className="flex flex-col justify-between gap-5 rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(56,199,233,.16),transparent_35%),#0d1117] p-6 shadow-xl shadow-black/10 sm:p-8 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[.16em] text-cyan-300">VisionSecure control center</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Business overview</h1>
          <p className="mt-3 max-w-xl leading-7 text-slate-400">Track incoming requirements, lead progress and operational work from one place.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => void loadDashboard()} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/5"><RefreshCw className="h-4 w-4" />Refresh</button>
          <Link href="/admin/leads" className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200"><UserPlus className="h-4 w-4" />View leads</Link>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Lead performance summary">
        {cards.map((card, index) => {
          const Icon = card.icon
          return <motion.div key={card.label} initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .28, delay: reduceMotion ? 0 : index * .05 }}><Link href={card.href} className="group block rounded-2xl border border-white/10 bg-[#10151d] p-5 transition hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-[#121b27]"><div className="flex items-start justify-between"><p className="text-sm font-medium text-slate-400">{card.label}</p><Icon className={`h-5 w-5 ${card.color}`} /></div><p className="mt-5 text-4xl font-bold tracking-tight">{card.value}</p><p className="mt-3 flex items-center gap-1 text-sm text-slate-400">{card.detail}<ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" /></p></Link></motion.div>
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
        <div className="rounded-2xl border border-white/10 bg-[#10151d] p-6 sm:p-7">
          <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[.14em] text-cyan-300">Lead pipeline</p><h2 className="mt-2 text-xl font-bold">Current operational progress</h2></div><ClipboardList className="h-5 w-5 text-slate-500" /></div>
          <div className="mt-7 space-y-5">{pipeline.map((item, index) => <motion.div key={item.label} initial={reduceMotion ? false : { opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduceMotion ? 0 : .24, delay: reduceMotion ? 0 : index * .05 }}><div className="mb-2 flex justify-between text-sm"><span className="font-medium text-slate-300">{item.label}</span><span className="font-semibold text-white">{item.value}</span></div><div className="h-2 overflow-hidden rounded-full bg-white/5"><motion.div className={`h-full rounded-full ${item.color}`} initial={{ width: 0 }} animate={{ width: `${(item.value / pipelineMax) * 100}%` }} transition={{ duration: reduceMotion ? 0 : .55, delay: reduceMotion ? 0 : index * .07 }} /></div></motion.div>)}</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#10151d] p-6 sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-[.14em] text-cyan-300">At a glance</p>
          <h2 className="mt-2 text-xl font-bold">What needs attention</h2>
          <div className="mt-6 space-y-3"><Insight icon={CheckCircle2} label="Active pipeline" value={data.activeLeads} text="Leads currently being worked on" color="text-cyan-300" /><Insight icon={CalendarDays} label="Follow-ups" value={data.followUpLeads} text="Keep customers updated on next steps" color="text-amber-300" /><Insight icon={Activity} label="Cancelled leads" value={data.closedLeads} text="Opportunities cancelled without installation" color="text-rose-300" /></div>
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-300/15 bg-[#081a2e] p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[.14em] text-cyan-300">Business momentum</p><h2 className="mt-2 text-xl font-bold">30-day lead growth</h2><p className="mt-2 text-sm text-slate-400">Compared with the previous 30 days.</p></div><div className={`flex items-center gap-2 rounded-xl border px-4 py-3 ${data.leadTrendPercentage >= 0 ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : "border-rose-400/20 bg-rose-400/10 text-rose-300"}`}>{data.leadTrendPercentage >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}<div><p className="text-lg font-bold">{data.leadTrendPercentage > 0 ? "+" : ""}{data.leadTrendPercentage}%</p><p className="text-xs opacity-80">{data.current30Days} vs {data.previous30Days} leads</p></div></div></div>
        <div className="mt-7 h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data.dailyTrend} margin={{ left: -20, right: 8 }}><defs><linearGradient id="leadGrowth" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22d3ee" stopOpacity={0.38} /><stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} /></linearGradient></defs><CartesianGrid stroke="#1e3a50" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="label" stroke="#7890a5" tickLine={false} axisLine={false} interval={4} fontSize={12} /><YAxis allowDecimals={false} stroke="#7890a5" tickLine={false} axisLine={false} fontSize={12} /><Tooltip contentStyle={{ background: "#07182b", border: "1px solid #164e63", borderRadius: 10 }} /><Area type="monotone" dataKey="total" name="Leads" stroke="#22d3ee" strokeWidth={3} fill="url(#leadGrowth)" /></AreaChart></ResponsiveContainer></div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#10151d] p-6 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[.14em] text-cyan-300">Recent activity</p><h2 className="mt-2 text-xl font-bold">Latest customer requirements</h2></div><Link href="/admin/leads" className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-100">Open lead manager <ArrowRight className="ml-1 inline h-4 w-4" /></Link></div>
        {data.latestLeads.length === 0 ? <div className="mt-7 rounded-xl border border-dashed border-white/15 p-10 text-center text-slate-400">No leads yet. New website enquiries will appear here.</div> : <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead className="border-b border-white/10 text-xs uppercase tracking-[.12em] text-slate-500"><tr><th className="pb-3 font-medium">Customer</th><th className="pb-3 font-medium">Service</th><th className="pb-3 font-medium">Status</th><th className="pb-3 text-right font-medium">Action</th></tr></thead><tbody>{data.latestLeads.map((lead) => <tr key={lead._id} className="border-b border-white/5 last:border-0"><td className="py-4"><p className="font-semibold text-slate-100">{lead.name}</p><p className="mt-1 text-sm text-slate-500">{lead.phone}</p></td><td className="py-4 text-sm text-slate-300">{lead.service || "General enquiry"}</td><td className="py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusClass[lead.status || ""] || "bg-white/5 text-slate-300 ring-white/10"}`}>{lead.status || "New"}</span></td><td className="py-4 text-right"><Link href={`/admin/leads/${lead._id}`} className="text-sm font-semibold text-cyan-300 hover:text-cyan-100">View</Link></td></tr>)}</tbody></table></div>}
      </section>
    </div>
  )
}

function Insight({ icon: Icon, label, value, text, color }: { icon: typeof Activity; label: string; value: number; text: string; color: string }) {
  return <div className="flex items-center gap-4 rounded-xl border border-white/8 bg-white/[.025] p-4"><Icon className={`h-5 w-5 shrink-0 ${color}`} /><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="font-semibold text-slate-200">{label}</p><span className="font-bold text-white">{value}</span></div><p className="mt-1 text-sm text-slate-500">{text}</p></div></div>
}

function DashboardSkeleton() {
  return <div className="mx-auto max-w-7xl animate-pulse space-y-6"><div className="h-48 rounded-3xl bg-white/5" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-40 rounded-2xl bg-white/5" />)}</div><div className="grid gap-6 lg:grid-cols-2"><div className="h-80 rounded-2xl bg-white/5" /><div className="h-80 rounded-2xl bg-white/5" /></div></div>
}
