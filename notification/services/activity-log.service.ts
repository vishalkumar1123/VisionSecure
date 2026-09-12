type NotificationActivity =
  | "LEAD_CREATED"
  | "NOTIFICATION_CREATED"
  | "EMAIL_SENT"
  | "EMAIL_FAILED"
  | "WHATSAPP_SENT"
  | "WHATSAPP_FAILED"
  | "WHATSAPP_SKIPPED"
  | "BROWSER_NOTIFICATION_SENT"
  | "BROWSER_NOTIFICATION_FAILED"
  | "ADMIN_VIEWED_NOTIFICATION"

export class NotificationActivityLogService {
  static async record(event: NotificationActivity, metadata: Record<string, string> = {}) {
    try {
      console.info(JSON.stringify({ scope: "vnc", event, ...metadata, at: new Date().toISOString() }))
    } catch {
      // Logging must never affect lead or notification delivery.
    }
  }
}
