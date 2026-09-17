import "server-only"
import { NextResponse } from "next/server"
import { z } from "zod"
import { Schema, model, models } from "mongoose"
import { requireAdmin } from "@/lib/admin-auth"
import Configuration from "@/models/EmailConfiguration"
import Delivery from "@/models/EmailDeliveryLog"
import { emailPermission, EMAIL_EVENTS } from "./shared"
import { configurationAction, sanitizeConfiguration, health, EmailError } from "./service"
import { retryEmail, processPendingEmails } from "./delivery"
import { emailAudit } from "./audit"
const limitSchema = new Schema({ _id: String, count: Number, expiresAt: Date })
limitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
const RateLimit = models.EmailRateLimit || model("EmailRateLimit", limitSchema)
const logQuery = z.object({ page: z.coerce.number().int().min(1).max(10000).default(1), status: z.enum(["", "sent", "failed", "pending", "skipped", "uncertain"]).default(""), eventType: z.string().max(50).default(""), recipient: z.union([z.string().email(), z.literal("")]).default(""), entityId: z.string().max(128).default(""), from: z.string().regex(/^$|^\d{4}-\d{2}-\d{2}$/).default(""), to: z.string().regex(/^$|^\d{4}-\d{2}-\d{2}$/).default("") }).strict()
export async function emailAPI(request: Request, action: string, id?: string) {
  const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } })
  try {
    const { user, response } = await requireAdmin()
    if (response) return response
    if (!user) return json({ error: "Unauthorized" }, 401)
    if (!emailPermission(user.role, action)) return json({ error: "Forbidden" }, 403)
    if (!["GET", "HEAD"].includes(request.method)) {
      const origin = request.headers.get("origin")
      if (!origin || origin !== new URL(request.url).origin) return json({ error: "Invalid request origin" }, 403)
    }
    const read = ["read", "logs", "health"].includes(action)
    const bucket = Math.floor(Date.now() / 60_000)
    const counter = await RateLimit.findOneAndUpdate({ _id: `${user.id}:${read ? "read" : "write"}:${bucket}` }, { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(Date.now() + 120_000) } }, { upsert: true, new: true })
    if (counter.count > (read ? 90 : 12)) return json({ error: "Rate limit reached. Try again shortly." }, 429)
    if (read) await emailAudit(user, `EMAIL_${action.toUpperCase()}_ACCESSED`)
    if (action === "read") return json({ config: sanitizeConfiguration(await Configuration.findById("primary").lean()), health: await health(), canManage: user.role === "super_admin" })
    if (action === "health") return json(await health())
    if (action === "logs") {
      const query = logQuery.safeParse(Object.fromEntries(new URL(request.url).searchParams))
      if (!query.success) return json({ error: "Invalid filters" }, 400)
      const { page, status, eventType, recipient, entityId, from, to } = query.data
      if (eventType && eventType !== "test" && !(eventType in EMAIL_EVENTS)) return json({ error: "Invalid event" }, 400)
      const start = from ? new Date(`${from}T00:00:00Z`) : null; const end = to ? new Date(`${to}T23:59:59.999Z`) : null
      if ((start && Number.isNaN(+start)) || (end && Number.isNaN(+end)) || (start && end && start > end)) return json({ error: "Invalid date range" }, 400)
      const filter = { ...(status ? { status } : {}), ...(eventType ? { eventType } : {}), ...(recipient ? { recipients: recipient.trim().toLowerCase() } : {}), ...(entityId ? { entityId } : {}), ...((start || end) ? { createdAt: { ...(start ? { $gte: start } : {}), ...(end ? { $lte: end } : {}) } } : {}) }
      const [items, total] = await Promise.all([Delivery.find(filter).select("eventType entityId subject recipients status attemptCount providerMessageIds failureCategory sentAt createdAt updatedAt retryEligible nextRetryAt acceptedRecipients").sort({ createdAt: -1, _id: -1 }).skip((page - 1) * 20).limit(20).lean(), Delivery.countDocuments(filter)])
      const logFields = ["_id", "eventType", "entityId", "subject", "recipients", "status", "attemptCount", "providerMessageIds", "failureCategory", "sentAt", "createdAt", "updatedAt", "retryEligible", "nextRetryAt", "acceptedRecipients"]
      return json({ items: items.map(item => Object.fromEntries(logFields.map(key => [key, item[key] ?? null]))), total, page, pages: Math.ceil(total / 20) })
    }
    if (action === "process") {
      await emailAudit(user, "PENDING_QUEUE_PROCESS_REQUESTED")
      const processed = await processPendingEmails()
      await emailAudit(user, "PENDING_QUEUE_PROCESSED")
      return json({ processed })
    }
    if (action === "retry") {
      if (!z.string().regex(/^[a-f0-9]{24}$/i).safeParse(id).success) return json({ error: "Invalid log ID" }, 400)
      await emailAudit(user, "RETRY_REQUESTED")
      try {
        const result = await retryEmail(id!)
        await emailAudit(user, "FAILED_EMAIL_RETRIED", result?.status === "sent" ? "success" : "failed", [], result?.failureCategory || undefined)
        return json({ status: result?.status, failureCategory: result?.failureCategory })
      } catch { await emailAudit(user, "RETRY_FAILED", "failed", [], "RETRY_NOT_ELIGIBLE"); throw new EmailError("RETRY_NOT_ELIGIBLE", 409) }
    }
    let body: unknown
    if (action === "save") {
      const raw = await request.text()
      if (raw.length > 16000) return json({ error: "Request too large" }, 413)
      try { body = JSON.parse(raw) } catch { return json({ error: "Invalid configuration" }, 400) }
    }
    return json({ config: await configurationAction(action, user, body), health: await health() })
  } catch (error) { return json({ error: error instanceof EmailError ? error.category : "EMAIL_SERVICE_UNAVAILABLE" }, error instanceof EmailError ? error.status : 503) }
}
