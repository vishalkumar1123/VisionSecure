import { NextResponse } from "next/server"
import { requireNotificationAdmin } from "../_auth"
import { EmailNotificationChannel } from "@/notification/channels/email/email.channel"

export async function POST() {
  const { user, response } = await requireNotificationAdmin()
  if (response) return response
  try {
    const result = await new EmailNotificationChannel().deliver({ type: "SYSTEM", recipientId: user.id, referenceType: "LEAD", referenceId: "000000000000000000000000", title: "Email configuration test", message: "Email configuration test", payload: { name: "VisionSecure test", phone: "Not applicable", requirement: "Email notification configuration test", source: "SYSTEM", status: "Test" } })
    return NextResponse.json({ success: true, provider: result.provider, messageId: result.messageId, recipients: result.recipients })
  } catch (error) {
    console.error("[EMAIL] test failed", { error: error instanceof Error ? error.message : "unknown" })
    return NextResponse.json({ success: false, error: "Email delivery failed. Check server email configuration and logs." }, { status: 502 })
  }
}
