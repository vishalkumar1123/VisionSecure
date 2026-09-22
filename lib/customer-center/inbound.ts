import "server-only"
import mongoose from "mongoose"
import { z } from "zod"
import { connectDB } from "@/lib/mongodb"
import { ChannelIdentity, Conversation, CustomerMessage, CustomerJob, AIAgentSettings, CustomerRequest } from "@/models/CustomerCenter"
import { inboundPolicy, normalizePhone } from "./policy"
import { CenterError } from "./security"
import { centerNotice } from "./events"
import type { InboundMessage } from "@/lib/channels/types"

const payloadSchema = z.object({ object: z.literal("whatsapp_business_account"), entry: z.array(z.object({ changes: z.array(z.object({ field: z.string(), value: z.object({ metadata: z.object({ phone_number_id: z.string() }).optional(), contacts: z.array(z.object({ wa_id: z.string(), profile: z.object({ name: z.string() }).optional() })).optional(), messages: z.array(z.object({ id: z.string().min(1).max(512), from: z.string(), timestamp: z.string().regex(/^\d+$/), type: z.string().max(40), text: z.object({ body: z.string().max(8000) }).optional(), image: z.object({ id: z.string().max(512) }).optional(), document: z.object({ id: z.string().max(512) }).optional() })).max(100).optional(), statuses: z.array(z.object({ id: z.string().max(512), status: z.enum(["sent", "delivered", "read", "failed"]), timestamp: z.string().regex(/^\d{1,11}$/).optional(), recipient_id: z.string().optional() })).max(100).optional() }) })) })) })
export function normalizeWebhook(body: unknown) {
  const parsed = payloadSchema.safeParse(body)
  if (!parsed.success) throw new CenterError("INVALID_WEBHOOK", 400)
  const inbound: InboundMessage[] = [], statuses: { id: string; status: string; timestamp?: string }[] = []
  for (const entry of parsed.data.entry) for (const change of entry.changes) {
    const value = change.value
    if (change.field !== "messages" || value.metadata?.phone_number_id !== process.env.META_PHONE_NUMBER_ID) continue
    for (const message of value.messages || []) {
      const externalCustomerId = normalizePhone(message.from), sentAt = new Date(Number(message.timestamp) * 1000)
      if (!Number.isFinite(+sentAt) || +sentAt > Date.now() + 300000) throw new CenterError("INVALID_TIMESTAMP")
      const content = message.type === "text" ? message.text?.body : `[${message.type} attachment received — human review required]`
      if (!content?.trim()) continue
      inbound.push({ channel: "WHATSAPP", externalMessageId: message.id, externalCustomerId, name: (value.contacts?.find(c => c.wa_id === message.from)?.profile?.name || externalCustomerId).slice(0, 160), content, messageType: message.type, mediaId: message.image?.id || message.document?.id, sentAt })
    }
    statuses.push(...(value.statuses || []))
  }
  return { inbound, statuses }
}
export async function persistInbound(input: InboundMessage) {
  const identityId = `${input.channel}:${input.externalCustomerId}`, key = `in:${input.channel}:${input.externalMessageId}`
  if (await CustomerMessage.exists({ idempotencyKey: key })) return
  const session = await mongoose.startSession()
  const complaint = /\b(complaint|shikayat|refund|fraud)\b/i.test(input.content)
  const support = complaint || /\b(not working|offline|camera band|kharab|support|payment issue)\b/i.test(input.content)
  let conversationId = "", reason: string | null = null
  try {
    await session.withTransaction(async () => {
      const identity = await ChannelIdentity.findOneAndUpdate({ _id: identityId }, { $setOnInsert: { channel: input.channel, externalId: input.externalCustomerId, ...(input.channel === "WHATSAPP" ? { phone: input.externalCustomerId } : {}), name: input.name } }, { upsert: true, new: true, session })
      reason = inboundPolicy(input.content)
      if (reason === "OPT_OUT") { identity.optedOut = true; await identity.save({ session }) }
      if (/^(start|resume)$/i.test(input.content.trim())) { identity.optedOut = false; await identity.save({ session }) }
      const conversation = await Conversation.findOneAndUpdate({ identityId }, { $setOnInsert: { channel: input.channel, ...(input.channel === "WHATSAPP" ? { phone: input.externalCustomerId } : {}), customerName: input.name }, $set: { lastMessage: input.content.slice(0, 250), lastMessageAt: new Date(), draft: "" }, $max: { lastInboundAt: input.sentAt }, $inc: { version: 1, unread: 1 } }, { upsert: true, new: true, session })
      conversationId = String(conversation._id)
      if (reason || identity.optedOut || input.messageType !== "text" || conversation.mode === "CLOSED") {
        conversation.mode = identity.optedOut ? "AI_PAUSED" : "HUMAN_REQUIRED"; conversation.handoffReason = reason || (input.messageType !== "text" ? "ATTACHMENT_REVIEW" : "REOPENED"); await conversation.save({ session })
      }
      await CustomerMessage.create([{ conversationId, identityId, channel: input.channel, externalMessageId: input.externalMessageId, idempotencyKey: key, direction: "INBOUND", senderType: "CUSTOMER", content: input.content, messageType: input.messageType, mediaId: input.mediaId, status: "received", sentAt: input.sentAt }], { session })
      if (support && reason !== "OPT_OUT") {
        await Conversation.updateOne({ _id: conversationId }, { $set: { intent: complaint ? "COMPLAINT" : "TECHNICAL_SUPPORT", priority: "SUPPORT" } }, { session })
        await CustomerRequest.findOneAndUpdate({ conversationId, kind: complaint ? "COMPLAINT" : "SUPPORT", state: { $nin: ["COMPLETED", "CANCELLED"] } }, { $setOnInsert: { conversationId, identityId, leadId: identity.leadId, kind: complaint ? "COMPLAINT" : "SUPPORT", requirement: input.content.slice(0, 2000), state: "REQUESTED", createdBy: "SYSTEM", idempotencyKey: `${key}:support` } }, { upsert: true, session })
      }
      await CustomerJob.findOneAndUpdate({ _id: conversationId }, { $set: { state: "PENDING", dueAt: new Date(Date.now() + 1500) }, $inc: { revision: 1 } }, { upsert: true, session })
    })
  } catch (error) { if ((error as { code?: number }).code !== 11000 || !await CustomerMessage.exists({ idempotencyKey: key })) throw error }
  finally { await session.endSession() }
  if (conversationId && (reason || support || input.messageType !== "text")) await centerNotice(conversationId, reason || (support ? "SUPPORT" : "ATTACHMENT"), "Customer conversation needs human attention").catch(() => undefined)
}
export async function acceptWebhook(body: unknown) {
  const { inbound, statuses } = normalizeWebhook(body)
  await connectDB()
  await Promise.all([ChannelIdentity.init(), Conversation.init(), CustomerMessage.init(), CustomerJob.init(), CustomerRequest.init()])
  for (const message of inbound) await persistInbound(message)
  const ranks: Record<string, number> = { sent: 1, delivered: 2, read: 3, failed: 1 }
  for (const item of statuses) await CustomerMessage.updateOne({ externalMessageId: item.id, channel: "WHATSAPP", direction: "OUTBOUND", statusRank: item.status === "failed" ? { $lte: 1 } : { $lt: ranks[item.status] } }, { $set: { status: item.status, statusRank: ranks[item.status], ...(item.timestamp ? { providerAt: new Date(Number(item.timestamp) * 1000) } : {}) } })
  await AIAgentSettings.updateOne({ _id: "primary" }, { $set: { lastWebhookAt: new Date() } }, { upsert: true })
  return { accepted: inbound.length }
}
