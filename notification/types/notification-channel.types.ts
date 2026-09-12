import type { CreateNotificationInput } from "./notification.types"

export type NotificationChannelName = "dashboard" | "email" | "browser"

export interface NotificationChannel {
  readonly name: NotificationChannelName
  deliver(input: CreateNotificationInput): Promise<void>
}
