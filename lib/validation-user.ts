/**
 * Zod validation schemas for user management
 */

import { z } from 'zod'
import { PASSWORD_RULES } from '@/constants'
import { USER_ROLES } from '@/constants/roles'

// Password validation with rules
const passwordSchema = z
  .string()
  .min(PASSWORD_RULES.MIN_LENGTH, `Password must be at least ${PASSWORD_RULES.MIN_LENGTH} characters`)
  .refine(
    (password) => !PASSWORD_RULES.REQUIRE_UPPERCASE || /[A-Z]/.test(password),
    'Password must contain at least one uppercase letter'
  )
  .refine(
    (password) => !PASSWORD_RULES.REQUIRE_LOWERCASE || /[a-z]/.test(password),
    'Password must contain at least one lowercase letter'
  )
  .refine(
    (password) => !PASSWORD_RULES.REQUIRE_NUMBERS || /\d/.test(password),
    'Password must contain at least one number'
  )
  .refine(
    (password) => !PASSWORD_RULES.REQUIRE_SPECIAL || /[!@#$%^&*]/.test(password),
    'Password must contain at least one special character (!@#$%^&*)'
  )

// 1. FIXED HERE: Convert dynamic keys to a typed tuple that Zod accepts
const roleOptions = Object.keys(USER_ROLES) as [string, ...string[]]

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z
    .string()
    .regex(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(roleOptions, {
    errorMap: () => ({ message: 'Invalid role selected' }),
  }),
})

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  mobile: z
    .string()
    .regex(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
    .optional(),
  role: z.enum(roleOptions).optional(),
  isActive: z.boolean().optional(),
})

export const bulkCreateUsersSchema = z.object({
  users: z.array(createUserSchema).min(1, 'At least one user is required'),
})

// Type exports
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type BulkCreateUsersInput = z.infer<typeof bulkCreateUsersSchema>