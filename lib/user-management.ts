import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { updateUserSchema } from "@/lib/validation-user"
import { UserService } from "@/services/user-service"
import { ActivityLogService } from "@/services/activity-log-service"
import { successResponse } from "@/middleware/error-handler"
import User from "@/models/User"
import type { UserRole } from "@/types"

/** Shared by PATCH, activate, deactivate and the legacy soft-delete endpoint. */
export async function updateManagedUser(req: NextRequest, id: string, preset?: { isActive: boolean }) {
  try {
    const { user: actor, response } = await requireAdmin()
    if (response) return response
    if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const origin = req.headers.get("origin")
    if (origin && origin !== req.nextUrl.origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 })
    if (!/^[a-f0-9]{24}$/i.test(id)) return NextResponse.json({ error: "Invalid user ID." }, { status: 400 })
    const parsed = updateUserSchema.strict().safeParse(preset ?? await req.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ error: "Please check the user details.", errors: parsed.error.flatten().fieldErrors }, { status: 400 })
    const changes = parsed.data
    if (!Object.keys(changes).length) return NextResponse.json({ error: "No changes provided." }, { status: 400 })
    if (actor.id.toLowerCase() === id.toLowerCase() && ("role" in changes || "isActive" in changes)) {
      return NextResponse.json({ error: "You cannot change your own role or lock/unlock your own account." }, { status: 403 })
    }
    const target = await User.findById(id).select("_id")
    if (!target) return NextResponse.json({ error: "User not found." }, { status: 404 })
    const updated = await UserService.updateUser(id, { ...changes, role: changes.role as UserRole | undefined })
    await ActivityLogService.log({ userId: actor.id, action: "USER_UPDATED", resourceType: "User", resourceId: id,
      changes: { fields: Object.keys(changes), ...(changes.role ? { role: changes.role } : {}), ...("isActive" in changes ? { isActive: changes.isActive } : {}) } })
    return successResponse(updated, "User updated successfully")
  } catch {
    return NextResponse.json({ error: "Unable to update the user. Please try again." }, { status: 500 })
  }
}
