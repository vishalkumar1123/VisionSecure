/**
 * POST /api/auth/register
 */

import { NextRequest } from "next/server"
import { registerSchema } from "@/lib/validation-auth"
import { AuthService } from "@/services/auth-service"
import {
  createdResponse,
  handleApiError,
} from "@/middleware/error-handler"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const validatedData =
      registerSchema.parse(body)

    const result =
      await AuthService.register(
        validatedData
      )

    return createdResponse(
      {
        user: result.user,

        message:
          "Registration successful. Please verify your email.",

        verificationUrl:
          `/verify-email?token=${result.verificationToken}&email=${result.user.email}`,
      },
      "User registered successfully"
    )
  } catch (error) {
    return handleApiError(error)
  }
}