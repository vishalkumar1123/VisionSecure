/**
 * Authentication Service
 * Handles user registration and login
 */

import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
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

 email: data.email.toLowerCase(),

 mobile: data.mobile,

 password: hashedPassword,

 role: "sales_executive",

 isActive: true,
})

      return {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          mobile: user.mobile,
        },
      }
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
