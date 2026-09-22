import "server-only"
import { createHash } from "node:crypto"
import { Types } from "mongoose"
import ActivityLog from "@/models/ActivityLog"
import User from "@/models/User"
import Notification from "@/notification/models/notification.model"
export async function centerAudit(event: string, conversationId?: string, actorId?: string) {
  await ActivityLog.create({ userId: actorId || undefined, action: "CUSTOMER_CENTER", resourceType: "System", resourceId: conversationId || null, status: "success", changes: { event, actorType: actorId ? "ADMIN" : "SYSTEM" } })
}
export async function centerNotice(conversationId: string, event: string, title: string) {
  const admins = await User.find({ role: { $in: ["admin", "super_admin"] }, isActive: true }).select("_id").lean()
  const referenceId = new Types.ObjectId(createHash("sha256").update(`${conversationId}:${event}`).digest("hex").slice(0, 24))
  await Promise.all(admins.map(user => Notification.updateOne({ recipientId: user._id, type: "SYSTEM", referenceId }, { $setOnInsert: { referenceType: "CUSTOMER_CENTER", title, message: "Open the Customer Center to review the conversation and next action.", actionUrl: `/admin/inbox?conversation=${conversationId}`, severity: "warning", channels: { dashboard: true, email: false, browser: true, whatsapp: false }, deliveryStatus: { dashboard: "sent", email: "skipped", browser: "pending", whatsapp: "skipped" } } }, { upsert: true })))
}
