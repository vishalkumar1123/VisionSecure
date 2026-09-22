"use client"

import { use, useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Clock3, Mail, MessageSquarePlus, Phone, ShieldCheck } from "lucide-react"
import FollowUpScheduler from "@/components/admin/follow-up-scheduler"
import { toast } from "sonner"
import { LEAD_PRIORITIES, LEAD_STATUSES } from "@/constants/leads"

type Lead = {
  _id: string; name: string; phone: string; email?: string; service?: string; budget?: string; message?: string
  source?: string; priority?: string; status?: string; followUpDate?: string | null; createdAt: string; updatedAt?: string
  notes?: Array<{ text: string; createdBy?: string; createdAt?: string }>
  timeline?: Array<{ action?: string; status?: string; createdAt?: string }>
}

const statusColor: Record<string, string> = { New: "border-highlight bg-highlight/15 text-highlight-ink", "In Discussion": "border-primary bg-primary/15 text-brand-ink", "Follow-Up": "border-warning bg-warning/15 text-warning", "Quotation Sent": "border-primary bg-primary/15 text-brand-ink", "Installation Scheduled": "border-highlight bg-highlight/15 text-highlight-ink", "Installed Successfully": "border-accent bg-accent/15 text-brand-green", Cancelled: "border-destructive bg-destructive/15 text-destructive", Converted: "border-accent bg-accent/15 text-brand-green", Closed: "border-destructive bg-destructive/15 text-destructive" }

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [lead, setLead] = useState<Lead | null>(null)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [note, setNote] = useState("")

  const loadLead = useCallback(async () => {
    try {
      const response = await fetch(`/api/leads/${id}`, { cache: "no-store" })
      const data = await response.json() as { lead?: Lead; error?: string }
      if (!response.ok || !data.lead) throw new Error(data.error || "Lead not found")
      setLead(data.lead)
    } catch (loadError) { setError(loadError instanceof Error ? loadError.message : "Unable to load lead") }
  }, [id])

  useEffect(() => { void loadLead() }, [loadLead])

  const updateLead = async (changes: Record<string, unknown>, successMessage: string) => {
    setSaving(true)
    try {
      const response = await fetch(`/api/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(changes) })
      const data = await response.json() as { lead?: Lead; error?: string }
      if (!response.ok || !data.lead) throw new Error(data.error || "Update failed")
      setLead(data.lead)
      toast.success(successMessage)
      return true
    } catch (updateError) { toast.error(updateError instanceof Error ? updateError.message : "Update failed"); return false } finally { setSaving(false) }
  }

  if (error) return <div className="text-foreground"><Link href="/admin/leads" className="text-highlight-ink">← Back to leads</Link><p className="mt-6 text-destructive">{error}</p></div>
  if (!lead) return <div className="animate-pulse text-muted-foreground">Loading lead…</div>

  const normalizedStatus = lead.status === "Converted" ? "Installed Successfully" : lead.status === "Closed" ? "Cancelled" : (lead.status || "New")
  const currentStep = Math.max(0, LEAD_STATUSES.indexOf(normalizedStatus as typeof LEAD_STATUSES[number]))
  const details = [["Service", lead.service], ["Budget", lead.budget], ["Source", lead.source], ["Submitted", new Date(lead.createdAt).toLocaleString("en-IN")]]

  return <div className="mx-auto max-w-7xl space-y-6 pb-10 text-foreground">
    <Link href="/admin/leads" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-highlight-ink"><ArrowLeft className="h-4 w-4" />Back to leads</Link>

    <header className="rounded-3xl border border-border bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.13),transparent_35%),var(--card)] p-6 sm:p-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><p className="text-sm font-semibold uppercase tracking-[.18em] text-highlight-ink">Lead tracking workspace</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">{lead.name}</h1><p className="mt-2 font-mono text-xs text-muted-foreground">VS-{lead._id.slice(-6).toUpperCase()}</p></div><span className={`h-fit rounded-full border px-4 py-2 text-sm font-semibold ${statusColor[lead.status || "New"]}`}>{lead.status || "New"}</span></div><div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><a href={`tel:${lead.phone}`} className="flex items-center gap-3 rounded-xl border border-border bg-background/20 p-4 hover:border-highlight/40"><Phone className="h-5 w-5 text-highlight-ink" />{lead.phone}</a>{lead.email && <a href={`mailto:${lead.email}`} className="flex items-center gap-3 rounded-xl border border-border bg-background/20 p-4 hover:border-highlight/40"><Mail className="h-5 w-5 text-highlight-ink" /><span className="truncate">{lead.email}</span></a>}{details.slice(0, 2).map(([label, value]) => <div key={label} className="rounded-xl border border-border bg-background/20 p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 truncate font-medium">{value || "Not provided"}</p></div>)}</div></header>

    <section className="rounded-2xl border border-border bg-card p-6"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold uppercase tracking-[.15em] text-highlight-ink">Step-by-step pipeline</p><h2 className="mt-2 text-2xl font-bold">Move the lead through its journey</h2></div><p className="text-sm text-muted-foreground">Step {currentStep + 1} of {LEAD_STATUSES.length}</p></div><ol className="mt-7 grid gap-3 md:grid-cols-4 xl:grid-cols-7">{LEAD_STATUSES.map((status, index) => { const completed = index <= currentStep; return <li key={status}><button disabled={saving} onClick={() => void updateLead({ status }, `Lead moved to ${status}`)} className={`flex h-full min-h-24 w-full flex-col items-start rounded-xl border p-4 text-left transition hover:-translate-y-0.5 disabled:opacity-60 ${completed ? statusColor[status] : "border-border bg-card/[.025] text-muted-foreground hover:border-highlight/40"}`}><span className="flex h-7 w-7 items-center justify-center rounded-full border border-current text-xs font-bold">{index < currentStep ? <Check className="h-4 w-4" /> : index + 1}</span><span className="mt-3 text-sm font-semibold leading-5">{status}</span></button></li> })}</ol></section>

    <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
      <div className="space-y-6"><section className="rounded-2xl border border-border bg-card p-6"><div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[.15em] text-highlight-ink"><ShieldCheck className="h-4 w-4" />Customer requirement</div><p className="mt-4 whitespace-pre-wrap leading-7 text-muted-foreground">{lead.message || lead.service || "No additional requirement provided."}</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{details.slice(2).map(([label, value]) => <div key={label} className="rounded-xl border border-border bg-background/20 p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 text-sm">{value || "Not provided"}</p></div>)}</div></section>
        <section className="rounded-2xl border border-border bg-card p-6"><h2 className="flex items-center gap-2 text-xl font-bold"><MessageSquarePlus className="h-5 w-5 text-highlight-ink" />Follow-up notes</h2><form className="mt-5" onSubmit={async (event) => { event.preventDefault(); if (!note.trim()) return; if (await updateLead({ note }, "Note added")) setNote("") }}><textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength={2000} placeholder="Add call outcome, customer preference, quotation update or next action…" className="min-h-28 w-full rounded-xl border border-border bg-background/20 p-4 text-sm outline-none focus:border-highlight" /><button disabled={saving || !note.trim()} className="mt-3 rounded-lg bg-highlight px-4 py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-50">Add note</button></form><div className="mt-6 space-y-3">{(lead.notes || []).slice().reverse().map((item, index) => <article key={`${item.createdAt}-${index}`} className="rounded-xl border border-border bg-background/20 p-4"><p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{item.text}</p><p className="mt-2 text-xs text-muted-foreground">{item.createdBy || "Admin"} · {item.createdAt ? new Date(item.createdAt).toLocaleString("en-IN") : "Recently"}</p></article>)}{!lead.notes?.length && <p className="text-sm text-muted-foreground">No follow-up notes yet.</p>}</div></section></div>

      <aside className="space-y-6"><section className="rounded-2xl border border-border bg-card p-6"><h2 className="text-xl font-bold">Next action</h2><label className="mt-5 block text-sm text-muted-foreground">Priority<select value={lead.priority || "Medium"} disabled={saving} onChange={(event) => void updateLead({ priority: event.target.value }, "Priority updated")} className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 text-foreground">{LEAD_PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}</select></label><FollowUpScheduler key={lead.followUpDate || "unscheduled"} value={lead.followUpDate} busy={saving} save={value => updateLead({ followUpDate: value }, value ? "Follow-up scheduled (IST)" : "Follow-up cleared")}/></section>
        <section className="rounded-2xl border border-border bg-card p-6"><h2 className="flex items-center gap-2 text-xl font-bold"><Clock3 className="h-5 w-5 text-highlight-ink" />Activity timeline</h2><div className="mt-5 space-y-0">{[...(lead.timeline || [])].reverse().map((event, index) => <div key={`${event.createdAt}-${index}`} className="relative border-l border-border pb-5 pl-5 last:pb-0"><span className="absolute -left-1.5 top-1 h-3 w-3 rounded-full border-2 border-border bg-highlight" /><p className="text-sm font-medium text-foreground">{event.action || event.status}</p><p className="mt-1 text-xs text-muted-foreground">{event.createdAt ? new Date(event.createdAt).toLocaleString("en-IN") : "Recently"}</p></div>)}<div className="relative border-l border-border pl-5"><span className="absolute -left-1.5 top-1 h-3 w-3 rounded-full border-2 border-border bg-highlight" /><p className="text-sm font-medium">Lead received</p><p className="mt-1 text-xs text-muted-foreground">{new Date(lead.createdAt).toLocaleString("en-IN")}</p></div></div></section></aside>
    </div>
  </div>
}
