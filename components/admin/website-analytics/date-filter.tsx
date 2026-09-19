"use client"
import { useState } from "react"
import { control } from "./shared"
export type Range = { start: string; end: string; compare: boolean }
const iso = (date: Date) => date.toISOString().slice(0, 10)
export function presetRange(preset: string): Range {
  const end = new Date(), start = new Date()
  if (preset === "Yesterday") { start.setUTCDate(start.getUTCDate() - 1); end.setUTCDate(end.getUTCDate() - 1) }
  else if (preset === "This Month") start.setUTCDate(1)
  else if (preset === "Last Month") { start.setUTCDate(1); start.setUTCMonth(start.getUTCMonth() - 1); end.setUTCDate(0) }
  else if (preset !== "Today") start.setUTCDate(start.getUTCDate() - (Number.parseInt(preset) - 1))
  return { start: iso(start), end: iso(end), compare: true }
}
export default function DateFilter({ range, onChange }: { range: Range; onChange: (range: Range) => void }) {
  const [preset, setPreset] = useState("28 Days")
  return <div className="flex min-w-0 flex-wrap items-end gap-3"><label className="grid gap-1 text-xs">Date range<select aria-label="Date range" className={control} value={preset} onChange={e => { setPreset(e.target.value); if (e.target.value !== "Custom") onChange({ ...presetRange(e.target.value), compare: range.compare }) }}>{["Today", "Yesterday", "7 Days", "28 Days", "30 Days", "90 Days", "This Month", "Last Month", "Custom"].map(p => <option key={p}>{p}</option>)}</select></label>
    <label className="grid min-w-0 gap-1 text-xs">From<input type="date" className={`${control} max-w-full`} value={range.start} max={range.end} onChange={e => { setPreset("Custom"); onChange({ ...range, start: e.target.value }) }}/></label><label className="grid min-w-0 gap-1 text-xs">To<input type="date" className={`${control} max-w-full`} value={range.end} min={range.start} max={iso(new Date())} onChange={e => { setPreset("Custom"); onChange({ ...range, end: e.target.value }) }}/></label>
    <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={range.compare} onChange={e => onChange({ ...range, compare: e.target.checked })}/>Compare previous period</label></div>
}
