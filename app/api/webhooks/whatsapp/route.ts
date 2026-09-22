import { after, NextResponse } from "next/server"
import { boundedBody, CenterError, equalSecret, validSignature } from "@/lib/customer-center/security"
import { acceptWebhook } from "@/lib/customer-center/inbound"
import { connectDB } from "@/lib/mongodb"
import { AIAgentSettings } from "@/models/CustomerCenter"
import { centerAudit } from "@/lib/customer-center/events"
import { processJobs } from "@/lib/customer-center/worker"
export const runtime = "nodejs"
export const maxDuration = 120
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams
  if (query.get("hub.mode") === "subscribe" && equalSecret(query.get("hub.verify_token") || "", process.env.META_VERIFY_TOKEN || "") && /^\d{1,100}$/.test(query.get("hub.challenge") || "")) {
    try {
      await connectDB()
      await AIAgentSettings.updateOne({ _id: "primary" }, { $set: { webhookVerifiedAt: new Date() } }, { upsert: true })
      await centerAudit("WHATSAPP_WEBHOOK_VERIFIED")
      return new Response(query.get("hub.challenge"), { headers: { "Cache-Control": "no-store" } })
    } catch { return NextResponse.json({ error: "VERIFICATION_STORAGE_UNAVAILABLE" }, { status: 503 }) }
  }
  return NextResponse.json({ error: "VERIFICATION_FAILED" }, { status: 403 })
}
export async function POST(request: Request) {
  try {
    const raw = await boundedBody(request, 256000)
    if (!validSignature(raw, request.headers.get("x-hub-signature-256"))) return NextResponse.json({ error: "INVALID_SIGNATURE" }, { status: 401 })
    let body: unknown; try { body = JSON.parse(raw) } catch { return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 }) }
    await acceptWebhook(body)
    after(async () => { await new Promise(resolve => setTimeout(resolve, 1700)); await processJobs(2).catch(() => undefined) })
    return NextResponse.json({ received: true })
  } catch (error) { return NextResponse.json({ error: error instanceof CenterError ? error.code : "WEBHOOK_PROCESSING_FAILED" }, { status: error instanceof CenterError ? error.status : 503 }) }
}
