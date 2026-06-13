/**
 * Authentication Types
 */

export interface AuthCredentials {
  email: string
  password: string
}

export interface RegisterRequest extends AuthCredentials {
  name: string
  mobile: string
}

export interface LoginResponse {
  id: string
  name: string
  email: string
  role: string
  mobile: string
  isActive: boolean
  emailVerified?: boolean
}

export interface UserSession {
  user: {
    id: string
    name: string
    email: string
    role: string
    mobile: string
  }
  token?: string
}

export interface PasswordResetToken {
  email: string
  token: string
  expiresAt: Date
}

export interface VerificationToken {
  email: string
  token: string
  expiresAt: Date
  isVerified: boolean
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetValidation {
  token: string
  password: string
  confirmPassword: string
}

export interface PasswordChangeRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ForgotPasswordResponse {
  message: string
  email: string
}

export interface VerifyEmailResponse {
  message: string
  user?: LoginResponse
}
