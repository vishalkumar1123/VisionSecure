/**
 * POST /api/users/[id]/reset-password
 * Admin resets a user's password
 */

import { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { z } from "zod"
import { UserService } from "@/services/user-service"
import { successResponse, handleApiError } from "@/middleware/error-handler"
import { canUserPerform } from "@/constants/permissions"
import type { UserRole } from "@/types"

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
})

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
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
    if (!canUserPerform(token.role as UserRole, "user.update")) {
      return new Response("Forbidden", { status: 403 })
    }

    const body = await req.json()
    const validatedData = resetPasswordSchema.parse(body)

    const user = await UserService.resetUserPassword(params.id, validatedData.newPassword)
    return successResponse(user, "Password reset successfully")
  } catch (error) {
    return handleApiError(error)
  }
}
