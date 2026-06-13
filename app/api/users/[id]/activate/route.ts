/**
 * POST /api/users/[id]/activate
 * Activate a user account
 */

import { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { UserService } from "@/services/user-service"
import { successResponse, handleApiError } from "@/middleware/error-handler"
import { canUserPerform } from "@/constants/permissions"
import type { UserRole } from "@/types"

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

    const user = await UserService.activateUser(params.id)
    return successResponse(user, "User activated")
  } catch (error) {
    return handleApiError(error)
  }
}
