"use client"
import { useMemo, useState } from "react"
import { action, control, ErrorNotice, format, Panel } from "./shared"
export type Row = Record<string, string | number | null>
export type Report = { data: Row[] | null; error: string | null; fetchedAt: string | null }
export function ReportTable({ title, report, columns, previous, identity, onPage, opportunities = false }: { title: string; report?: Report; columns: [string, string][]; previous?: Report; identity: string; onPage?: (url: string) => void; opportunities?: boolean }) {
  const [query, setQuery] = useState(""), [page, setPage] = useState(0), [group, setGroup] = useState("All"), [sort, setSort] = useState(columns[1]?.[0] || identity)
  const previousRows = useMemo(() => new Map((previous?.data || []).map(row => [row[identity], row])), [previous, identity])
  const rows = (report?.data || []).filter(row => {
    if (!String(row[identity]).toLowerCase().includes(query.toLowerCase())) return false
    const old = previousRows.get(row[identity]), metric = identity === "landingPagePlusQueryString" ? "sessions" : "clicks"
    if (group === "Growing" || group === "Declining") return old && typeof old[metric] === "number" && typeof row[metric] === "number" && (group === "Growing" ? row[metric] > old[metric] : row[metric] < old[metric])
    if (group === "Low CTR") return Number(row.impressions) >= 100 && Number(row.ctr) < 0.02
    if (group === "Positions 8–20") return Number(row.impressions) >= 100 && Number(row.position) >= 8 && Number(row.position) <= 20
    return true
  }).sort((a, b) => typeof a[sort] === "number" && typeof b[sort] === "number" ? Number(b[sort]) - Number(a[sort]) : String(a[sort]).localeCompare(String(b[sort])))
  const currentPage = Math.min(page, Math.max(0, Math.ceil(rows.length / 15) - 1))
  return <Panel title={title}>{report?.error ? <ErrorNotice error={report.error}/> : <>
    <div className="mb-3 flex flex-wrap gap-2"><input className={`${control} min-w-0 flex-1`} aria-label={`Search ${title}`} placeholder="Filter rows…" value={query} onChange={e => { setQuery(e.target.value); setPage(0) }}/>{(previous || opportunities) && <select className={control} aria-label={`${title} group`} value={group} onChange={e => { setGroup(e.target.value); setPage(0) }}><option>All</option>{previous && <><option>Growing</option><option>Declining</option></>}{opportunities && <><option>Low CTR</option><option>Positions 8–20</option></>}</select>}</div>
    {!rows.length ? <p className="py-5 text-sm text-muted-foreground">No data available for this period or filter.</p> : <div className="max-w-full overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{columns.map(([key, label]) => <th className="whitespace-nowrap border-b border-border p-3" key={key}><button onClick={() => setSort(key)}>{label} {sort === key ? "↓" : ""}</button></th>)}{previous && <th className="whitespace-nowrap border-b border-border p-3">Previous / change</th>}</tr></thead><tbody>{rows.slice(currentPage * 15, currentPage * 15 + 15).map((row, i) => <tr key={`${row[identity]}:${i}`} className="border-b border-border/60">{columns.map(([key]) => <td className="max-w-72 break-words p-3 tabular-nums" key={key}>{key === identity && onPage ? <button className="text-left underline underline-offset-4" onClick={() => onPage(String(row[key]))}>{format(row[key])}</button> : format(row[key], ["ctr", "engagementRate"].includes(key))}</td>)}{previous && <td className="p-3 tabular-nums">{(() => { const old = previousRows.get(row[identity]); const key = "position" in row ? "position" : "sessions"; return old && typeof old[key] === "number" && typeof row[key] === "number" ? `${format(old[key])} / ${format(key === "position" ? Number(old[key]) - Number(row[key]) : Number(row[key]) - Number(old[key]))}${key === "position" ? " positions gained" : " sessions"}` : "N/A" })()}</td>}</tr>)}</tbody></table></div>}
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground"><span>{rows.length} rows · up to 10,000 returned{opportunities ? " · opportunities require ≥100 impressions" : ""}</span><div className="flex items-center gap-2"><button className={action} disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>Previous</button><span>{currentPage + 1}</span><button className={action} disabled={(currentPage + 1) * 15 >= rows.length} onClick={() => setPage(currentPage + 1)}>Next</button></div></div>
  </>}</Panel>
}
