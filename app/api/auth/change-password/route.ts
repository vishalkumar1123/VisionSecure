/**
 * POST /api/auth/change-password
 * Change current user's password (requires authentication)
 */

import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { isSessionTokenActive } from "@/lib/session-security"
import { changePasswordSchema } from "@/lib/validation-auth"
import { AuthService } from "@/services/auth-service"
import { UserService } from "@/services/user-service"
import { successResponse } from "@/middleware/error-handler"
import { getUserInfoFromRequest } from "@/middleware/rbac"
import { ActivityLogService } from "@/services/activity-log-service"
import { connectDB } from "@/lib/mongodb"
import { allowRateLimitedRequest } from "@/notification/utils/rate-limit"
import User from "@/models/User"

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!isSessionTokenActive(token) || !token?.sub) {
      return NextResponse.json({ success: false, error: "Your session has expired. Please sign in again." }, { status: 401 })
    }

    const origin = req.headers.get("origin")
    if (origin && origin !== req.nextUrl.origin) {
      return NextResponse.json({ success: false, error: "Invalid request origin." }, { status: 403 })
    }
    if (!allowRateLimitedRequest(`password-change:${token.sub}`, 5, 5 * 60_000)) {
      return NextResponse.json({ success: false, error: "Too many attempts. Please try again in 5 minutes." }, { status: 429, headers: { "Retry-After": "300" } })
    }
    let body: unknown
    try { body = await req.json() } catch {
      return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 })
    }

    // Validate request
    const parsed = changePasswordSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Please check the password requirements.", errors: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const validatedData = parsed.data

    // Get user with password
    await connectDB()
    const user = await User.findById(token.sub).select("+password")

    if (!user || !user.isActive) {
      return NextResponse.json({ success: false, error: "This account is unavailable. Please contact your administrator." }, { status: 403 })
    }

    // Verify current password
    const isValid = await AuthService.validatePassword(
      validatedData.currentPassword,
      user.password
    )

    if (!isValid) {
      return NextResponse.json({ success: false, error: "Current password is incorrect.", errors: { currentPassword: ["Current password is incorrect."] } }, { status: 400 })
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
  } catch {
    return NextResponse.json({ success: false, error: "Unable to change your password right now. Please try again." }, { status: 500 })
  }
}
