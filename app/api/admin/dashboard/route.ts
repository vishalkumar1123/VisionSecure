import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { BUSINESS_TIMEZONE, businessDay, CLOSED_STATUSES, DAY_MS } from "@/lib/dashboard-time"
import Lead from "@/models/Lead"
import User from "@/models/User"
import ActivityLog from "@/models/ActivityLog"

export async function GET(request: Request) {
  try {
    const { response, user } = await requireAdmin()
    if (response) return response
    const days = Number(new URL(request.url).searchParams.get("days") || 30)
    if (![7, 30, 90].includes(days)) return NextResponse.json({ error: "Invalid date range" }, { status: 400 })
    const now = new Date()
    const { start, end } = businessDay(now)
    const periodStart = new Date(start.getTime() - (days - 1) * DAY_MS)
    const previousStart = new Date(periodStart.getTime() - days * DAY_MS)
    const active = { status: { $nin: CLOSED_STATUSES } }
    const due = { ...active, followUpDate: { $gte: start, $lt: end } }
    const overdue = { ...active, followUpDate: { $lt: start, $ne: null } }
    const selection = "_id name phone service status source priority assignedTo followUpDate createdAt"
    const results = await Promise.allSettled([
      Lead.aggregate([{ $facet: {
        pipeline: [{ $group: { _id: "$status", total: { $sum: 1 } } }],
        services: [{ $group: { _id: "$service", total: { $sum: 1 } } }, { $sort: { total: -1, _id: 1 } }],
        today: [{ $match: { createdAt: { $gte: start, $lt: end } } }, { $count: "total" }],
        yesterday: [{ $match: { createdAt: { $gte: new Date(start.getTime() - DAY_MS), $lt: start } } }, { $count: "total" }],
        due: [{ $match: due }, { $count: "total" }],
        overdue: [{ $match: overdue }, { $count: "total" }],
        attention: [{ $match: { ...active, $or: [{ followUpDate: { $lt: end, $ne: null } }, { status: { $in: ["New", "Quotation Sent"] } }] } }, { $count: "total" }],
      } }]),
      Lead.find().sort({ createdAt: -1, _id: -1 }).limit(5).select(selection).populate("assignedTo", "name").lean(),
      Lead.find(due).sort({ followUpDate: 1, _id: 1 }).limit(20).select(selection).populate("assignedTo", "name").lean(),
      Lead.aggregate([
        { $match: { createdAt: { $gte: previousStart, $lt: end } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: BUSINESS_TIMEZONE } }, total: { $sum: 1 } } },
      ]),
      User.aggregate([{ $group: { _id: { role: "$role", active: "$isActive" }, total: { $sum: 1 } } }]),
      ActivityLog.find().sort({ createdAt: -1, _id: -1 }).limit(5).select("_id action resourceType resourceId status createdAt userId").populate("userId", "name").lean(),
    ])
    const keys = ["metrics", "leads", "schedule", "trend", "users", "activity"]
    const errors = results.flatMap((result, index) => result.status === "rejected" ? [keys[index]] : [])
    const value = (index: number): any => results[index].status === "fulfilled" ? (results[index] as PromiseFulfilledResult<any>).value : null
    const raw = value(0)?.[0]
    const pipeline: Array<{ _id: string; total: number }> = raw?.pipeline || []
    const count = (status: string) => pipeline.find(row => row._id === status)?.total || 0
    const total = pipeline.reduce((sum, row) => sum + row.total, 0)
    const converted = count("Converted") + count("Installed Successfully")
    const rows: Array<{ _id: string; total: number }> = value(3) || []
    const trend = Array.from({ length: days }, (_, index) => {
      const day = new Date(periodStart.getTime() + index * DAY_MS)
      const key = businessDay(day).key
      return { date: key, label: day.toLocaleDateString("en-IN", { timeZone: BUSINESS_TIMEZONE, day: "2-digit", month: "short" }), total: rows.find(row => row._id === key)?.total || 0 }
    })
    const current = trend.reduce((sum, row) => sum + row.total, 0)
    const previous = rows.filter(row => row._id < businessDay(periodStart).key).reduce((sum, row) => sum + row.total, 0)
    const userRows: Array<{ _id: { role: string; active: boolean }; total: number }> = value(4) || []
    return NextResponse.json({
      displayName: user?.name || "Admin", updatedAt: now.toISOString(), timezone: BUSINESS_TIMEZONE, days, errors,
      metrics: raw ? { total, converted, active: total - CLOSED_STATUSES.reduce((sum, status) => sum + count(status), 0), today: raw.today[0]?.total || 0, yesterday: raw.yesterday[0]?.total || 0, due: raw.due[0]?.total || 0, overdue: raw.overdue[0]?.total || 0, attention: raw.attention[0]?.total || 0, new: count("New"), quotations: count("Quotation Sent"), installations: count("Installation Scheduled"), conversionRate: total ? Number((converted / total * 100).toFixed(1)) : 0, pipeline, services: raw.services } : null,
      leads: value(1), schedule: value(2), trend: value(3) ? { rows: trend, current, previous, change: previous ? Number(((current - previous) / previous * 100).toFixed(1)) : null } : null,
      users: value(4) ? { total: userRows.reduce((sum, row) => sum + row.total, 0), active: userRows.filter(row => row._id.active).reduce((sum, row) => sum + row.total, 0), roles: Array.from(new Set(userRows.map(row => row._id.role))).map(role => ({ role, total: userRows.filter(row => row._id.role === role).reduce((sum, row) => sum + row.total, 0) })) } : null,
      activity: value(5),
    }, { headers: { "Cache-Control": "private, no-store" } })
  } catch {
    return NextResponse.json({ error: "Unable to load dashboard. Please retry." }, { status: 500 })
  }
}
