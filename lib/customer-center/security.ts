import "server-only"
import { createHmac, timingSafeEqual } from "node:crypto"
import { Schema, model, models } from "mongoose"
export class CenterError extends Error { constructor(public code: string, public status = 400) { super(code) } }
export function equalSecret(a: string, b: string) { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && x.length > 0 && timingSafeEqual(x, y) }
export function validSignature(raw: string, signature: string | null, secret = process.env.META_APP_SECRET || "") {
  return Boolean(secret && signature && equalSecret(signature, `sha256=${createHmac("sha256", secret).update(raw).digest("hex")}`))
}
export function requiredMeta() { return ["META_APP_SECRET", "META_VERIFY_TOKEN", "META_ACCESS_TOKEN", "META_PHONE_NUMBER_ID", "META_GRAPH_VERSION"].filter(k => !process.env[k]?.trim() || (k === "META_GRAPH_VERSION" && !/^v\d+\.0$/.test(process.env[k]!))) }
export function requiredAI() { return ["OPENAI_API_KEY", "OPENAI_MODEL"].filter(k => !process.env[k]?.trim()) }
const limit = new Schema({ _id: String, count: Number, expiresAt: Date }); limit.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
const Rate = models.CustomerCenterRate || model("CustomerCenterRate", limit)
export async function limitRequest(key: string, max = 60, ms = 60000) { const r = await Rate.findOneAndUpdate({ _id: `${key}:${Math.floor(Date.now() / ms)}` }, { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(Date.now() + ms * 2) } }, { upsert: true, new: true }); if (r.count > max) throw new CenterError("RATE_LIMITED", 429) }
export async function boundedBody(request: Request, max: number) {
  if (Number(request.headers.get("content-length")) > max) throw new CenterError("PAYLOAD_TOO_LARGE", 413)
  const reader = request.body?.getReader(); if (!reader) return ""
  const chunks: Uint8Array[] = []; let size = 0
  while (true) { const chunk = await reader.read(); if (chunk.done) break; size += chunk.value.byteLength; if (size > max) { await reader.cancel(); throw new CenterError("PAYLOAD_TOO_LARGE", 413) } chunks.push(chunk.value) }
  return Buffer.concat(chunks).toString("utf8")
}
