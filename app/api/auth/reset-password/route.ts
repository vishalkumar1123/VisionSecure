/**
 * POST /api/auth/reset-password
 * Reset password with token
 */

import { NextRequest } from "next/server"
import { resetPasswordSchema } from "@/lib/validation-auth"
import { AuthService } from "@/services/auth-service"
import { successResponse, handleApiError } from "@/middleware/error-handler"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate request
    const validatedData = resetPasswordSchema.parse(body)

    // Reset password
    const user = await AuthService.resetPassword(validatedData.token, validatedData.password)

    return successResponse(user, "Password reset successful")
  } catch (error) {
    return handleApiError(error)
  }
}
