import { getEmailTransporter } from "@/lib/email/transporter"
import { newLeadEmailTemplate } from "./templates/new-lead.template"
import type { CreateNotificationInput } from "@/notification/types/notification.types"

export class EmailNotificationChannel {
  async deliver(input: CreateNotificationInput, recipients?: string[]) {
    const { transporter, config } = getEmailTransporter()
    const deliveryRecipients = recipients?.length ? recipients : config.recipients
    const template = newLeadEmailTemplate(input.referenceId, input.payload ?? { name: "Customer", phone: "" })
    const response = await transporter.sendMail({ from: `VisionSecure Smart Technologies <${config.from}>`, to: deliveryRecipients, subject: template.subject, html: template.html, text: template.text })
    console.info("Lead notification email sent successfully", { leadId: input.referenceId, messageId: response.messageId, recipients: deliveryRecipients.length })
    return { provider: "zoho-smtp", messageId: response.messageId, recipients: deliveryRecipients.length }
  }
}
