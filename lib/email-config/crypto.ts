import "server-only"
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto"
export type EncryptedValue = { ciphertext: string; iv: string; authTag: string; version: number }
function key() {
  const encoded = process.env.EMAIL_CONFIG_ENCRYPTION_KEY || ""
  // 32 random bytes encoded as exactly 64 hex characters; never silently derive a key.
  if (!/^[a-fA-F0-9]{64}$/.test(encoded)) throw new Error("EMAIL_ENCRYPTION_KEY_NOT_CONFIGURED")
  return Buffer.from(encoded, "hex")
}
export function encryptionReady() { try { key(); return true } catch { return false } }
export function encryptSecret(value: string, field: "username" | "password"): EncryptedValue {
  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", key(), iv)
  cipher.setAAD(Buffer.from(`visionsecure-email:v1:${field}`))
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()])
  return { ciphertext: ciphertext.toString("base64"), iv: iv.toString("base64"), authTag: cipher.getAuthTag().toString("base64"), version: 1 }
}
export function decryptSecret(value: EncryptedValue, field: "username" | "password") {
  try {
    if (value.version !== 1) throw new Error()
    const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(value.iv, "base64"))
    decipher.setAAD(Buffer.from(`visionsecure-email:v1:${field}`))
    decipher.setAuthTag(Buffer.from(value.authTag, "base64"))
    return Buffer.concat([decipher.update(Buffer.from(value.ciphertext, "base64")), decipher.final()]).toString("utf8")
  } catch { throw new Error("EMAIL_SECRET_UNAVAILABLE") }
}
