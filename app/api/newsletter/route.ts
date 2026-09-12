import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { resend } from "@/lib/email/resend"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, "")

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null)
  const email = typeof body === "object" && body && "email" in body && typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
  if (!emailPattern.test(email) || email.length > 254) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })

  const from = process.env.EMAIL_FROM || process.env.MAIL_FROM || "VisionSecure Smart Technologies <info@visionsecuretech.in>"
  const subject = "New Blog Subscriber - VisionSecure"
  const timestamp = new Date().toISOString()
  const pageUrl = request.headers.get("referer") || "Blog Stay Updated"
  const html = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;background:#eef5fa;padding:24px"><tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:auto;background:#fff;border:1px solid #dbe6f0;border-radius:16px"><tr><td style="padding:28px"><h1 style="margin:0;color:#0b2545;font-size:22px">New Blog Subscriber</h1><p style="color:#506176;line-height:1.7"><strong>Email:</strong> ${escapeHtml(email)}<br><strong>Source:</strong> Blog Stay Updated<br><strong>Date/Time:</strong> ${timestamp}<br><strong>Page:</strong> ${escapeHtml(pageUrl)}</p></td></tr></table></td></tr></table>`

  try {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      const port = Number(process.env.SMTP_PORT || 465)
      const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port, secure: process.env.SMTP_SECURE === "true" || port === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } })
      await transporter.sendMail({ from, to: "info@visionsecuretech.in", subject, html })
    } else if (process.env.RESEND_API_KEY) {
      const result = await resend.emails.send({ from, to: ["info@visionsecuretech.in"], subject, html })
      if (result.error) throw new Error(result.error.message)
    } else return NextResponse.json({ error: "Newsletter email is not configured." }, { status: 503 })
    console.info("[NEWSLETTER] subscription notification sent", { email })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[NEWSLETTER] send failed", { error: error instanceof Error ? error.message : "unknown" })
    return NextResponse.json({ error: "Could not subscribe right now. Please try again later." }, { status: 502 })
  }
}
