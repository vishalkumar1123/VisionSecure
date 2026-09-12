import { Types } from "mongoose"
import { connectDB } from "@/lib/mongodb"
import Notification from "@/notification/models/notification.model"

const toId = (value: string) => new Types.ObjectId(value)

export class NotificationQueryService {
  static async list(recipientId: string, page: number, limit: number, unreadOnly: boolean) {
    await connectDB()
    const filter = { recipientId: toId(recipientId), ...(unreadOnly ? { isRead: false } : {}) }
    const [items, total, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Notification.countDocuments(filter),
      Notification.countDocuments({ recipientId: toId(recipientId), isRead: false }),
    ])
    return { items, total, unreadCount }
  }

  static async markRead(recipientId: string, notificationId: string) {
    if (!Types.ObjectId.isValid(notificationId)) return null
    await connectDB()
    return Notification.findOneAndUpdate(
      { _id: toId(notificationId), recipientId: toId(recipientId) },
      { $set: { isRead: true, readAt: new Date() } },
      { new: true }
    ).lean()
  }

  static async markAllRead(recipientId: string) {
    await connectDB()
    return Notification.updateMany({ recipientId: toId(recipientId), isRead: false }, { $set: { isRead: true, readAt: new Date() } })
  }

  static async remove(recipientId: string, notificationId: string) {
    if (!Types.ObjectId.isValid(notificationId)) return null
    await connectDB()
    return Notification.findOneAndDelete({ _id: toId(notificationId), recipientId: toId(recipientId) }).lean()
  }
}
