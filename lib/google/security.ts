import "server-only"
import { createCipheriv, createDecipheriv, randomBytes, createHash } from "node:crypto"

export class GoogleError extends Error {
  constructor(public code: string, public status = 503) { super(code) }
}
function key() {
  const value = process.env.GOOGLE_TOKEN_ENCRYPTION_KEY || ""
  if (!/^[a-f\d]{64}$/i.test(value)) throw new GoogleError("ENCRYPTION_KEY_REQUIRED")
  return Buffer.from(value, "hex")
}
export function configurationMissing() {
  return [!process.env.GOOGLE_CLIENT_ID && "GOOGLE_CLIENT_ID", !process.env.GOOGLE_CLIENT_SECRET && "GOOGLE_CLIENT_SECRET", !/^[a-f\d]{64}$/i.test(process.env.GOOGLE_TOKEN_ENCRYPTION_KEY || "") && "GOOGLE_TOKEN_ENCRYPTION_KEY"].filter(Boolean) as string[]
}
export function encryptToken(value: string) {
  const iv = randomBytes(12), cipher = createCipheriv("aes-256-gcm", key(), iv)
  cipher.setAAD(Buffer.from("visionsecure-google:v1"))
  const data = Buffer.concat([cipher.update(value, "utf8"), cipher.final()])
  return ["v1", iv.toString("base64"), cipher.getAuthTag().toString("base64"), data.toString("base64")].join(".")
}
export function decryptToken(value: string) {
  try {
    const [version, iv, tag, data] = value.split(".")
    if (version !== "v1") throw new Error()
    const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(iv, "base64"))
    decipher.setAAD(Buffer.from("visionsecure-google:v1")); decipher.setAuthTag(Buffer.from(tag, "base64"))
    return Buffer.concat([decipher.update(Buffer.from(data, "base64")), decipher.final()]).toString("utf8")
  } catch { throw new GoogleError("TOKEN_UNAVAILABLE_RECONNECT") }
}
export const digest = (value: string) => createHash("sha256").update(value).digest("hex")
export function appOrigin(request: Request) {
  const origin = new URL(request.url).origin
  const allowed = process.env.NODE_ENV === "production" ? ["https://visionsecuretech.in"] : ["http://localhost:3000", "http://127.0.0.1:3000", "https://visionsecuretech.in"]
  if (!allowed.includes(origin)) throw new GoogleError("UNTRUSTED_ORIGIN", 403)
  return origin
}
