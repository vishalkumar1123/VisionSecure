import { Schema, model, models, type InferSchemaType } from "mongoose"

const NotificationSchema = new Schema(
  {
    recipientId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, required: true, enum: ["NEW_LEAD", "FOLLOW_UP", "QUOTATION", "INSTALLATION", "COMPLAINT", "PAYMENT", "SYSTEM"] },
    severity: { type: String, enum: ["success", "information", "warning", "error"], default: "information" },
    actionUrl: String,
    title: { type: String, required: true, trim: true, maxlength: 160 },
    message: { type: String, required: true, trim: true, maxlength: 500 },
    referenceType: { type: String, required: true, enum: ["LEAD", "EMAIL", "CUSTOMER_CENTER"] },
    referenceId: { type: Schema.Types.ObjectId, ref: "Lead", required: true },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
    payload: { type: Schema.Types.Mixed, default: {} },
    channels: {
      dashboard: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      browser: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: false },
    },
    deliveryStatus: {
      dashboard: { type: String, default: "pending" },
      email: { type: String, default: "pending" },
      browser: { type: String, default: "pending" },
      whatsapp: { type: String, default: "pending" },
    },
  },
  { timestamps: true }
)

NotificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 })
NotificationSchema.index({ referenceId: 1 })
NotificationSchema.index({ recipientId: 1, type: 1, referenceId: 1 }, { unique: true })

export type NotificationDocument = InferSchemaType<typeof NotificationSchema>
const Notification = models.Notification || model("Notification", NotificationSchema)

export default Notification
