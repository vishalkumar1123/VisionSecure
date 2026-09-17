import "server-only"
import { createHash } from "node:crypto"
import { notifyEmail } from "./delivery"
export async function failedLoginEmail(account: string) {
  const entityId = createHash("sha256").update(account.toLowerCase().trim()).digest("hex")
  const window = Math.floor(Date.now() / 900_000)
  await notifyEmail({ eventKey: `failed-login:${window}`, eventType: "securityAlert", entityId, subject: "VisionSecure sign-in security alert", text: "An unsuccessful account sign-in was detected. Review account security in the admin dashboard. Failed attempts across accounts are grouped into a 15-minute alert window. No credentials are included." })
}
