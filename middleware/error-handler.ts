/**
 * Error handling utilities
 * Standardized error responses across API
 */

import { NextResponse } from "next/server"
import type { ApiErrorResponse } from "@/types"

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export function handleApiError(error: any) {
  console.error("API Error:", error)

  // Zod validation errors
  if (error.name === "ZodError") {
    const errors: Record<string, string[]> = {}
    error.errors.forEach((err: any) => {
      const path = err.path.join(".")
      if (!errors[path]) {
        errors[path] = []
      }
      errors[path].push(err.message)
    })

    return NextResponse.json(
      {
        success: false,
        error: "Validation failed",
        errors,
      } as ApiErrorResponse,
      { status: 400 }
    )
  }

  // Custom API errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        errors: error.errors,
      } as ApiErrorResponse,
      { status: error.statusCode }
    )
  }

  // MongoDB duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0]
    return NextResponse.json(
      {
        success: false,
        error: `${field} already exists`,
        errors: { [field]: [`${field} already exists`] },
      } as ApiErrorResponse,
      { status: 400 }
    )
  }

  // Default error
  return NextResponse.json(
    {
      success: false,
      error: error.message || "Internal server error",
    } as ApiErrorResponse,
    { status: 500 }
  )
}

/**
 * Success response helper
 */
export function successResponse<T>(
  data: T,
  message: string = "Success"
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status: 200 }
  )
}

/**
 * Created response helper
 */
export function createdResponse<T>(
  data: T,
  message: string = "Created successfully"
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status: 201 }
  )
}
