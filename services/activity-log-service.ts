/**
 * Activity Log Service
 * Tracks user activities for audit purposes
 */

import { connectDB } from "@/lib/mongodb"
import ActivityLog from "@/models/ActivityLog"
import type { ActivityAction } from "@/types"

export class ActivityLogService {
  /**
   * Log an activity
   */
  static async log(data: {
    userId: string
    action: ActivityAction
    resourceType?: string
    resourceId?: string
    changes?: Record<string, any>
    ipAddress?: string
    userAgent?: string
    status?: "success" | "failed"
    errorMessage?: string
  }) {
    try {
      await connectDB()

      await ActivityLog.create({
        userId: data.userId,
        action: data.action,
        resourceType: data.resourceType || "System",
        resourceId: data.resourceId || null,
        changes: data.changes || null,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
        status: data.status || "success",
        errorMessage: data.errorMessage || null,
      })
    } catch (error) {
      console.error("Failed to log activity:", error)
      // Don't throw - logging failures shouldn't break the application
    }
  }

  /**
   * Get activity logs with pagination
   */
  static async getLogs(filters: {
    userId?: string
    action?: ActivityAction
    startDate?: Date
    endDate?: Date
    limit?: number
    page?: number
  }) {
    try {
      await connectDB()

      const {
        userId,
        action,
        startDate,
        endDate,
        limit = 50,
        page = 1,
      } = filters

      const query: any = {}

      if (userId) {
        query.userId = userId
      }

      if (action) {
        query.action = action
      }

      if (startDate || endDate) {
        query.createdAt = {}
        if (startDate) {
          query.createdAt.$gte = startDate
        }
        if (endDate) {
          query.createdAt.$lte = endDate
        }
      }

      const total = await ActivityLog.countDocuments(query)
      const logs = await ActivityLog.find(query)
        .populate("userId", "name email role")
        .populate("resourceId")
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })

      return {
        data: logs,
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
   * Get user activity summary
   */
  static async getUserActivitySummary(userId: string, days: number = 7) {
    try {
      await connectDB()

      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const logs = await ActivityLog.find({
        userId,
        createdAt: { $gte: startDate },
      }).sort({ createdAt: -1 })

      const summary = {
        totalActions: logs.length,
        loginCount: logs.filter((l) => l.action === "LOGIN").length,
        leadsCreated: logs.filter((l) => l.action === "LEAD_CREATED").length,
        leadsUpdated: logs.filter((l) => l.action === "LEAD_UPDATED").length,
        lastActivity: logs[0]?.createdAt || null,
      }

      return summary
    } catch (error) {
      throw error
    }
  }
}
