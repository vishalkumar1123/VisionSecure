import mongoose, { Schema, models, model } from "mongoose"
import type { VerificationToken } from "@/types"

const VerificationTokenSchema = new Schema<VerificationToken>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      // Auto-delete documents after 24 hours
      expires: 86400,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

// Index for cleanup
VerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default models.VerificationToken || model<VerificationToken>(
  "VerificationToken",
  VerificationTokenSchema
)
