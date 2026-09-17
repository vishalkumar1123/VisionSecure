import "server-only"
import { Types } from "mongoose"
import ActivityLog from "@/models/ActivityLog"
import User from "@/models/User"
import Notification from "@/notification/models/notification.model"
export type Actor = { id: string; role: string }
export async function emailAudit(actor: Actor, event: string, result = "success", fields: string[] = [], category?: string) {
  await ActivityLog.create({ userId: actor.id, action: "EMAIL_SERVICE", resourceType: "System", status: result === "failed" ? "failed" : "success", changes: { actorRole: actor.role, event, fields, result, ...(category ? { category } : {}) } })
}
export async function emailNotice(title: string, message: string, severity: "success" | "information" | "warning" | "error", relatedId?: string, dedupeKey?: string) {
  try {
    const admins = await User.find({ role: { $in: ["super_admin", "admin"] }, isActive: true }).select("_id").lean()
    const referenceId = new Types.ObjectId()
    await Promise.all(admins.map(async (user) => {
      if (dedupeKey && await Notification.exists({ recipientId: user._id, "payload.emailNoticeKey": dedupeKey, createdAt: { $gte: new Date(Date.now() - 3600_000) } })) return
      await Notification.create({ recipientId: user._id, type: "SYSTEM", severity, title, message, referenceType: "EMAIL", referenceId,
        actionUrl: "/admin/settings/email", payload: { relatedId, emailNoticeKey: dedupeKey }, channels: { dashboard: true, email: false, browser: true }, deliveryStatus: { dashboard: "sent", email: "skipped", browser: "pending" } })
    }))
  } catch { /* Notice storage failure never exposes provider errors or breaks a business action. */ }
}
