import mongoose, { Schema, models, model } from "mongoose"
import type { ActivityAction } from "@/types"

interface IActivityLog {
  _id?: string
  userId: string
  action: ActivityAction
  resourceType?: string
  resourceId?: string
  changes?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  status: "success" | "failed"
  errorMessage?: string
  createdAt: Date
  updatedAt: Date
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    action: {
      type: String,
      enum: [
        "LOGIN",
        "LOGOUT",
        "LEAD_CREATED",
        "LEAD_UPDATED",
        "LEAD_ASSIGNED",
        "LEAD_STATUS_CHANGED",
        "NOTE_ADDED",
        "USER_CREATED",
        "USER_UPDATED",
        "USER_DELETED",
        "PASSWORD_RESET",
        "EMAIL_VERIFIED",
        "QUOTATION_CREATED",
        "SERVICE_TICKET_CREATED",
      ],
      required: true,
      index: true,
    },

    resourceType: {
      type: String,
      enum: ["Lead", "User", "Quotation", "ServiceTicket", "System"],
      default: "System",
    },

    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    changes: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    ipAddress: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },

    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    indexes: [
      { userId: 1, createdAt: -1 },
      { action: 1, createdAt: -1 },
      { resourceType: 1, resourceId: 1 },
      { createdAt: -1 },
    ],
  }
)

export default models.ActivityLog || model<IActivityLog>(
  "ActivityLog",
  ActivityLogSchema
)
