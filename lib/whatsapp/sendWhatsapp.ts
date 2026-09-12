import type { IInquiryInput } from "@/types/inquiry"

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN
const PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID

export type WhatsappDeliveryResult = {
  status: "sent" | "skipped"
  messageId?: string
  reason?: string
}

export async function sendAdminWhatsappNotification(
  adminPhone: string,
  inquiryData: IInquiryInput
): Promise<WhatsappDeliveryResult> {
  if (!META_ACCESS_TOKEN || !PHONE_NUMBER_ID) {
    return { status: "skipped", reason: "WhatsApp Business API is not configured" }
  }

  const recipient = adminPhone.replace(/[^0-9]/g, "")
  if (!recipient) return { status: "skipped", reason: "No WhatsApp recipient is configured" }

  const response = await fetch(`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${META_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: recipient,
      type: "template",
      template: {
        name: process.env.WHATSAPP_TEMPLATE_NAME || "new_inquiry_alert",
        language: { code: process.env.WHATSAPP_TEMPLATE_LANGUAGE || "en" },
        components: [{
          type: "body",
          parameters: [
            { type: "text", text: inquiryData.name },
            { type: "text", text: inquiryData.phone },
            { type: "text", text: (inquiryData.message || inquiryData.subject || "New website requirement").slice(0, 100) },
          ],
        }],
      },
    }),
  })

  const result = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(`WhatsApp API request failed (${response.status}): ${JSON.stringify(result)}`)
  }

  const messageId = result?.messages?.[0]?.id
  console.info("[WHATSAPP] message accepted", { messageId, recipient })
  return { status: "sent", messageId }
}
