export function istFields(value?: string | null) {
  if (!value || !Number.isFinite(Date.parse(value))) return { date: "", time: "" }
  const shifted = new Date(Date.parse(value) + 330 * 60000).toISOString()
  return { date: shifted.slice(0, 10), time: shifted.slice(11, 16) }
}
export function followUpISO(date: string, time: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error("Choose a valid date and time.")
  const value = new Date(`${date}T${time}:00+05:30`)
  if (!Number.isFinite(+value) || istFields(value.toISOString()).date !== date) throw new Error("Choose a valid date and time.")
  return value.toISOString()
}
