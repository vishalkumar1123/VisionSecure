/**
 * User Types and Interfaces
 */

import type {
  UserRole,
  Permission,
  TimestampedDocument,
} from "./common"

export interface IUser extends TimestampedDocument {
  _id: string

  name: string
  email: string
  mobile: string
  password: string

  role: UserRole
  permissions: Permission[]

  isActive: boolean
  emailVerified: boolean

  profilePicture?: string | null
  lastLoginAt?: Date | null

  departmentId?: string | null
  reportingTo?: string | null

  // Email Verification
  emailVerificationToken?: string | null
  emailVerificationExpires?: Date | null

  // Password Reset
  passwordResetToken?: string | null
  passwordResetExpires?: Date | null
}

export interface UserDTO {
  id: string

  name: string
  email: string
  mobile: string

  role: UserRole

  isActive: boolean
  emailVerified: boolean

  profilePicture?: string | null
  lastLoginAt?: Date | null

  createdAt: Date
}

export interface CreateUserRequest {
  name: string
  email: string
  mobile: string
  password: string
  role: UserRole
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  mobile?: string

  role?: UserRole

  isActive?: boolean
  emailVerified?: boolean

  permissions?: Permission[]

  profilePicture?: string | null
}

export interface UserListFilters {
  search?: string
  role?: UserRole
  isActive?: boolean
  limit?: number
  page?: number
}

export interface BulkUserCreateRequest {
  users: CreateUserRequest[]
}