import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { UserService } from "@/services/user-service"
import { successResponse } from "@/middleware/error-handler"
import { updateManagedUser } from "@/lib/user-management"
import User from "@/models/User"

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { response } = await requireAdmin()
    if (response) return response
    const { id } = await context.params
    if (!/^[a-f0-9]{24}$/i.test(id)) return NextResponse.json({ error: "Invalid user ID." }, { status: 400 })
    if (!await User.findById(id).select("_id")) return NextResponse.json({ error: "User not found." }, { status: 404 })
    return successResponse(await UserService.getUserById(id), "User fetched successfully")
  } catch { return NextResponse.json({ error: "Unable to load user." }, { status: 500 }) }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  return updateManagedUser(req, (await context.params).id)
}

/** Existing delete is a reversible deactivation, so self-protection applies. */
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  return updateManagedUser(req, (await context.params).id, { isActive: false })
}
