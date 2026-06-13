/**
 * Authentication Service
 * Handles user registration, login, password reset, email verification
 */

import bcrypt from "bcryptjs"
import crypto from "crypto"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import VerificationToken from "@/models/VerificationToken"
import PasswordReset from "@/models/PasswordReset"
import { TOKEN_EXPIRY } from "@/constants"
import type { RegisterRequest, LoginResponse } from "@/types"

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterRequest) {
    try {
      await connectDB()

      // Check if user exists
      const existingUser = await User.findOne({
        $or: [{ email: data.email }, { mobile: data.mobile }],
      })

      if (existingUser) {
        throw new Error(
          existingUser.email === data.email
            ? "Email already registered"
            : "Mobile number already registered"
        )
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10)

      // Create user
      const user = await User.create({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        password: hashedPassword,
        role: "sales_executive",
        emailVerified: false,
      })

      // Generate verification token
      const verificationToken = await this.generateVerificationToken(data.email)

      return {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          mobile: user.mobile,
        },
        verificationToken: verificationToken.token,
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * Verify user email
   */
 static async verifyEmail(
  token: string
) {

  await connectDB()

  const user =
    await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: {
        $gt: new Date(),
      },
    })

  if (!user) {
    throw new Error(
      "Invalid or expired token"
    )
  }

  user.emailVerified = true

  user.emailVerificationToken = null

  user.emailVerificationExpires = null

  await user.save()

  return user
}

  /**
   * Generate email verification token
   */
  static async generateVerificationToken(email: string) {
    try {
      await connectDB()

      // Delete existing tokens
      await VerificationToken.deleteOne({ email })

      const token = crypto.randomBytes(32).toString("hex")
      const expiresAt = new Date()
      expiresAt.setMinutes(expiresAt.getMinutes() + TOKEN_EXPIRY.EMAIL_VERIFICATION)

      const verificationToken = await VerificationToken.create({
        email,
        token,
        expiresAt,
      })

      return verificationToken
    } catch (error) {
      throw error
    }
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email: string) {
    try {
      await connectDB()

      const user = await User.findOne({ email })

      if (!user) {
        throw new Error("User not found")
      }

      // Delete existing tokens
      await PasswordReset.deleteOne({ email })

      const token = crypto.randomBytes(32).toString("hex")
      const expiresAt = new Date()
      expiresAt.setMinutes(expiresAt.getMinutes() + TOKEN_EXPIRY.PASSWORD_RESET)

      const resetToken = await PasswordReset.create({
        email,
        token,
        expiresAt,
      })

      return resetToken
    } catch (error) {
      throw error
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(token: string, newPassword: string) {
    try {
      await connectDB()

      const resetToken = await PasswordReset.findOne({ token })

      if (!resetToken) {
        throw new Error("Invalid or expired reset token")
      }

      if (new Date() > resetToken.expiresAt) {
        await PasswordReset.deleteOne({ _id: resetToken._id })
        throw new Error("Reset token has expired")
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10)

      // Update user
      const user = await User.findOneAndUpdate(
        { email: resetToken.email },
        { password: hashedPassword },
        { new: true }
      )

      // Delete token
      await PasswordReset.deleteOne({ _id: resetToken._id })

      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        isActive: user.isActive,
      } as LoginResponse
    } catch (error) {
      throw error
    }
  }

  /**
   * Validate password
   */
  static async validatePassword(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword)
  }

  /**
   * Hash password
   */
  static async hashPassword(password: string) {
    return bcrypt.hash(password, 10)
  }
}
