import "server-only"
import { Schema, model, models } from "mongoose"
const schema = new Schema({
  eventKey: { type: String, unique: true, required: true }, eventType: { type: String, required: true }, entityId: String,
  subject: String, text: { type: String, select: false }, html: { type: String, select: false },
  recipients: [String], acceptedRecipients: [String], providerMessageIds: [String],
  status: { type: String, enum: ["pending", "sent", "failed", "skipped", "uncertain"], default: "pending" },
  attemptCount: { type: Number, default: 0 }, retryEligible: { type: Boolean, default: false },
  sending: { type: Boolean, default: false }, startedAt: Date,
  nextRetryAt: Date, failureCategory: String, sentAt: Date, configRevision: Number,
}, { timestamps: true })
schema.index({ status: 1, createdAt: -1 }); schema.index({ eventType: 1, createdAt: -1 }); schema.index({ recipients: 1 }); schema.index({ entityId: 1 })
export default models.EmailDeliveryLog || model("EmailDeliveryLog", schema)
