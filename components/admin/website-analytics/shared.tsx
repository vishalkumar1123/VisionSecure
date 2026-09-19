"use client"
import type { ReactNode } from "react"

export const control = "min-h-11 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground disabled:opacity-50"
export const action = `${control} font-medium hover:bg-accent hover:text-accent-foreground`
export function Panel({ title, children }: { title: string; children: ReactNode }) { return <section className="min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5"><h2 className="mb-4 text-lg font-semibold">{title}</h2>{children}</section> }
export const messages: Record<string, string> = {
  NOT_CONNECTED: "Connect Google in Settings → Integrations to view website analytics.",
  CONFIGURATION_REQUIRED: "Google application credentials and encryption key need configuration.",
  PERMISSION_OR_API_DISABLED: "Permission required: check property access and enable the relevant Google API.",
  AUTH_REVOKED_RECONNECT: "Google authorization expired or was revoked. Reconnect in Settings → Integrations.",
  QUOTA_EXCEEDED: "Google quota reached. Try again later.",
  RATE_LIMITED_TRY_LATER: "Please wait before running another refresh or test.",
  PAGESPEED_CONFIGURATION_REQUIRED: "PageSpeed needs configuration. Enable the PageSpeed Insights API and configure its optional API key.",
  PAGESPEED_QUOTA_EXCEEDED: "PageSpeed quota reached. Wait or configure a dedicated API key.",
  INVALID_DATE_RANGE: "Choose valid dates, no future dates, with at most 366 days.",
}
export function ErrorNotice({ error }: { error: string }) { return <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground">{messages[error] || error.replaceAll("_", " ")}</p> }
export async function api<T>(url: string, method = "GET", signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { method, signal, cache: "no-store" })
  const result = await response.json()
  if (!response.ok) throw new Error(result.error || "SERVICE_UNAVAILABLE")
  return result
}
export function format(value: unknown, percent = false) {
  if (value === null || value === undefined) return "N/A"
  if (typeof value === "number") return percent ? `${(value * 100).toFixed(2)}%` : value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  return String(value)
}
export function MetricCard({ label, value, previous, percent = false, lowerBetter = false }: { label: string; value: unknown; previous?: unknown; percent?: boolean; lowerBetter?: boolean }) {
  const change = typeof value === "number" && typeof previous === "number" && previous !== 0 ? ((value - previous) / Math.abs(previous)) * 100 : null
  return <div className="rounded-2xl border border-border bg-card p-4 shadow-sm"><p className="text-sm text-muted-foreground">{label}</p><p className="my-2 text-2xl font-semibold tabular-nums">{format(value, percent)}</p>{previous !== undefined && <p className={`text-xs ${change === null || change === 0 ? "text-muted-foreground" : (lowerBetter ? change < 0 : change > 0) ? "text-emerald-700 dark:text-emerald-400" : "text-orange-700 dark:text-orange-400"}`}>{change === null ? "Comparison unavailable" : lowerBetter ? `${Math.abs(change).toFixed(1)}% ${change < 0 ? "improvement" : change > 0 ? "decline" : "change"} vs previous period` : `${change > 0 ? "+" : ""}${change.toFixed(1)}% vs previous period`}</p>}</div>
}
