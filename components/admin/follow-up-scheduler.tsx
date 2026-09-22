"use client"
import { useState } from "react"
import { followUpISO, istFields } from "@/lib/follow-up-time"
export default function FollowUpScheduler({ value, busy, save }: { value?: string | null; busy: boolean; save: (value: string | null) => Promise<boolean> }) {
  const initial = istFields(value)
  const [date, setDate] = useState(initial.date), [time, setTime] = useState(initial.time), [error, setError] = useState("")
  const field = "mt-2 min-h-11 w-full min-w-0 rounded-lg border border-border bg-background px-3 text-foreground"
  return <form id="follow-up" className="mt-5 scroll-mt-24 space-y-4" onSubmit={async event => { event.preventDefault(); setError(""); try { const next = followUpISO(date, time); if (Date.parse(next) <= Date.now()) throw new Error("Choose a future time for your next follow-up."); await save(next) } catch (e) { setError((e as Error).message) } }}>
    <div><h3 className="font-semibold">Schedule a follow-up</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">Choose both date and time in India Standard Time (IST). Save to add this call to your schedule.</p></div>
    <div className="grid min-w-0 gap-3 sm:grid-cols-2"><label className="min-w-0 text-sm">Follow-up date<input required type="date" className={field} value={date} disabled={busy} onChange={e => setDate(e.target.value)}/></label><label className="min-w-0 text-sm">Follow-up time (IST)<input required type="time" step={60} className={field} value={time} disabled={busy} onChange={e => setTime(e.target.value)}/></label></div>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <div className="flex flex-wrap gap-2"><button disabled={busy || !date || !time} className="min-h-11 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground disabled:opacity-50">{busy ? "Saving…" : value ? "Update follow-up" : "Save follow-up"}</button>{value && <button type="button" disabled={busy} className="min-h-11 rounded-lg border border-border px-4 text-sm" onClick={async () => { if (await save(null)) { setDate(""); setTime(""); setError("") } }}>Clear follow-up</button>}</div>
    <p className="rounded-lg bg-muted p-3 text-sm">{value ? `Scheduled: ${new Date(value).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })} IST` : "No follow-up scheduled yet."}</p>
    <p className="text-xs leading-5 text-muted-foreground">Today's appointments appear on the dashboard. This schedules a team follow-up; it does not automatically call or send a WhatsApp message.</p>
  </form>
}
