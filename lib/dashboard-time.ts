export const BUSINESS_TIMEZONE = "Asia/Kolkata"
export const DAY_MS = 86_400_000
export const CLOSED_STATUSES = ["Converted", "Closed", "Installed Successfully", "Cancelled"]
export function businessDay(now = new Date()) {
  const key = new Intl.DateTimeFormat("en-CA", { timeZone: BUSINESS_TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(now)
  const start = new Date(`${key}T00:00:00+05:30`)
  return { key, start, end: new Date(start.getTime() + DAY_MS) }
}
export function greeting(hour: number) {
  return hour >= 5 && hour < 12 ? "Good Morning" : hour < 17 && hour >= 12 ? "Good Afternoon" : hour >= 17 && hour < 21 ? "Good Evening" : "Good Night"
}
export function relativeTime(value: string, now: number) {
  const minutes = Math.round((new Date(value).getTime() - now) / 60_000)
  if (Math.abs(minutes) < 1) return "Just now"
  const format = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" })
  return Math.abs(minutes) < 60 ? format.format(minutes, "minute") : Math.abs(minutes) < 1440 ? format.format(Math.round(minutes / 60), "hour") : format.format(Math.round(minutes / 1440), "day")
}
