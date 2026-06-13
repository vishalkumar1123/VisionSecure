/**
 * User Service
 * Handles user creation, updating, role assignment
 */

import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import { ROLE_PERMISSIONS } from "@/constants/permissions"
import type { UserDTO, CreateUserRequest, UpdateUserRequest, UserRole } from "@/types"
import { AuthService } from "./auth-service"

export class UserService {
  /**
   * Create a new user
   */
  static async createUser(data: CreateUserRequest) {
    try {
      await connectDB()

      // Check if user exists
      const existingUser = await User.findOne({
        $or: [{ email: data.email }, { mobile: data.mobile }],
      })

      if (existingUser) {
        throw new Error(
          existingUser.email === data.email
            ? "Email already exists"
            : "Mobile number already exists"
        )
      }

      // Hash password
      const hashedPassword = await AuthService.hashPassword(data.password)

      // Get permissions for role
      const permissions = ROLE_PERMISSIONS[data.role] || []

      // Create user
      const user = await User.create({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        password: hashedPassword,
        role: data.role,
        permissions,
        emailVerified: true, // Admin-created users are pre-verified
      })

      return this.userToDTO(user)
    } catch (error) {
      throw error
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string) {
    try {
      await connectDB()

      const user = await User.findById(userId)

      if (!user) {
        throw new Error("User not found")
      }

      return this.userToDTO(user)
    } catch (error) {
      throw error
    }
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string) {
    try {
      await connectDB()

      const user = await User.findOne({ email })

      if (!user) {
        throw new Error("User not found")
      }

      return this.userToDTO(user)
    } catch (error) {
      throw error
    }
  }

  /**
   * Update user
   */
  static async updateUser(userId: string, data: UpdateUserRequest) {
    try {
      await connectDB()

      const user = await User.findByIdAndUpdate(userId, data, {
        new: true,
        runValidators: true,
      })

      if (!user) {
        throw new Error("User not found")
      }

      return this.userToDTO(user)
    } catch (error) {
      throw error
    }
  }

  /**
   * Update user role and permissions
   */
  static async updateUserRole(userId: string, role: UserRole) {
    try {
      await connectDB()

      const permissions = ROLE_PERMISSIONS[role] || []

      const user = await User.findByIdAndUpdate(
        userId,
        { role, permissions },
        { new: true }
      )

      if (!user) {
        throw new Error("User not found")
      }

      return this.userToDTO(user)
    } catch (error) {
      throw error
    }
  }

  /**
   * Deactivate user
   */
  static async deactivateUser(userId: string) {
    try {
      await connectDB()

      const user = await User.findByIdAndUpdate(
        userId,
        { isActive: false },
        { new: true }
      )

      if (!user) {
        throw new Error("User not found")
      }

      return this.userToDTO(user)
    } catch (error) {
      throw error
    }
  }

  /**
   * Activate user
   */
  static async activateUser(userId: string) {
    try {
      await connectDB()

      const user = await User.findByIdAndUpdate(
        userId,
        { isActive: true },
        { new: true }
      )

      if (!user) {
        throw new Error("User not found")
      }

      return this.userToDTO(user)
    } catch (error) {
      throw error
    }
  }

  /**
   * Reset user password
   */
  static async resetUserPassword(userId: string, newPassword: string) {
    try {
      await connectDB()

      const hashedPassword = await AuthService.hashPassword(newPassword)

      const user = await User.findByIdAndUpdate(
        userId,
        { password: hashedPassword },
        { new: true }
      )

      if (!user) {
        throw new Error("User not found")
      }

      return this.userToDTO(user)
    } catch (error) {
      throw error
    }
  }

  /**
   * List all users with pagination and filters
   */
  static async listUsers(filters: {
    search?: string
    role?: UserRole
    isActive?: boolean
    limit?: number
    page?: number
  }) {
    try {
      await connectDB()

      const {
        search,
        role,
        isActive,
        limit = 10,
        page = 1,
      } = filters

      const query: any = {}

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { mobile: { $regex: search, $options: "i" } },
        ]
      }

      if (role) {
        query.role = role
      }

      if (isActive !== undefined) {
        query.isActive = isActive
      }

      const total = await User.countDocuments(query)
      const users = await User.find(query)
        .select("-password -permissions")
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })

      return {
        data: users.map((user) => this.userToDTO(user)),
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * Convert user document to DTO
   */
  private static userToDTO(user: any): UserDTO {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      isActive: user.isActive,
      emailVerified: user.emailVerified || false,
      lastLoginAt: user.lastLoginAt || undefined,
      createdAt: user.createdAt,
    }
  }
}
