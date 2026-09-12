import { NextResponse } from "next/server"
import { NotificationQueryService } from "@/notification/services/notification-query.service"
import { requireNotificationAdmin } from "../_auth"

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireNotificationAdmin()
  if (response) return response
  const { id } = await context.params
  const notification = await NotificationQueryService.remove(user.id, id)
  if (!notification) return NextResponse.json({ error: "Notification not found" }, { status: 404 })
  return NextResponse.json({ success: true })
}
