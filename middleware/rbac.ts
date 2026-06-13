/**
 * RBAC (Role-Based Access Control) Middleware
 * Protects routes based on user roles and permissions
 */

import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { canUserPerform } from "@/constants/permissions"
import type { Permission, UserRole } from "@/types"

/**
 * Check if user has specific role
 */
export async function withRole(...allowedRoles: UserRole[]) {
  return async (req: NextRequest) => {
    try {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      })

      if (!token || !token.role) {
        return NextResponse.json(
          {
            success: false,
            error: "Unauthorized",
          },
          { status: 401 }
        )
      }

      if (!allowedRoles.includes(token.role as UserRole)) {
        return NextResponse.json(
          {
            success: false,
            error: "Forbidden - Insufficient permissions",
          },
          { status: 403 }
        )
      }

      // Continue to route
      return null
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication error",
        },
        { status: 401 }
      )
    }
  }
}

/**
 * Check if user has specific permission
 */
export async function withPermission(...permissions: Permission[]) {
  return async (req: NextRequest) => {
    try {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      })

      if (!token || !token.role) {
        return NextResponse.json(
          {
            success: false,
            error: "Unauthorized",
          },
          { status: 401 }
        )
      }

      const hasPermission = permissions.some((perm) =>
        canUserPerform(token.role as UserRole, perm)
      )

      if (!hasPermission) {
        return NextResponse.json(
          {
            success: false,
            error: "Forbidden - You don't have permission for this action",
          },
          { status: 403 }
        )
      }

      return null
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication error",
        },
        { status: 401 }
      )
    }
  }
}

/**
 * Verify JWT token and attach user to request
 */
export async function withAuth(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token) {
      return null
    }

    return token
  } catch (error) {
    return null
  }
}

/**
 * Extract user info from request headers
 */
export function getUserInfoFromRequest(req: NextRequest) {
  return {
    ipAddress: req.ip || req.headers.get("x-forwarded-for") || "unknown",
    userAgent: req.headers.get("user-agent") || "unknown",
  }
}
