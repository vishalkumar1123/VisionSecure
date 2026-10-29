"use client"

import Link from "next/link"
import { CalendarDays, ArrowUpRight, Clock3, Phone, ChevronLeft, ChevronRight } from "lucide-react"
import { businessDay, DAY_MS } from "@/lib/dashboard-time"
import type { DashboardLead } from "./types"

function CallList({ leads, dated = true }: { leads: DashboardLead[]; dated?: boolean }) {
 return <ol className="mt-3 max-h-80 space-y-3 overflow-y-auto pr-1">{leads.map(lead => <li key={lead._id} className="rounded-xl border border-border bg-card p-3">
   <div className="flex flex-wrap items-center justify-between gap-2 text-xs"><span className="font-semibold text-highlight-ink">{dated && lead.followUpDate ? <time dateTime={lead.followUpDate}>{new Date(lead.followUpDate).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })} IST</time> : "Date/time not set"}</span><span className="text-muted-foreground">{lead.status}</span></div>
   <Link href={`/admin/leads/${lead._id}#follow-up`} className="mt-2 inline-flex min-h-9 items-center gap-2 break-words text-sm font-semibold hover:underline">{lead.name}<ArrowUpRight size={14}/></Link>
   <p className="text-xs text-muted-foreground">{lead.service || "General enquiry"} / {lead.assignedTo?.name || "Unassigned"}</p>
   {lead.address && <p className="mt-2 whitespace-pre-wrap break-words text-xs text-muted-foreground">Address: {lead.address}</p>}
   <p className="mt-2 whitespace-pre-wrap break-words text-xs leading-5"><span className="font-semibold">Latest follow-up note: </span>{lead.notes?.at(-1)?.text || "No note saved. Open lead to review and add the next action."}</p>
   <div className="mt-3 flex flex-wrap items-center justify-between gap-2"><a href={`tel:${lead.phone.replace(/[^+\d]/g, "")}`} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border px-3 text-xs font-semibold text-brand-ink"><Phone size={14}/>Call {lead.phone}</a><Link href={`/admin/leads/${lead._id}#follow-up`} className="inline-flex min-h-10 items-center text-xs font-semibold text-brand-green">{dated ? "Review / reschedule" : "Set follow-up date"}</Link></div>
 </li>)}</ol>
}

export function TodaySchedule({ leads, total, date, selectedDate, onDateChange, busy, overdue, overdueTotal, unscheduled }: {
 leads: DashboardLead[]; total: number | null; date?: string; selectedDate?: string; onDateChange?: (date: string) => void; busy?: boolean; overdue?: DashboardLead[] | null; overdueTotal?: number; unscheduled?: DashboardLead[] | null
}) {
 const today = businessDay().key, shownDate = date || today
 const move = (offset: number) => onDateChange?.(businessDay(new Date(new Date(`${selectedDate || shownDate}T00:00:00+05:30`).getTime() + offset * DAY_MS)).key)
 return <section aria-label="Follow-up call schedule" aria-busy={busy}>
   <div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-bold">{shownDate === today ? "Today's schedule" : "Follow-up schedule"}</h2><p className="mt-1 text-xs text-muted-foreground">Calls and follow-up notes / India time (IST)</p></div><CalendarDays size={22} className="shrink-0 text-highlight-ink"/></div>
   {onDateChange && <div className="mt-4 flex flex-wrap items-center gap-2"><button aria-label="Previous schedule day" disabled={busy} className="min-h-11 rounded-lg border border-border px-2 disabled:opacity-50" onClick={()=>move(-1)}><ChevronLeft size={18}/></button><label className="min-w-0 flex-1 text-xs">Schedule date<input aria-label="Schedule date" type="date" value={selectedDate || shownDate} disabled={busy} onChange={e=>{if(e.target.value)onDateChange(e.target.value)}} className="mt-1 block min-h-11 w-full min-w-0 rounded-lg border border-border px-2"/></label><button aria-label="Next schedule day" disabled={busy} className="min-h-11 rounded-lg border border-border px-2 disabled:opacity-50" onClick={()=>move(1)}><ChevronRight size={18}/></button><button disabled={busy} className="min-h-11 rounded-lg border border-border px-3 text-xs font-semibold disabled:opacity-50" onClick={()=>onDateChange("")}>Today</button></div>}
   <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted/50 px-3 py-2 text-xs"><span>{total === null ? "Appointments (count unavailable)" : `${total} scheduled follow-up${total===1?"":"s"}`} / {shownDate}</span><Link href={`/admin/leads?followUpDay=${shownDate}`} className="inline-flex min-h-9 items-center gap-1 font-semibold text-brand-green">View day's leads <ArrowUpRight size={14}/></Link></div>
   {busy && <p role="status" className="mt-2 text-xs text-muted-foreground">Updating schedule…</p>}
   {!leads.length ? <div className="py-6 text-center"><Clock3 size={24} className="mx-auto text-highlight-ink"/><p className="mt-2 text-sm font-semibold">No appointments for this day</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Changing status to Follow-Up adds the lead to the follow-up queue. Save a date and time on the lead to add a call appointment.</p></div> : <CallList leads={leads}/>}
   {total!==null && total>leads.length && <p className="mt-2 text-xs text-muted-foreground">Showing first {leads.length}. View day's leads for all {total} appointments.</p>}
   <div className="mt-4 border-t border-border pt-4"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-semibold">Overdue calls {overdueTotal !== undefined ? `(${overdueTotal})` : ""}</h3><Link href="/admin/leads?filter=overdue" className="inline-flex min-h-9 items-center text-xs font-semibold text-brand-green">View all overdue</Link></div>{overdue === null ? <p role="alert" className="text-xs">Unable to load overdue calls. Refresh to retry.</p> : overdue?.length ? <CallList leads={overdue}/> : <p className="text-xs text-muted-foreground">No overdue calls.</p>}</div>
   {overdue && overdueTotal !== undefined && overdueTotal > overdue.length && <p className="mt-2 text-xs text-muted-foreground">Showing first {overdue.length} overdue calls. View all overdue for the full list.</p>}
   <div className="mt-4 border-t border-border pt-4"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-semibold">Follow-ups needing a date</h3><Link href="/admin/leads?filter=unscheduled" className="inline-flex min-h-9 items-center text-xs font-semibold text-brand-green">View all unscheduled</Link></div>{unscheduled === null ? <p role="alert" className="text-xs">Unable to load unscheduled follow-ups. Refresh to retry.</p> : unscheduled?.length ? <><CallList leads={unscheduled} dated={false}/><p className="mt-2 text-xs text-muted-foreground">Up to 20 recently updated leads. Set the next call date after reviewing the lead.</p></> : <p className="text-xs text-muted-foreground">No follow-ups waiting for a date.</p>}</div>
 </section>
}
