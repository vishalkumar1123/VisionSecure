import { NextResponse } from "next/server"
import { NotificationQueryService } from "@/notification/services/notification-query.service"
import { requireNotificationAdmin } from "./_auth"

export async function GET(request: Request) {
  const { user, response } = await requireNotificationAdmin()
  if (response) return response
  const { searchParams } = new URL(request.url)
  const pageValue = Number(searchParams.get("page") || 1)
  const limitValue = Number(searchParams.get("limit") || 10)
  const page = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1
  const limit = Number.isInteger(limitValue) && limitValue > 0 ? Math.min(limitValue, 50) : 10
  const unreadOnly = searchParams.get("unread") === "true"
  try {
    const result = await NotificationQueryService.list(user.id, page, limit, unreadOnly)
    return NextResponse.json({ ...result, page, limit, pages: Math.ceil(result.total / limit) })
  } catch {
    return NextResponse.json({ error: "Unable to load notifications" }, { status: 500 })
  }
}
