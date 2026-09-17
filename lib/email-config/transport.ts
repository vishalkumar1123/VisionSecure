import "server-only"
import nodemailer from "nodemailer"
import type SMTPTransport from "nodemailer/lib/smtp-transport"
import { lookup } from "node:dns/promises"
import { decryptSecret, type EncryptedValue } from "./crypto"
export interface SMTPConfig { smtpHost: string; smtpPort: number; secure: boolean; requireTLS: boolean; authRequired: boolean; usernameEncrypted?: EncryptedValue; passwordEncrypted?: EncryptedValue }
export function publicIPv4(address: string) {
  const parts = address.split(".").map(Number)
  if (parts.length !== 4 || parts.some(n => !Number.isInteger(n) || n < 0 || n > 255)) return false
  const [a,b] = parts
  return !(a === 0 || a === 10 || a === 127 || a >= 224 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && [0,168].includes(b)) || (a === 100 && b >= 64 && b <= 127) || (a === 198 && [18,19,51].includes(b)) || (a === 203 && b === 0))
}
export async function createSMTP(config: SMTPConfig) {
  const records = await lookup(config.smtpHost, { all: true, family: 4 })
  if (!records.length || records.some(record => !publicIPv4(record.address))) throw new Error("SMTP_HOST_NOT_PUBLIC")
  if (config.authRequired && (!config.usernameEncrypted || !config.passwordEncrypted)) throw new Error("SMTP_CREDENTIALS_REQUIRED")
  // Pin a checked public IP to prevent DNS rebinding. TLS verifies the original hostname.
  const options: SMTPTransport.Options = { host: records[0].address, port: config.smtpPort, secure: config.secure, requireTLS: config.requireTLS,
    tls: { servername: config.smtpHost, rejectUnauthorized: true, minVersion: "TLSv1.2" },
    ...(config.authRequired ? { auth: { user: decryptSecret(config.usernameEncrypted!, "username"), pass: decryptSecret(config.passwordEncrypted!, "password") } } : {}),
    connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 15_000, logger: false, debug: false,
  }
  return nodemailer.createTransport(options, { disableFileAccess: true, disableUrlAccess: true })
}
