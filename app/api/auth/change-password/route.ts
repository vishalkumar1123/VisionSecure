/**
 * POST /api/auth/change-password
 * Change current user's password (requires authentication)
 */

import { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { changePasswordSchema } from "@/lib/validation-auth"
import { AuthService } from "@/services/auth-service"
import { UserService } from "@/services/user-service"
import { successResponse, handleApiError } from "@/middleware/error-handler"
import { getUserInfoFromRequest } from "@/middleware/rbac"
import { ActivityLogService } from "@/services/activity-log-service"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()

    // Validate request
    const validatedData = changePasswordSchema.parse(body)

    // Get user with password
    await connectDB()
    const user = await User.findById(token.sub).select("+password")

    if (!user) {
      return new Response("User not found", { status: 404 })
    }

    // Verify current password
    const isValid = await AuthService.validatePassword(
      validatedData.currentPassword,
      user.password
    )

    if (!isValid) {
      return new Response("Current password is incorrect", { status: 400 })
    }

    // Update password
    await UserService.resetUserPassword(token.sub as string, validatedData.newPassword)

    // Log activity
    const userInfo = getUserInfoFromRequest(req)
    await ActivityLogService.log({
      userId: token.sub as string,
      action: "PASSWORD_RESET",
      status: "success",
      ...userInfo,
    })

    return successResponse(
      { message: "Password changed successfully" },
      "Password updated"
    )
  } catch (error) {
    return handleApiError(error)
  }
}
