/**
 * POST /api/auth/verify-email
 * Verify user email with token
 */

import { NextRequest } from "next/server"
import { verifyEmailSchema } from "@/lib/validation-auth"
import { AuthService } from "@/services/auth-service"
import { successResponse, handleApiError } from "@/middleware/error-handler"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate request
    const validatedData = verifyEmailSchema.parse(body)

    // Verify email
    const user = await AuthService.verifyEmail(validatedData.token)

    return successResponse(user, "Email verified successfully")
  } catch (error) {
    return handleApiError(error)
  }
}
