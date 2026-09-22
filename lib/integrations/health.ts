import "server-only"
import { createHash } from "node:crypto"
import mongoose from "mongoose"
import OpenAI from "openai"
import nodemailer from "nodemailer"
import Health from "@/models/IntegrationHealth"
import Google from "@/models/GoogleIntegration"
import Email from "@/models/EmailConfiguration"
import { AIAgentSettings, CustomerMessage } from "@/models/CustomerCenter"
import { appUrl, appUrlConflicts } from "@/lib/app-url"
import { credentials, setupStatus, verify, safeError } from "@/lib/google/oauth"
import { requiredAI, requiredMeta, CenterError } from "@/lib/customer-center/security"
import { aiClient } from "@/lib/customer-center/agent"
import { centerAudit } from "@/lib/customer-center/events"
import { testMeta } from "@/lib/channels/whatsapp"
import { createSMTP } from "@/lib/email-config/transport"

export const providers = ["google", "ai", "meta", "email", "database"] as const
export type Provider = typeof providers[number]
const present = (key: string) => Boolean(process.env[key]?.trim())
export function configurationFingerprint(provider: Provider) {
  const names: Record<Provider, string[]> = {
    ai: ["OPENAI_API_KEY", "OPENAI_MODEL"], meta: ["META_APP_SECRET", "META_VERIFY_TOKEN", "META_ACCESS_TOKEN", "META_PHONE_NUMBER_ID", "META_GRAPH_VERSION"],
    google: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_TOKEN_ENCRYPTION_KEY", "GA4_PROPERTY_ID", "GOOGLE_SEARCH_CONSOLE_SITE_URL"],
    email: ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_PASSWORD", "EMAIL_CONFIG_ENCRYPTION_KEY"], database: ["MONGODB_URI"],
  }
  return createHash("sha256").update(JSON.stringify(names[provider].map(name => process.env[name] || ""))).digest("hex")
}
export function safeAIError(error: unknown) {
  if (error instanceof CenterError) return error.code
  const status = error instanceof OpenAI.APIError ? error.status : undefined
  const code = error instanceof OpenAI.APIError ? error.code : undefined
  return status === 401 ? "OPENAI_AUTHENTICATION_FAILED" : status === 403 || status === 404 ? "OPENAI_MODEL_ACCESS_DENIED" : status === 429 ? code === "credit_balance_exhausted" || code === "insufficient_quota" ? "OPENAI_BILLING_CREDITS_REQUIRED" : "OPENAI_QUOTA_OR_RATE_LIMIT" : "OPENAI_REQUEST_FAILED"
}
export async function testAIConnection() {
  const result = await aiClient().responses.create({ model: process.env.OPENAI_MODEL!, store: false, input: "Reply with OK.", max_output_tokens: 32 })
  if (result.status !== "completed" || !result.output_text?.trim()) throw new CenterError("OPENAI_TEST_INCOMPLETE", 503)
}
export async function testIntegration(provider: Provider, actorId: string) {
  const start = Date.now()
  let status: "Passed" | "Warning" | "Failed" = "Passed", error: string | null = null
  try {
    if (provider === "ai") await testAIConnection()
    if (provider === "meta") {
      const result = await testMeta()
      await AIAgentSettings.updateOne({ _id: "primary" }, { $set: { metaStatus: "Verified", metaCheckedAt: new Date(), metaBusinessNumber: result.displayPhone } }, { upsert: true })
    }
    if (provider === "google") {
      const { client, revision } = await credentials()
      const checks = await verify(client)
      await Google.updateOne({ _id: "primary", revision }, { $set: checks })
      if (checks.analytics !== "Connected" || checks.search !== "Connected") { status = "Warning"; error = "GOOGLE_PARTIAL_ACCESS" }
    }
    if (provider === "database") { if (!mongoose.connection.db) throw new Error(); await mongoose.connection.db.admin().ping() }
    if (provider === "email") {
      const config = await Email.findById("primary").select("+usernameEncrypted +passwordEncrypted").lean()
      if (config?.smtpHost) {
        const transport = await createSMTP(config)
        try { await transport.verify() } finally { transport.close() }
      } else {
        if (!present("SMTP_HOST") || !present("SMTP_USER") || !(present("SMTP_PASS") || present("SMTP_PASSWORD"))) throw new CenterError("EMAIL_NOT_CONFIGURED")
        const port = Number(process.env.SMTP_PORT || 465)
        if (![465, 587].includes(port)) throw new CenterError("SMTP_PORT_INVALID")
        const transport = nodemailer.createTransport({ host: process.env.SMTP_HOST, port, secure: port === 465, requireTLS: true, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD }, connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000, logger: false, debug: false })
        try { await transport.verify() } finally { transport.close() }
      }
    }
  } catch (cause) {
    status = "Failed"
    error = provider === "ai" ? safeAIError(cause) : provider === "google" ? safeError(cause).code : cause instanceof CenterError ? cause.code : `${provider.toUpperCase()}_CONNECTION_FAILED`
    if (/NOT_CONFIGURED|NOT_CONNECTED|CONFIGURATION_REQUIRED/.test(error)) status = "Warning"
  }
  const checkedAt = new Date(), latencyMs = Date.now() - start
  await Health.updateOne({ _id: provider }, { $set: { status, checkedAt, error, latencyMs, fingerprint: configurationFingerprint(provider), ...(status === "Passed" ? { lastSuccessAt: checkedAt } : {}) } }, { upsert: true })
  if (provider === "ai") await AIAgentSettings.updateOne({ _id: "primary" }, { $set: { aiStatus: status === "Passed" ? "Connected" : "Configuration error", aiCheckedAt: checkedAt } }, { upsert: true })
  await centerAudit(`${provider.toUpperCase()}_TEST_${status.toUpperCase()}`, undefined, actorId)
  return { provider, status, error, checkedAt, latencyMs, ...(provider === "ai" ? { model: process.env.OPENAI_MODEL || null } : {}) }
}
export async function integrationSummary() {
  const [health, google, setup, settings, email, inbound] = await Promise.all([
    Health.find({}).select("+fingerprint").lean(), Google.findById("primary").lean(), setupStatus(), AIAgentSettings.findById("primary").lean(), Email.findById("primary").lean(),
    CustomerMessage.findOne({ channel: "WHATSAPP", direction: "INBOUND" }).sort({ createdAt: -1 }).select("createdAt").lean(),
  ])
  const checks = Object.fromEntries(health.filter(h => providers.includes(h._id as Provider)).map(h => [String(h._id), { status: h.fingerprint === configurationFingerprint(h._id as Provider) ? h.status : "Warning", checkedAt: h.checkedAt, lastSuccessAt: h.lastSuccessAt, error: h.fingerprint === configurationFingerprint(h._id as Provider) ? h.error : "CONFIGURATION_CHANGED_RETEST", latencyMs: h.latencyMs }]))
  const emailConfigured = Boolean(email?.smtpHost && (!email.authRequired || email.passwordConfigured && email.usernameConfigured)) || present("SMTP_HOST") && present("SMTP_USER") && (present("SMTP_PASS") || present("SMTP_PASSWORD"))
  const checklist = [
    { name: "OpenAI API Key", configured: present("OPENAI_API_KEY") },
    { name: "MongoDB", configured: present("MONGODB_URI") },
    { name: "Google Encryption", configured: !setup.missing.includes("GOOGLE_TOKEN_ENCRYPTION_KEY") },
    { name: "Google OAuth App", configured: !setup.missing.some(n => ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"].includes(n)) },
    ...["META_APP_SECRET", "META_VERIFY_TOKEN", "META_ACCESS_TOKEN", "META_PHONE_NUMBER_ID", "META_GRAPH_VERSION"].map(name => ({ name, configured: !requiredMeta().includes(name) })),
    { name: "Email", configured: emailConfigured },
  ]
  const metaMissing = requiredMeta(), aiMissing = requiredAI()
  const googleReady = !!google && !setup.missing.length && google.analytics === "Connected" && google.search === "Connected"
  const metaReady = !metaMissing.length && checks.meta?.status === "Passed" && !!settings?.webhookVerifiedAt && !!settings?.lastWebhookAt
  const progress = [
    { name: "Google OAuth", ready: !!google && !setup.missing.length },
    { name: "Analytics", ready: googleReady || !!google && google.analytics === "Connected" && !setup.missing.length },
    { name: "Search Console", ready: googleReady || !!google && google.search === "Connected" && !setup.missing.length },
    { name: "OpenAI", ready: !aiMissing.length && checks.ai?.status === "Passed" },
    { name: "WhatsApp", ready: metaReady }, { name: "Instagram", ready: false }, { name: "Facebook", ready: false },
  ]
  return { checklist, checks, progress, appUrl: appUrl(), urlConflicts: appUrlConflicts(), model: process.env.OPENAI_MODEL || null,
    ai: { missing: aiMissing, configured: !aiMissing.length, mode: settings?.mode || "DRAFT" },
    google: { status: googleReady ? "Connected" : google ? "Partial" : "Missing" },
    meta: { missing: metaMissing, instagramAccountConfigured: /^\d+$/.test(process.env.META_INSTAGRAM_ACCOUNT_ID || ""), status: metaReady ? "Connected" : metaMissing.length === 5 ? "Missing" : "Partial", businessNumber: settings?.metaBusinessNumber || null, webhook: settings?.webhookVerifiedAt ? "Verified" : "Waiting", lastWebhookAt: settings?.lastWebhookAt || null, lastInboundAt: inbound?.createdAt || null, lastSendAt: settings?.lastSendAt || null },
    email: { configured: emailConfigured, active: email?.status === "ACTIVE" },
    webhookUrl: appUrl().startsWith("https:") ? `${appUrl()}/api/webhooks/whatsapp` : null,
  }
}
