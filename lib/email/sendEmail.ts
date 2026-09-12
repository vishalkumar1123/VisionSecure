import nodemailer from "nodemailer"

import { resend } from "./resend"
import { getAdminInquiryEmailTemplate } from "./templates"
import type { IInquiryInput } from "@/types/inquiry"

export async function sendAdminEmailNotification(to: string, inquiryData: IInquiryInput) {
  const from = process.env.EMAIL_FROM || process.env.MAIL_FROM
  const subject = `New Website Inquiry from ${inquiryData.name}`
  const html = getAdminInquiryEmailTemplate(inquiryData)

  if (!from) throw new Error("EMAIL_FROM or MAIL_FROM must be configured")

  // SMTP is the primary provider. It is required for sending from the Zoho
  // mailbox and avoids Resend's sender/domain restrictions.
  const smtpPassword = process.env.SMTP_PASS || process.env.SMTP_PASSWORD
  if (process.env.SMTP_HOST && process.env.SMTP_USER && smtpPassword) {
    const port = Number(process.env.SMTP_PORT || 465)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE === "true" || port === 465,
      auth: { user: process.env.SMTP_USER, pass: smtpPassword },
    })
    const result = await transporter.sendMail({ from, to, subject, html })
    console.info("[EMAIL] inquiry sent", { provider: "smtp", messageId: result.messageId })
    return result
  }

  if (!process.env.RESEND_API_KEY) throw new Error("No email provider is configured")
  const result = await resend.emails.send({ from, to: [to], subject, html })
  if (result.error) throw new Error(result.error.message)
  console.info("[EMAIL] inquiry sent", { provider: "resend", messageId: result.data?.id })
  return result
}
