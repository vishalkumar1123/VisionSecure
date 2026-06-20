/**
 * Zod validation schemas for authentication
 */

import { z } from 'zod'
import { PASSWORD_RULES } from '@/constants'

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

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    mobile: z
      .string()
      .regex(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
})

// Type exports for usage in components and API routes
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>
