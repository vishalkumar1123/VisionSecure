import "server-only"
import { CenterError, requiredMeta } from "@/lib/customer-center/security"
export function graphBase() {
  const version = process.env.META_GRAPH_VERSION || ""
  if (!/^v\d+\.0$/.test(version)) throw new CenterError("META_GRAPH_VERSION_REQUIRED", 503)
  return `https://graph.facebook.com/${version}`
}
export function serviceWindowOpen(lastInbound: Date | string | null | undefined, now = Date.now()) { const date = lastInbound ? +new Date(lastInbound) : NaN; return Number.isFinite(date) && date <= now + 60000 && now - date < 24 * 60 * 60 * 1000 }
export async function sendWhatsApp(to: string, text: string, lastInbound: Date | string) {
  if (requiredMeta().length) throw new CenterError("META_NOT_CONFIGURED", 503)
  if (!/^[1-9]\d{7,14}$/.test(to) || !text.trim() || text.length > 4096) throw new CenterError("INVALID_MESSAGE")
  if (!serviceWindowOpen(lastInbound)) throw new CenterError("APPROVED_TEMPLATE_REQUIRED", 409)
  // No automatic retries: a network timeout can occur after Meta accepts a send.
  let response: Response
  try { response = await fetch(`${graphBase()}/${process.env.META_PHONE_NUMBER_ID}/messages`, { method: "POST", headers: { Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}`, "Content-Type": "application/json" }, body: JSON.stringify({ messaging_product: "whatsapp", to, type: "text", text: { body: text, preview_url: false } }), signal: AbortSignal.timeout(20000), cache: "no-store" }) }
  catch { throw new CenterError("SEND_UNCERTAIN", 503) }
  const result = await response.json().catch(() => null)
  if (!response.ok) throw new CenterError(response.status === 429 ? "META_RATE_LIMIT" : "META_SEND_REJECTED", 503)
  if (typeof result?.messages?.[0]?.id !== "string") throw new CenterError("SEND_UNCERTAIN", 503)
  return result.messages[0].id as string
}
export async function testMeta() {
  if (requiredMeta().length) throw new CenterError("META_NOT_CONFIGURED", 503)
  const result = await fetch(`${graphBase()}/${process.env.META_PHONE_NUMBER_ID}?fields=display_phone_number,verified_name`, { headers: { Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}` }, signal: AbortSignal.timeout(15000), cache: "no-store" })
  if (!result.ok) throw new CenterError("META_CONFIGURATION_ERROR", 503)
  const data = await result.json(); return { displayPhone: data.display_phone_number || null, verifiedName: data.verified_name || null }
}
