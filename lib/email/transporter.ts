import nodemailer, { type Transporter } from "nodemailer"

type EmailConfiguration = { host: string; port: number; secure: boolean; user: string; password: string; from: string; recipients: string[] }
let transporter: Transporter | null = null

export function getEmailConfiguration(): EmailConfiguration {
  const host = process.env.SMTP_HOST?.trim()
  const portValue = process.env.SMTP_PORT?.trim()
  const user = process.env.SMTP_USER?.trim()
  const password = (process.env.SMTP_PASS || process.env.SMTP_PASSWORD)?.trim()
  const from = process.env.MAIL_FROM?.trim()
  const recipients = (process.env.LEAD_NOTIFICATION_EMAILS || process.env.ADMIN_NOTIFICATION_EMAILS || "").split(",").map((email) => email.trim().toLowerCase()).filter((email, index, list) => email && list.indexOf(email) === index)
  const missing = [["SMTP_HOST", host], ["SMTP_PORT", portValue], ["SMTP_USER", user], ["SMTP_PASS", password], ["MAIL_FROM", from], ["LEAD_NOTIFICATION_EMAILS", recipients.length ? "configured" : ""]].filter(([, value]) => !value).map(([name]) => name)
  if (missing.length) throw new Error(`Email configuration is incomplete: ${missing.join(", ")}`)
  const port = Number(portValue)
  if (!Number.isInteger(port) || port <= 0) throw new Error("SMTP_PORT must be a valid port number")
  return { host: host!, port, secure: port === 465 ? true : process.env.SMTP_SECURE === "true", user: user!, password: password!, from: from!, recipients }
}

export function getEmailTransporter() {
  const config = getEmailConfiguration()
  transporter ??= nodemailer.createTransport({ host: config.host, port: config.port, secure: config.secure, auth: { user: config.user, pass: config.password }, pool: true, maxConnections: 3, connectionTimeout: 15_000, greetingTimeout: 15_000, socketTimeout: 30_000 })
  return { transporter, config }
}

export async function verifyEmailTransporter() {
  return getEmailTransporter().transporter.verify()
}
