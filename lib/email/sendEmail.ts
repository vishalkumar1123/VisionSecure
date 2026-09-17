import "server-only"
import { createHash } from "node:crypto"
import { notifyEmail } from "@/lib/email-config/delivery"
import { getAdminInquiryEmailTemplate } from "./templates"
import type { IInquiryInput } from "@/types/inquiry"
export async function sendAdminEmailNotification(_to: string, inquiryData: IInquiryInput) {
  const id = createHash("sha256").update(JSON.stringify(inquiryData)).digest("hex")
  return notifyEmail({ eventKey: `legacy-inquiry:${id}`, eventType: "leadCreated", entityId: id, subject: "New website inquiry", text: "A new website inquiry has been received.", html: getAdminInquiryEmailTemplate(inquiryData) })
}
