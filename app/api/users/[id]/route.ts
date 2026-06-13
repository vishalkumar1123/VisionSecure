/**
 * GET /api/users/[id]
 * Get user details
 *
 * PATCH /api/users/[id]
 * Update user
 *
 * DELETE /api/users/[id]
 * Delete user (soft delete by deactivating)
 */

import { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { UserService } from "@/services/user-service"
import { updateUserSchema } from "@/lib/validation-user"
import { successResponse, handleApiError } from "@/middleware/error-handler"
import { canUserPerform } from "@/constants/permissions"
import type { UserRole } from "@/types"

/**
 * GET /api/users/[id]
 */
export async function GET(
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
    if (!canUserPerform(token.role as UserRole, "user.read")) {
      return new Response("Forbidden", { status: 403 })
    }

    const user = await UserService.getUserById(params.id)
    return successResponse(user, "User fetched successfully")
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PATCH /api/users/[id]
 */
export async function PATCH(
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
    const validatedData = updateUserSchema.parse(body)

    const user = await UserService.updateUser(params.id, validatedData)
    return successResponse(user, "User updated successfully")
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/users/[id]
 */
export async function DELETE(
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
    if (!canUserPerform(token.role as UserRole, "user.delete")) {
      return new Response("Forbidden", { status: 403 })
    }

    // Soft delete by deactivating
    const user = await UserService.deactivateUser(params.id)
    return successResponse(user, "User deactivated")
  } catch (error) {
    return handleApiError(error)
  }
}