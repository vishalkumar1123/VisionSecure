import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { isSessionTokenActive } from "@/lib/session-security"
import { ActivityLogService } from "@/services/activity-log-service"
import { successResponse } from "@/middleware/error-handler"
import { canUserPerform } from "@/constants/permissions"
import type { UserRole, ActivityAction } from "@/types"

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!isSessionTokenActive(token) || !token?.sub) {
      return NextResponse.json({ error: "Your session has expired. Please sign in again." }, { status: 401 })
    }
    if (!canUserPerform(token.role as UserRole, "activity.view")) {
      return NextResponse.json({ error: "You do not have permission to view activity logs." }, { status: 403 })
    }
    const params = req.nextUrl.searchParams
    const page = Number(params.get("page") || 1)
    const limit = Number(params.get("limit") || 25)
    const userId = params.get("userId") || undefined
    const action = params.get("action") || undefined
    const startDate = params.get("startDate") ? new Date(params.get("startDate")!) : undefined
    const endDate = params.get("endDate") ? new Date(params.get("endDate")!) : undefined
    if (!Number.isSafeInteger(page) || page < 1 || page > 100000 || !Number.isSafeInteger(limit) || limit < 1 || limit > 100 ||
      (userId && !/^[a-f0-9]{24}$/i.test(userId)) || (action && !/^[A-Z_]{1,50}$/.test(action)) ||
      (startDate && Number.isNaN(startDate.getTime())) || (endDate && Number.isNaN(endDate.getTime())) ||
      (startDate && endDate && startDate > endDate)) {
      return NextResponse.json({ error: "Invalid filters or pagination. Check the date range and try again." }, { status: 400 })
    }
    const admin = token.role === "admin" || token.role === "super_admin"
    const result = await ActivityLogService.getLogs({
      userId: admin ? userId : token.sub,
      action: action as ActivityAction | undefined, startDate, endDate, page, limit,
    })
    return successResponse(result, "Activity logs fetched successfully")
  } catch {
    return NextResponse.json({ error: "Unable to load activity logs. Please try again." }, { status: 500 })
  }
}
