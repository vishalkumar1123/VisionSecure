import { z } from "zod"
export const EMAIL_EVENTS = {
  leadCreated: "New lead created", leadAssigned: "Lead assigned", leadStatusChanged: "Lead status changed",
  siteVisit: "Site visit scheduled / rescheduled / cancelled", quotation: "Quotation created / sent / approved",
  order: "Order created / confirmed", payment: "Payment recorded / verified", workOrder: "Work order created / assigned / completed",
  installation: "Installation completed", complaint: "Complaint created / escalated / resolved",
  userCreated: "User created", userRoleChanged: "User role changed", userAccessChanged: "User activated / deactivated",
  passwordReset: "Password reset security event", settingsChanged: "Important settings changed",
  securityAlert: "Failed login / security alert", automationFailure: "Automation failure", newsletter: "Newsletter subscription",
} as const
export type EmailEvent = keyof typeof EMAIL_EVENTS
export const defaultEvents = Object.fromEntries(Object.keys(EMAIL_EVENTS).map(key => [key, true])) as Record<EmailEvent, boolean>
export const emailAddress = z.string().trim().toLowerCase().email().max(254)
export const configSchema = z.object({
  revision: z.number().int().nonnegative().default(0),
  provider: z.enum(["Zoho Mail India", "Custom SMTP"]),
  smtpHost: z.string().trim().toLowerCase().max(253).regex(/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,63}$/),
  smtpPort: z.union([z.literal(465), z.literal(587)]),
  encryption: z.enum(["SSL", "STARTTLS"]), secure: z.boolean(), requireTLS: z.boolean(), authRequired: z.boolean(),
  username: z.string().trim().max(254).default(""), password: z.string().max(1024).default(""),
  freshCredentialConfirmed: z.boolean().default(false),
  fromName: z.string().trim().min(1).max(100).regex(/^[^\r\n]+$/), fromEmail: emailAddress,
  replyTo: z.union([emailAddress, z.literal("")]),
  recipients: z.array(emailAddress).min(1).max(10).transform(values => [...new Set(values)]),
  eventSettings: z.object(Object.fromEntries(Object.keys(EMAIL_EVENTS).map(key => [key, z.boolean()])) as Record<EmailEvent, z.ZodBoolean>).strict(),
  failureThreshold: z.number().int().min(1).max(100).default(3),
}).strict().superRefine((data, ctx) => {
  if (data.smtpPort === 465 && (!data.secure || data.encryption !== "SSL" || data.requireTLS)) ctx.addIssue({ code: "custom", path: ["smtpPort"], message: "Port 465 requires SSL and secure connection." })
  if (data.smtpPort === 587 && (data.secure || data.encryption !== "STARTTLS" || !data.requireTLS)) ctx.addIssue({ code: "custom", path: ["smtpPort"], message: "Port 587 requires STARTTLS with Require TLS." })
  if (data.password && !data.freshCredentialConfirmed) ctx.addIssue({ code: "custom", path: ["freshCredentialConfirmed"], message: "Confirm that this is a newly changed password or new app password." })
  if (data.provider === "Zoho Mail India" && (data.smtpHost !== "smtp.zoho.in" || !data.authRequired)) ctx.addIssue({ code: "custom", path: ["smtpHost"], message: "Use the Zoho India host with authentication." })
})
export type ConfigurationInput = z.infer<typeof configSchema>
export const defaults: ConfigurationInput = { revision: 0, provider: "Zoho Mail India", smtpHost: "smtp.zoho.in", smtpPort: 465, encryption: "SSL", secure: true, requireTLS: false, authRequired: true, username: "", password: "", freshCredentialConfirmed: false, fromName: "VisionSecure Smart Technologies", fromEmail: "info@visionsecuretech.in", replyTo: "info@visionsecuretech.in", recipients: ["info@visionsecuretech.in", "vishalkumar8303763@gmail.com"], eventSettings: defaultEvents, failureThreshold: 3 }
export const SAFE_CATEGORIES = ["AUTHENTICATION_FAILED", "CONNECTION_FAILED", "TLS_FAILED", "RECIPIENT_REJECTED", "DELIVERY_UNCERTAIN", "CONFIGURATION_ERROR", "EMAIL_SERVICE_NOT_ACTIVE", "EVENT_DISABLED", "INTERNAL_ERROR"] as const
export function safeCategory(error: unknown): string {
  const e = error as { code?: string; command?: string; message?: string }
  if (["EMAIL_ENCRYPTION_KEY_NOT_CONFIGURED", "EMAIL_SECRET_UNAVAILABLE", "SMTP_HOST_NOT_PUBLIC", "SMTP_CREDENTIALS_REQUIRED"].includes(e?.message || "")) return "CONFIGURATION_ERROR"
  if (e?.code === "EAUTH") return "AUTHENTICATION_FAILED"
  if (["ECONNECTION", "ECONNREFUSED", "EDNS", "ENOTFOUND"].includes(e?.code || "")) return "CONNECTION_FAILED"
  if (["ETLS", "CERT_HAS_EXPIRED", "DEPTH_ZERO_SELF_SIGNED_CERT"].includes(e?.code || "")) return "TLS_FAILED"
  if (e?.code === "EENVELOPE") return "RECIPIENT_REJECTED"
  // Socket timeouts can happen after the provider accepts DATA: never retry automatically.
  return "DELIVERY_UNCERTAIN"
}
export function canActivate(config: { isVerified?: boolean; lastTestStatus?: string | null; status?: string }) {
  return !!config.isVerified && config.lastTestStatus === "success" && ["TEST_EMAIL_SENT", "DISABLED", "ACTIVE"].includes(config.status || "")
}
export function emailPermission(role: string, action: string) { return role === "super_admin" || (role === "admin" && ["read", "logs", "health"].includes(action)) }
