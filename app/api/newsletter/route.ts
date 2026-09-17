import { NextResponse } from "next/server"
import { createHash } from "node:crypto"
import { notifyEmail } from "@/lib/email-config/delivery"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, "")

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null)
  const email = typeof body === "object" && body && "email" in body && typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
  if (!emailPattern.test(email) || email.length > 254) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })

  const subject = "New Blog Subscriber - VisionSecure"
  const timestamp = new Date().toISOString()
  const pageUrl = request.headers.get("referer") || "Blog Stay Updated"
  const html = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;background:#eef5fa;padding:24px"><tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:auto;background:#fff;border:1px solid #dbe6f0;border-radius:16px"><tr><td style="padding:28px"><h1 style="margin:0;color:#0b2545;font-size:22px">New Blog Subscriber</h1><p style="color:#506176;line-height:1.7"><strong>Email:</strong> ${escapeHtml(email)}<br><strong>Source:</strong> Blog Stay Updated<br><strong>Date/Time:</strong> ${timestamp}<br><strong>Page:</strong> ${escapeHtml(pageUrl)}</p></td></tr></table></td></tr></table>`

  const entityId = createHash("sha256").update(email).digest("hex")
  await notifyEmail({ eventKey: `newsletter:${entityId}`, eventType: "newsletter", entityId, subject, html, text: `New newsletter subscriber: ${email}` })
  return NextResponse.json({ success: true })
}
