import "server-only"
import { after } from "next/server"
import { createHash } from "node:crypto"
import { connectDB } from "@/lib/mongodb"
import Configuration from "@/models/EmailConfiguration"
import Notification from "@/notification/models/notification.model"
import Delivery from "@/models/EmailDeliveryLog"
import { createSMTP } from "./transport"
import { safeCategory, type EmailEvent } from "./shared"
import { emailNotice } from "./audit"
export type MailEvent = { eventKey: string; eventType: EmailEvent | "test"; entityId: string; subject: string; text: string; html?: string }
const secretSelection = "+usernameEncrypted +passwordEncrypted"
export async function deliverLogged(id: string, test = false) {
  const config = await Configuration.findById("primary").select(secretSelection).lean()
  const log = await Delivery.findOneAndUpdate({ _id: id, status: "pending", sending: false }, { $set: { sending: true, startedAt: new Date() } }, { new: true }).select("+text +html")
  if (!log) return null
  if (!config || !config.isVerified || (!test && config.status !== "ACTIVE")) {
    log.status = "skipped"; log.failureCategory = "EMAIL_SERVICE_NOT_ACTIVE"; await log.save(); return log
  }
  if (JSON.stringify([...log.recipients].sort()) !== JSON.stringify([...config.recipients].sort())) { log.status = "skipped"; log.failureCategory = "RECIPIENTS_CHANGED"; await log.save(); return log }
  if (!test && !config.eventSettings?.[log.eventType]) { log.status = "skipped"; log.failureCategory = "EVENT_DISABLED"; await log.save(); return log }
  log.attemptCount += 1; await log.save()
  let transport: Awaited<ReturnType<typeof createSMTP>> | undefined
  try {
    transport = await createSMTP(config)
    for (const recipient of log.recipients as string[]) {
      if (log.acceptedRecipients.includes(recipient)) continue
      const messageId = `<${createHash("sha256").update(`${log.eventKey}:${recipient}`).digest("hex")}@visionsecuretech.in>`
      const result = await transport.sendMail({ from: { name: config.fromName, address: config.fromEmail }, to: recipient, replyTo: config.replyTo || undefined, subject: log.subject, text: log.text, ...(log.html ? { html: log.html } : {}), messageId })
      if (!result.accepted?.some((address: string | { address: string }) => (typeof address === "string" ? address : address.address).toLowerCase() === recipient.toLowerCase())) throw Object.assign(new Error(), { code: "EENVELOPE" })
      log.acceptedRecipients.push(recipient)
      // Use our own deterministic Message-ID, never arbitrary provider response text.
      log.providerMessageIds.push(messageId)
      await log.save()
    }
    log.status = "sent"; log.sentAt = new Date(); log.failureCategory = null; log.retryEligible = false
    await log.save()
  } catch (error) {
    const category = safeCategory(error)
    log.status = category === "DELIVERY_UNCERTAIN" ? "uncertain" : "failed"
    log.failureCategory = category; log.retryEligible = category !== "DELIVERY_UNCERTAIN" && log.attemptCount < 3
    log.nextRetryAt = new Date(Date.now() + 60_000 * 2 ** (log.attemptCount - 1))
    await log.save()
    if (category === "AUTHENTICATION_FAILED") await Configuration.updateOne({ _id: "primary", revision: config.revision }, { $set: { status: "ERROR", isVerified: false, lastTestStatus: "failed", lastTestErrorCategory: category } })
    await emailNotice("Email delivery needs attention", category === "AUTHENTICATION_FAILED" ? "SMTP authentication failed. Please check the new Zoho app password." : `Email could not be confirmed (${category}). Open delivery logs before retrying.`, "error", String(log._id), `failure:${category}`)
    const failed = await Delivery.countDocuments({ status: { $in: ["failed", "uncertain"] }, updatedAt: { $gte: new Date(Date.now() - 86400_000) } })
    if (failed >= (config.failureThreshold || 3)) await emailNotice("Email failure threshold reached", `${failed} email notifications failed or need review in the last 24 hours.`, "error", undefined, "failure-threshold")
    if (log.retryEligible) await emailNotice("Email retry queue needs attention", "Failed notifications are waiting for an authorized retry. Review delivery logs.", "warning", String(log._id), "retry-queue")
  } finally { transport?.close() }
  if (log.eventType === "leadCreated" && /^[a-f0-9]{24}$/i.test(log.entityId)) {
    await Notification.updateMany({ referenceId: log.entityId, type: "NEW_LEAD" }, { $set: { "channels.email": log.status === "sent", "deliveryStatus.email": log.status === "sent" ? "sent" : "failed" } }).catch(() => undefined)
  }
  return log
}
export async function queueEmail(event: MailEvent, test = false, defer = false) {
  await connectDB()
  await Delivery.init()
  const config = await Configuration.findById("primary").lean()
  const active = !!config?.isVerified && (test || config.status === "ACTIVE")
  const enabled = test || !!config?.eventSettings?.[event.eventType]
  let log
  try {
    log = await Delivery.create({ ...event, configRevision: config?.revision, recipients: config?.recipients || [], acceptedRecipients: [], providerMessageIds: [], status: active && enabled ? "pending" : "skipped", failureCategory: !active ? "EMAIL_SERVICE_NOT_ACTIVE" : !enabled ? "EVENT_DISABLED" : null })
  } catch (error) {
    if ((error as { code?: number }).code === 11000) return Delivery.findOne({ eventKey: event.eventKey }).lean()
    throw error
  }
  if (log.status === "skipped") {
    if (!active) await emailNotice("Email configuration requires attention", "Email notifications are inactive or incomplete. Save, verify and test the configuration before activation.", "warning", undefined, "inactive-config")
    return log
  }
  if (defer) {
    // The pending outbox record exists before returning the business response.
    after(async () => { try { await deliverLogged(String(log._id)) } catch { /* Durable pending record can be reviewed without leaking errors. */ } })
    return log
  }
  return deliverLogged(String(log._id), test)
}
/** Business actions must never fail because SMTP or delivery-log storage failed. */
export async function notifyEmail(event: MailEvent) {
  try { return await queueEmail(event, false, true) } catch { return null }
}
export async function retryEmail(id: string) {
  const config = await Configuration.findById("primary").lean()
  if (config?.status !== "ACTIVE" || !config?.isVerified) throw new Error("EMAIL_SERVICE_NOT_ACTIVE")
  const original = await Delivery.findById(id).lean()
  if (!original || original.eventType === "test" || !config.eventSettings?.[original.eventType]) throw new Error("RETRY_NOT_ELIGIBLE")
  // Do not send historical content to a new recipient list without a new business event.
  if (JSON.stringify([...original.recipients].sort()) !== JSON.stringify([...config.recipients].sort())) throw new Error("RECIPIENTS_CHANGED")
  const claimed = await Delivery.findOneAndUpdate({ _id: id, status: "failed", retryEligible: true, attemptCount: { $lt: 3 }, nextRetryAt: { $lte: new Date() } }, { $set: { status: "pending", sending: false, retryEligible: false } }, { new: true })
  if (!claimed) throw new Error("RETRY_NOT_ELIGIBLE")
  return deliverLogged(id)
}

/** Controlled recovery for persisted items whose response lifecycle did not run. */
export async function processPendingEmails() {
  const config = await Configuration.findById("primary").lean()
  if (config?.status !== "ACTIVE" || !config?.isVerified) throw new Error("EMAIL_SERVICE_NOT_ACTIVE")
  const pending = await Delivery.find({ status: "pending", sending: false }).select("_id").sort({ createdAt: 1 }).limit(5).lean()
  for (const log of pending) await deliverLogged(String(log._id))
  return pending.length
}
