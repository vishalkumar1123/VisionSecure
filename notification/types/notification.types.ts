export const NOTIFICATION_TYPES = [
  "NEW_LEAD",
  "FOLLOW_UP",
  "QUOTATION",
  "INSTALLATION",
  "COMPLAINT",
  "PAYMENT",
  "SYSTEM",
] as const

export type NotificationType = (typeof NOTIFICATION_TYPES)[number]
export type DeliveryState = "pending" | "sent" | "failed" | "skipped"

export interface NotificationLeadPayload {
  name: string
  phone: string
  email?: string
  address?: string
  service?: string
  location?: string
  requirement?: string
  source?: string
  priority?: string
  status?: string
  createdAt?: Date
}

export interface CreateNotificationInput {
  type: NotificationType
  recipientId: string
  referenceType: "LEAD"
  referenceId: string
  title: string
  message: string
  payload?: NotificationLeadPayload
}

export interface NotificationRecord extends CreateNotificationInput {
  id: string
  isRead: boolean
  readAt: Date | null
  createdAt: Date
  updatedAt: Date
  channels: {
    dashboard: boolean
    email: boolean
    browser: boolean
    whatsapp: boolean
  }
  deliveryStatus: {
    dashboard: DeliveryState
    email: DeliveryState
    browser: DeliveryState
    whatsapp: DeliveryState
  }
}
