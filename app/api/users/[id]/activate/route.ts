/**
 * POST /api/users/[id]/deactivate
 * Deactivate a user account
 */

import { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { UserService } from "@/services/user-service"
import { successResponse, handleApiError } from "@/middleware/error-handler"
import { canUserPerform } from "@/constants/permissions"
import type { UserRole } from "@/types"

// 1. Update the context type here to use Promise
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token) {
      return new Response("Unauthorized", {
        status: 401,
      })
    }

    if (!canUserPerform(token.role as UserRole, "user.update")) {
      return new Response("Forbidden", {
        status: 403,
      })
    }

    // 2. Await the params before destructuring
    const { id } = await context.params

    // 3. Make sure it calls deactivateUser instead of activateUser
    const user = await UserService.deactivateUser(id)

    return successResponse(
      user,
      "User deactivated"
    )
  } catch (error) {
    return handleApiError(error)
  }
}