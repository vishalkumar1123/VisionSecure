import { NextResponse } from "next/server"
import { NotificationQueryService } from "@/notification/services/notification-query.service"
import { requireNotificationAdmin } from "../_auth"

export async function PATCH() {
  const { user, response } = await requireNotificationAdmin()
  if (response) return response
  const result = await NotificationQueryService.markAllRead(user.id)
  return NextResponse.json({ updated: result.modifiedCount })
}
