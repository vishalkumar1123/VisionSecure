/**
 * Common Types and Interfaces
 * Shared across the application
 */

export type UserRole = 'super_admin' | 'admin' | 'sales_executive' | 'technician' | 'viewer'

export type Permission = 
  | 'lead.create'
  | 'lead.read'
  | 'lead.update'
  | 'lead.delete'
  | 'lead.assign'
  | 'user.create'
  | 'user.read'
  | 'user.update'
  | 'user.delete'
  | 'analytics.view'
  | 'quotation.create'
  | 'quotation.read'
  | 'quotation.update'
  | 'quotation.delete'
  | 'service.create'
  | 'service.read'
  | 'service.update'
  | 'settings.view'
  | 'settings.update'
  | 'activity.view'

export type ActivityAction = 
  | 'LOGIN'
  | 'LOGOUT'
  | 'LEAD_CREATED'
  | 'LEAD_UPDATED'
  | 'LEAD_ASSIGNED'
  | 'LEAD_STATUS_CHANGED'
  | 'NOTE_ADDED'
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'USER_DELETED'
  | 'PASSWORD_RESET'
  | 'EMAIL_VERIFIED'
  | 'QUOTATION_CREATED'
  | 'SERVICE_TICKET_CREATED'

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
  errors?: Record<string, string[]>
}

export interface PaginationParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  pages: number
}

export type SoftDeleteDocument = {
  deletedAt?: Date | null
  isDeleted?: boolean
}

export type TimestampedDocument = {
  createdAt: Date
  updatedAt: Date
}
