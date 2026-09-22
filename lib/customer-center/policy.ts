import { z } from "zod"
export const categories = ["FAQ", "SERVICES", "BUSINESS_HOURS", "SERVICE_AREAS", "QUALIFICATION", "PRODUCT", "POLICY", "PRICING", "DO_NOT_SAY"] as const
export const settingsInput = z.object({ enabled: z.boolean(), mode: z.enum(["HUMAN_ONLY", "DRAFT", "AUTO"]), autoCategories: z.array(z.enum(categories)).max(9), maxReplyLength: z.number().int().min(100).max(1200), maxClarifications: z.number().int().min(1).max(5), allowAfterHours: z.boolean(), weekOpen: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/), weekClose: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/), sundayOpen: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/), sundayClose: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/), revision: z.number().int().positive() }).strict()
export const knowledgeInput = z.object({ title: z.string().trim().min(3).max(160), category: z.enum(categories), content: z.string().trim().min(5).max(6000), keywords: z.array(z.string().trim().min(2).max(50)).max(20), replyEnglish: z.string().max(1200).default(""), replyHinglish: z.string().max(1200).default(""), state: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]), source: z.string().max(200).default("") }).strict()
export function normalizePhone(value: string) {
  const digits = value.replace(/[\s()+.-]/g, "")
  if (!/^[1-9]\d{7,14}$/.test(digits)) throw new Error("INVALID_PHONE")
  return digits
}
export function inboundPolicy(text: string) {
  if (/\b(stop|unsubscribe|don't message|do not message|not interested|no thanks|message mat|msg mat)\b/i.test(text)) return "OPT_OUT"
  if (/\b(human|person|agent|employee|manager|insaan|aadmi|team se baat|call me|call karo|baat karni)\b/i.test(text)) return "HUMAN_REQUEST"
  if (/\b(refund|legal|lawyer|complaint|fraud|payment|discount|credit|bulk|custom quot|shikayat|paise wapas)\b/i.test(text)) return "HUMAN_REQUIRED"
  if (/ignore.{0,30}instructions|system prompt|api.?key|admin password|database|purchase cost|internal margin/i.test(text)) return "UNTRUSTED_INSTRUCTION"
  return null
}
export function isHinglish(text: string) { return /[\u0900-\u097f]|\b(hai|hain|chahiye|kitne|kya|ghar|lagwana|lgwana|karna|ka|ke|ji|mera|mujhe|kitna)\b/i.test(text) }
export function workingNow(settings: { weekOpen: string; weekClose: string; sundayOpen: string; sundayClose: string }, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now)
  const get = (type: string) => parts.find(p => p.type === type)?.value || ""
  const time = `${get("hour")}:${get("minute")}`, sunday = get("weekday") === "Sun"
  return time >= (sunday ? settings.sundayOpen : settings.weekOpen) && time <= (sunday ? settings.sundayClose : settings.weekClose)
}
export const decisionSchema = z.object({ reply: z.string().min(1).max(1200), summary: z.string().max(1800), intent: z.enum(["NEW_ENQUIRY", "PRICE_QUERY", "PRODUCT_INFORMATION", "SERVICE_INFORMATION", "SITE_VISIT", "QUOTATION", "FOLLOW_UP", "EXISTING_CUSTOMER", "TECHNICAL_SUPPORT", "COMPLAINT", "INSTALLATION_STATUS", "AMC", "PAYMENT", "HUMAN_REQUEST", "GENERAL", "SPAM", "UNKNOWN"]), category: z.enum(categories), knowledgeId: z.string(), action: z.enum(["NONE", "CREATE_LEAD", "SITE_VISIT", "SUPPORT", "HANDOFF"]), needsHuman: z.boolean(), reason: z.string().max(200) }).strict()
