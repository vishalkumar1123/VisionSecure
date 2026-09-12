import { NextResponse } from "next/server"
import { NotificationQueryService } from "@/notification/services/notification-query.service"
import { NotificationActivityLogService } from "@/notification/services/activity-log.service"
import { requireNotificationAdmin } from "../_auth"

export async function PATCH(request: Request) {
  const { user, response } = await requireNotificationAdmin()
  if (response) return response
  const body: unknown = await request.json().catch(() => null)
  const id = typeof body === "object" && body && "id" in body && typeof body.id === "string" ? body.id : ""
  if (!id) return NextResponse.json({ error: "Notification id is required" }, { status: 400 })
  const notification = await NotificationQueryService.markRead(user.id, id)
  if (!notification) return NextResponse.json({ error: "Notification not found" }, { status: 404 })
  await NotificationActivityLogService.record("ADMIN_VIEWED_NOTIFICATION", { notificationId: id, recipientId: user.id })
  return NextResponse.json({ notification })
}
