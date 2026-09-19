export type DateRange = { startDate: string; endDate: string }
export function dateRange(start: string | null, end: string | null): DateRange {
  const today = new Date().toISOString().slice(0, 10)
  start ||= new Date(Date.now() - 27 * 86400000).toISOString().slice(0, 10)
  end ||= today
  for (const value of [start, end]) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value) throw new Error("INVALID_DATE_RANGE")
  }
  if (start > end || end > today || Date.parse(end) - Date.parse(start) > 365 * 86400000) throw new Error("INVALID_DATE_RANGE")
  return { startDate: start, endDate: end }
}
export function previousRange(range: DateRange): DateRange {
  const days = Date.parse(range.endDate) - Date.parse(range.startDate) + 86400000
  return { startDate: new Date(Date.parse(range.startDate) - days).toISOString().slice(0, 10), endDate: new Date(Date.parse(range.startDate) - 86400000).toISOString().slice(0, 10) }
}
