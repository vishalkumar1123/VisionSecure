/**
 * GET /api/users
 * List all users with pagination
 *
 * POST /api/users
 * Create new user
 */

import { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { UserService } from "@/services/user-service"
import { createUserSchema } from "@/lib/validation-user"
import { successResponse, createdResponse, handleApiError } from "@/middleware/error-handler"
import { canUserPerform } from "@/constants/permissions"
import type { UserRole } from "@/types"

/**
 * GET /api/users
 */
export async function GET(req: NextRequest) {
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

    // Get query params
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || undefined
    const role = searchParams.get("role") || undefined
    const isActive = searchParams.get("isActive")
      ? searchParams.get("isActive") === "true"
      : undefined

    const result = await UserService.listUsers({
      page,
      limit,
      search,
      role: role as UserRole,
      isActive,
    })

    return successResponse(result, "Users fetched successfully")
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/users
 */
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Check permission
    if (!canUserPerform(token.role as UserRole, "user.create")) {
      return new Response("Forbidden", { status: 403 })
    }

    const body = await req.json()
    const validatedData = createUserSchema.parse(body)

    const user = await UserService.createUser({
      ...validatedData,
      role: validatedData.role as UserRole,
    })

    return createdResponse(user, "User created successfully")
  } catch (error) {
    return handleApiError(error)
  }
}