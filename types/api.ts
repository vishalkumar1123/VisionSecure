/**
 * API Types and Request/Response Schemas
 */

import type { ApiResponse, PaginatedResponse } from './common'

export type ApiSuccessResponse<T> = ApiResponse<T> & { success: true }
export type ApiErrorResponse = ApiResponse & { success: false }

export interface ApiEndpointError {
  status: number
  message: string
  field?: string
}

export interface ValidationErrorDetail {
  field: string
  message: string
  value?: any
}

// FIXED: Remove 'errors' from ApiErrorResponse before extending it
export interface ApiErrorDetail extends Omit<ApiErrorResponse, 'errors'> {
  errors?: ValidationErrorDetail[]
  timestamp?: string
  path?: string
}