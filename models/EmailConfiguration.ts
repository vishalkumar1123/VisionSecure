import "server-only"
import { Schema, model, models } from "mongoose"
const encrypted = new Schema({ ciphertext: String, iv: String, authTag: String, version: Number }, { _id: false })
const schema = new Schema({
  _id: { type: String, default: "primary" }, revision: { type: Number, default: 0 },
  provider: String, smtpHost: String, smtpPort: Number, encryption: String, secure: Boolean, requireTLS: Boolean, authRequired: Boolean,
  usernameEncrypted: { type: encrypted, select: false }, passwordEncrypted: { type: encrypted, select: false },
  passwordConfigured: { type: Boolean, default: false }, usernameConfigured: { type: Boolean, default: false },
  fromName: String, fromEmail: String, replyTo: String, recipients: [String], eventSettings: Schema.Types.Mixed,
  failureThreshold: { type: Number, default: 3 },
  status: { type: String, enum: ["NOT_CONFIGURED", "SAVED_NOT_VERIFIED", "VERIFYING", "VERIFIED", "TEST_EMAIL_SENT", "ACTIVE", "DISABLED", "ERROR"], default: "NOT_CONFIGURED" },
  isVerified: { type: Boolean, default: false }, verifiedAt: Date, lastTestedAt: Date,
  lastTestStatus: { type: String, default: null }, lastTestErrorCategory: { type: String, default: null }, activatedAt: Date, disabledAt: Date,
  createdBy: { type: Schema.Types.ObjectId, ref: "User" }, updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  lockToken: { type: String, select: false }, lockUntil: { type: Date, select: false },
}, { timestamps: true })
export default models.EmailConfiguration || model("EmailConfiguration", schema)
