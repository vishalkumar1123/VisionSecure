import { Types } from "mongoose"
import Notification from "@/notification/models/notification.model"
import { connectDB } from "@/lib/mongodb"
import type { NotificationChannel } from "@/notification/types/notification-channel.types"
import type { CreateNotificationInput } from "@/notification/types/notification.types"

export class DashboardNotificationChannel implements NotificationChannel {
  readonly name = "dashboard" as const

  async deliver(input: CreateNotificationInput) {
    await connectDB()
    await Notification.updateOne(
      { recipientId: new Types.ObjectId(input.recipientId), type: input.type, referenceId: new Types.ObjectId(input.referenceId) },
      {
        $setOnInsert: {
          ...input,
          recipientId: new Types.ObjectId(input.recipientId),
          referenceId: new Types.ObjectId(input.referenceId),
          channels: { dashboard: true, email: false, browser: true, whatsapp: false },
          deliveryStatus: { dashboard: "sent", email: "pending", browser: "pending", whatsapp: "pending" },
          isRead: false,
          readAt: null,
        },
      },
      { upsert: true }
    )
  }
}
