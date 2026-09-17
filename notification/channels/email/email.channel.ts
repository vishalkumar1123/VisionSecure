import "server-only"
import { notifyEmail } from "@/lib/email-config/delivery"
import { newLeadEmailTemplate } from "./templates/new-lead.template"
import type { CreateNotificationInput } from "@/notification/types/notification.types"
export class EmailNotificationChannel {
  async deliver(input: CreateNotificationInput) {
    const template = newLeadEmailTemplate(input.referenceId, input.payload ?? { name: "Customer", phone: "" })
    const result = await notifyEmail({ eventKey: `lead-created:${input.referenceId}`, eventType: "leadCreated", entityId: input.referenceId, ...template })
    return { provider: "configured-smtp", status: result?.status || "failed", messageId: result?.providerMessageIds?.[0], recipients: result?.recipients?.length || 0 }
  }
}
