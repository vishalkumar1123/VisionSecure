import "server-only"
import { randomUUID } from "node:crypto"
import Configuration from "@/models/EmailConfiguration"
import Delivery from "@/models/EmailDeliveryLog"
import { encryptSecret, encryptionReady } from "./crypto"
import { createSMTP } from "./transport"
import { configSchema, canActivate, safeCategory } from "./shared"
import { emailAudit, emailNotice, type Actor } from "./audit"
import { queueEmail, notifyEmail } from "./delivery"
export class EmailError extends Error { constructor(public category: string, public status = 400) { super(category) } }
const safeKeys = ["revision", "provider", "smtpHost", "smtpPort", "encryption", "secure", "requireTLS", "authRequired", "usernameConfigured", "passwordConfigured", "fromName", "fromEmail", "replyTo", "recipients", "eventSettings", "failureThreshold", "status", "isVerified", "verifiedAt", "lastTestedAt", "lastTestStatus", "lastTestErrorCategory", "activatedAt", "disabledAt", "updatedAt"] as const
export function sanitizeConfiguration(config: Record<string, unknown> | null) {
  return config ? Object.fromEntries(safeKeys.map(key => [key, config[key] ?? null])) : null
}
export async function health() {
  // An interrupted in-flight SMTP delivery is ambiguous and must never be blindly retried.
  await Delivery.updateMany({ status: "pending", sending: true, startedAt: { $lt: new Date(Date.now() - 600_000) } }, { $set: { status: "uncertain", retryEligible: false, failureCategory: "DELIVERY_UNCERTAIN" } })
  const midnight = new Date(); midnight.setUTCHours(0,0,0,0)
  const [config, lastSuccess, lastFailure, sentToday, pending, failed, failed24h] = await Promise.all([
    Configuration.findById("primary").lean(), Delivery.findOne({ status: "sent" }).sort({ sentAt: -1 }).select("sentAt").lean(),
    Delivery.findOne({ status: { $in: ["failed", "uncertain"] } }).sort({ updatedAt: -1 }).select("updatedAt").lean(),
    Delivery.countDocuments({ status: "sent", sentAt: { $gte: midnight } }), Delivery.countDocuments({ status: "pending" }),
    Delivery.countDocuments({ status: { $in: ["failed", "uncertain"] } }), Delivery.countDocuments({ status: { $in: ["failed", "uncertain"] }, updatedAt: { $gte: new Date(Date.now() - 86400_000) } }),
  ])
  return { configurationExists: !!config?.smtpHost, verified: !!config?.isVerified, active: config?.status === "ACTIVE", lastSuccessfulDelivery: lastSuccess?.sentAt || null, lastFailedDelivery: lastFailure?.updatedAt || null, sentToday, pending, failed, failed24h, encryptionKeyConfigured: encryptionReady() }
}
export async function configurationAction(action: string, actor: Actor, body?: unknown) {
  await Configuration.updateOne({ _id: "primary" }, { $setOnInsert: { createdBy: actor.id, status: "NOT_CONFIGURED", revision: 0 } }, { upsert: true })
  const token = randomUUID()
  const config = await Configuration.findOneAndUpdate({ _id: "primary", $or: [{ lockUntil: { $lt: new Date() } }, { lockUntil: null }] }, { $set: { lockToken: token, lockUntil: new Date(Date.now() + 600_000) } }, { new: true }).select("+usernameEncrypted +passwordEncrypted")
  if (!config) throw new EmailError("CONFIGURATION_BUSY", 409)
  try {
    await emailAudit(actor, `${action.toUpperCase()}_REQUESTED`)
    if (action === "save") {
      const parsed = configSchema.safeParse(body)
      if (!parsed.success) throw new EmailError("INVALID_CONFIGURATION")
      const input = parsed.data
      if (input.revision !== config.revision) throw new EmailError("CONFIGURATION_CHANGED_RELOAD", 409)
      if (!encryptionReady()) throw new EmailError("ENCRYPTION_KEY_NOT_CONFIGURED", 503)
      if (input.authRequired && (!(input.username || config.usernameConfigured) || !(input.password || config.passwordConfigured))) throw new EmailError("CREDENTIALS_REQUIRED")
      // Do not import or reuse the exposed legacy environment credential.
      if (input.password && [process.env.SMTP_PASS, process.env.SMTP_PASSWORD].filter(Boolean).includes(input.password)) throw new EmailError("NEW_APP_PASSWORD_REQUIRED")
      const { password, username, freshCredentialConfirmed: _confirmed, revision: _revision, ...normal } = input
      const fields = Object.keys(normal).filter(key => JSON.stringify(config.get(key)) !== JSON.stringify(normal[key as keyof typeof normal]))
      if (username) { config.usernameEncrypted = encryptSecret(username, "username"); config.usernameConfigured = true; fields.push("username") }
      if (password) { config.passwordEncrypted = encryptSecret(password, "password"); config.passwordConfigured = true; fields.push("passwordReplaced") }
      config.set(normal); config.revision += 1; config.status = "SAVED_NOT_VERIFIED"; config.isVerified = false; config.verifiedAt = null; config.lastTestStatus = null; config.lastTestErrorCategory = null; config.activatedAt = null; config.updatedBy = actor.id
      await config.save()
      await notifyEmail({ eventKey: `email-settings:${config.revision}`, eventType: "settingsChanged", entityId: "primary", subject: "VisionSecure email settings changed", text: "The email notification configuration was updated by a super-admin. Verification and a test are required before activation." })
      await emailAudit(actor, config.revision === 1 ? "CONFIGURATION_CREATED" : "CONFIGURATION_UPDATED", "success", fields)
      if (password) await emailAudit(actor, "PASSWORD_REPLACED")
      await emailNotice("Email configuration saved", "Email configuration changed. Verification and a new test email are required before activation.", "warning")
    } else if (action === "verify") {
      if (!config.smtpHost || (config.authRequired && (!config.usernameConfigured || !config.passwordConfigured))) throw new EmailError("CONFIGURATION_INCOMPLETE")
      config.status = "VERIFYING"; config.isVerified = false; config.lastTestStatus = null; await config.save()
      let transport: Awaited<ReturnType<typeof createSMTP>> | undefined
      try { transport = await createSMTP(config); await transport.verify(); config.isVerified = true; config.status = "VERIFIED"; config.verifiedAt = new Date(); config.lastTestErrorCategory = null }
      catch (error) { config.status = "ERROR"; config.lastTestErrorCategory = safeCategory(error); await config.save(); throw new EmailError(config.lastTestErrorCategory, 502) }
      finally { transport?.close() }
      await config.save(); await emailAudit(actor, "SMTP_VERIFICATION_SUCCEEDED")
      await emailNotice("SMTP connection verified", "Send a test email to all configured recipients before activation.", "success")
    } else if (action === "test") {
      if (!config.isVerified || !["VERIFIED", "TEST_EMAIL_SENT", "ACTIVE", "DISABLED"].includes(config.status)) throw new EmailError("VERIFY_CONNECTION_FIRST")
      // Test explicitly pauses production until the operator activates again.
      config.status = "VERIFIED"; config.lastTestStatus = null; await config.save()
      const result = await queueEmail({ eventKey: `test:${randomUUID()}`, eventType: "test", entityId: "primary", subject: "VisionSecure email configuration test", text: "This is an authorized VisionSecure SMTP configuration test. No SMTP credentials are included. Please confirm receipt before enabling notifications." }, true)
      config.lastTestedAt = new Date(); config.lastTestStatus = result?.status === "sent" ? "success" : "failed"; config.lastTestErrorCategory = result?.failureCategory || null
      config.status = result?.status === "sent" ? "TEST_EMAIL_SENT" : "ERROR"
      if (result?.failureCategory === "AUTHENTICATION_FAILED") config.isVerified = false
      await config.save()
      if (result?.status !== "sent") throw new EmailError(config.lastTestErrorCategory || "TEST_EMAIL_FAILED", 502)
      await emailAudit(actor, "TEST_EMAIL_SUCCEEDED")
      await emailNotice("Test email submitted", `Test email accepted by SMTP for all ${config.recipients.length} recipients. Check both inboxes to confirm delivery.`, "success", String(result._id))
    } else if (action === "activate") {
      if (!canActivate(config)) throw new EmailError("VERIFY_AND_TEST_BEFORE_ACTIVATION")
      config.status = "ACTIVE"; config.activatedAt = new Date(); await config.save()
      await emailAudit(actor, "SERVICE_ACTIVATED"); await emailNotice("Email service activated", "Email notification service activated successfully.", "success")
    } else if (action === "disable") {
      config.status = "DISABLED"; config.disabledAt = new Date(); await config.save()
      await emailAudit(actor, "SERVICE_DISABLED"); await emailNotice("Email service disabled", "New notification emails are disabled. Configuration has been preserved.", "information")
    } else throw new EmailError("UNKNOWN_ACTION")
    return sanitizeConfiguration(config.toObject())
  } catch (error) {
    const category = error instanceof EmailError ? error.category : "INTERNAL_ERROR"
    await emailAudit(actor, `${action.toUpperCase()}_FAILED`, "failed", [], category).catch(() => undefined)
    await emailNotice("Email configuration action failed", category === "AUTHENTICATION_FAILED" ? "SMTP authentication failed. Please check the new Zoho app password." : `Email service requires attention: ${category}.`, "error", undefined, `config-error:${category}`)
    if (error instanceof EmailError) throw error
    throw new EmailError("INTERNAL_ERROR", 500)
  } finally { await Configuration.updateOne({ _id: "primary", lockToken: token }, { $unset: { lockToken: 1, lockUntil: 1 } }) }
}
