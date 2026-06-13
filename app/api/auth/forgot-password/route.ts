/**
 * POST /api/auth/forgot-password
 */

import { NextRequest } from "next/server"
import { forgotPasswordSchema } from "@/lib/validation-auth"
import { AuthService } from "@/services/auth-service"
import {
  successResponse,
  handleApiError,
} from "@/middleware/error-handler"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const validatedData =
      forgotPasswordSchema.parse(body)

    const resetToken =
      await AuthService.requestPasswordReset(
        validatedData.email
      )

    return successResponse(
      {
        email: validatedData.email,

        message:
          "Password reset link sent successfully",

        resetUrl:
          `/reset-password?token=${resetToken.token}`,
      },
      "Check your email for reset instructions"
    )
  } catch (error) {
    return handleApiError(error)
  }
}