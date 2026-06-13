/**
 * GET /api/activity-logs/[userId]
 * Get activity summary for a specific user
 */

import { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { ActivityLogService } from "@/services/activity-log-service"
import { successResponse, handleApiError } from "@/middleware/error-handler"
import { canUserPerform } from "@/constants/permissions"
import type { UserRole } from "@/types"

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
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

    const summary = await ActivityLogService.getUserActivitySummary(params.userId)
    return successResponse(summary, "User activity summary fetched")
  } catch (error) {
    return handleApiError(error)
  }
}
