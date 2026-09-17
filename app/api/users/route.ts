/**
 * GET /api/users
 * List all users with pagination
 *
 * POST /api/users
 * Create new user
 */

import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { ActivityLogService } from "@/services/activity-log-service"
import { UserService } from "@/services/user-service"
import { createUserSchema } from "@/lib/validation-user"
import { successResponse, createdResponse, handleApiError } from "@/middleware/error-handler"
import type { UserRole } from "@/types"

/**
 * GET /api/users
 */
export async function GET(req: NextRequest) {
  try {
    const { response } = await requireAdmin()
    if (response) return response

    // Get query params
    const searchParams = req.nextUrl.searchParams
    const page = Number(searchParams.get("page") || "1")
    const limit = Number(searchParams.get("limit") || "10")
    if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > 100) return NextResponse.json({ error: "Invalid pagination." }, { status: 400 })
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
    const { user: actor, response } = await requireAdmin()
    if (response) return response
    const origin = req.headers.get("origin")
    if (origin && origin !== req.nextUrl.origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 })
    const body = await req.json()
    const validatedData = createUserSchema.parse(body)

    const user = await UserService.createUser({
      ...validatedData,
      role: validatedData.role as UserRole,
    })

    if (actor) await ActivityLogService.log({ userId: actor.id, action: "USER_CREATED", resourceType: "User", resourceId: user.id })
    return createdResponse(user, "User created successfully")
  } catch (error) {
    return handleApiError(error)
  }
}
