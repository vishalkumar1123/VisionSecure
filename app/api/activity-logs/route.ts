/**
 * GET /api/activity-logs
 * List activity logs with filters
 */

import { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { ActivityLogService } from "@/services/activity-log-service"
import { successResponse, handleApiError } from "@/middleware/error-handler"
import { canUserPerform } from "@/constants/permissions"
import type { UserRole, ActivityAction } from "@/types"

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Check permission
    if (!canUserPerform(token.role as UserRole, "activity.view")) {
      return new Response("Forbidden", { status: 403 })
    }

    // Get query params
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const userId = searchParams.get("userId") || undefined
    const action = searchParams.get("action") || undefined
    const startDate = searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : undefined
    const endDate = searchParams.get("endDate")
      ? new Date(searchParams.get("endDate")!)
      : undefined

    const result = await ActivityLogService.getLogs({
      userId,
      action: action as ActivityAction,
      startDate,
      endDate,
      page,
      limit,
    })

    return successResponse(result, "Activity logs fetched successfully")
  } catch (error) {
    return handleApiError(error)
  }
}
