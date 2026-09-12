import { Types } from "mongoose"
import User from "@/models/User"
import Notification from "@/notification/models/notification.model"
import { DashboardNotificationChannel } from "@/notification/channels/dashboard/dashboard.channel"
import { EmailNotificationChannel } from "@/notification/channels/email/email.channel"
import { NotificationActivityLogService } from "./activity-log.service"
import type { NotificationLeadPayload } from "@/notification/types/notification.types"
import { sendAdminWhatsappNotification } from "@/lib/whatsapp/sendWhatsapp"

export class NotificationService {
  static async notifyNewLead(leadId: string, payload: NotificationLeadPayload) {
    const adminUsers = await User.find({ role: { $in: ["admin", "super_admin"] }, isActive: true }).select("_id").lean()
    const dashboard = new DashboardNotificationChannel()
    const inputFor = (recipientId: string) => ({
      type: "NEW_LEAD" as const,
      recipientId,
      referenceType: "LEAD" as const,
      referenceId: leadId,
      title: "New Lead Received",
      message: `${payload.name} submitted a ${payload.requirement || "new"} requirement.`,
      payload,
    })

    await Promise.allSettled(adminUsers.map(async (admin) => {
      const input = inputFor(admin._id.toString())
      try {
        await dashboard.deliver(input)
        await NotificationActivityLogService.record("NOTIFICATION_CREATED", { leadId, recipientId: input.recipientId })
      } catch (error) {
        console.error("VNC dashboard notification failed", { leadId, error: error instanceof Error ? error.message : "unknown" })
      }
    }))

    const recipients = [
      process.env.LEAD_NOTIFICATION_EMAILS,
      process.env.ADMIN_NOTIFICATION_EMAILS,
      process.env.ADMIN_NOTIFICATION_EMAIL,
      process.env.ADMIN_RECEIVER_EMAIL,
    ].filter(Boolean).join(",").split(",").map((email) => email.trim().toLowerCase()).filter((email, index, list) => email && list.indexOf(email) === index)
    const notificationQuery = { referenceId: new Types.ObjectId(leadId), type: "NEW_LEAD" }
    const emailInput = inputFor(adminUsers[0]?._id.toString() || new Types.ObjectId().toString())

    if (recipients.length === 0) {
      await Notification.updateMany(notificationQuery, { $set: { "deliveryStatus.email": "skipped" } })
    } else {
      try {
        const result = await new EmailNotificationChannel().deliver(emailInput, recipients)
        await Notification.updateMany(notificationQuery, { $set: { "channels.email": true, "deliveryStatus.email": "sent" } })
        await NotificationActivityLogService.record("EMAIL_SENT", { leadId, provider: result.provider, messageId: result.messageId, recipients: String(result.recipients) })
      } catch (error) {
        await Notification.updateMany(notificationQuery, { $set: { "deliveryStatus.email": "failed" } }).catch(() => undefined)
        console.error("Lead email notification failed", { leadId, error: error instanceof Error ? error.message : "unknown" })
        await NotificationActivityLogService.record("EMAIL_FAILED", { leadId })
      }
    }

    const whatsappRecipients = (process.env.ADMIN_NOTIFICATION_WHATSAPP || process.env.ADMIN_RECEIVER_PHONE || "")
      .split(",")
      .map((phone) => phone.trim())
      .filter(Boolean)

    if (whatsappRecipients.length === 0) {
      await Notification.updateMany(notificationQuery, { $set: { "deliveryStatus.whatsapp": "skipped" } })
      await NotificationActivityLogService.record("WHATSAPP_SKIPPED", { leadId, reason: "no_recipient" })
      return
    }

    const whatsappInput = {
      name: payload.name,
      email: payload.email || "",
      phone: payload.phone,
      subject: payload.requirement,
      message: payload.requirement || "New website requirement",
    }
    const deliveries = await Promise.allSettled(whatsappRecipients.map((phone) => sendAdminWhatsappNotification(phone, whatsappInput)))
    const sent = deliveries.filter((delivery) => delivery.status === "fulfilled" && delivery.value.status === "sent")

    if (sent.length > 0) {
      await Notification.updateMany(notificationQuery, { $set: { "channels.whatsapp": true, "deliveryStatus.whatsapp": "sent" } })
      await NotificationActivityLogService.record("WHATSAPP_SENT", { leadId, recipients: String(sent.length) })
    } else {
      const skipped = deliveries.every((delivery) => delivery.status === "fulfilled" && delivery.value.status === "skipped")
      await Notification.updateMany(notificationQuery, { $set: { "deliveryStatus.whatsapp": skipped ? "skipped" : "failed" } })
      await NotificationActivityLogService.record(skipped ? "WHATSAPP_SKIPPED" : "WHATSAPP_FAILED", { leadId })
    }
  }
}
