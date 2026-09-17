/** Administrator resets a selected user's password. */
import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { adminResetPasswordSchema } from "@/lib/validation-auth"
import { UserService } from "@/services/user-service"
import { ActivityLogService } from "@/services/activity-log-service"
import { allowRateLimitedRequest } from "@/notification/utils/rate-limit"
import User from "@/models/User"

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { user: actor, response } = await requireAdmin()
    if (response) return response
    if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const origin = req.headers.get("origin")
    if (origin && origin !== req.nextUrl.origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 })
    const { id } = await context.params
    if (!/^[a-f0-9]{24}$/i.test(id)) return NextResponse.json({ error: "Invalid user." }, { status: 400 })
    if (!allowRateLimitedRequest(`admin-password-reset:${actor.id}`, 10, 5 * 60_000)) {
      return NextResponse.json({ error: "Too many attempts. Please try again in 5 minutes." }, { status: 429, headers: { "Retry-After": "300" } })
    }
    const parsed = adminResetPasswordSchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ error: "Please check the password requirements.", errors: parsed.error.flatten().fieldErrors }, { status: 400 })
    const target = await User.findById(id).select("_id role")
    if (!target) return NextResponse.json({ error: "User not found." }, { status: 404 })
    await UserService.resetUserPassword(id, parsed.data.newPassword)
    await ActivityLogService.log({ userId: actor.id, action: "PASSWORD_RESET", resourceType: "User", resourceId: id })
    return NextResponse.json({ success: true, message: "Password changed successfully." })
  } catch {
    return NextResponse.json({ error: "Unable to change the password right now. Please try again." }, { status: 500 })
  }
}
