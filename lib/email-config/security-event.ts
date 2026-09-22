import "server-only"
import { createHash } from "node:crypto"
import { securityAlertEmail } from "@/lib/email/alert-template"
import { notifyEmail } from "./delivery"
export async function failedLoginEmail(account: string) {
  const entityId = createHash("sha256").update(account.toLowerCase().trim()).digest("hex")
  const window = Math.floor(Date.now() / 900_000)
  await notifyEmail({ eventKey: `failed-login:${window}`, eventType: "securityAlert", entityId, ...securityAlertEmail() })
}
