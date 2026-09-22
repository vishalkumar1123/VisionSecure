import "server-only"
import { randomUUID } from "node:crypto"
import { AIAgentSettings, AIKnowledgeEntry, ChannelIdentity, Conversation, CustomerMessage } from "@/models/CustomerCenter"
import { sendWhatsApp, serviceWindowOpen } from "@/lib/channels/whatsapp"
import { CenterError } from "./security"
import { workingNow } from "./policy"
import { centerAudit, centerNotice } from "./events"

export async function withConversationLock<T>(id: string, version: number, mode: string | undefined, fn: (conversation: Record<string, any>) => Promise<T>) {
  const token = randomUUID()
  const conversation = await Conversation.findOneAndUpdate({ _id: id, version, sendLock: null, ...(mode ? { mode } : {}) }, { $set: { sendLock: token, sendUntil: new Date(Date.now() + 90000) } }, { new: true }).lean()
  if (!conversation) throw new CenterError("CONVERSATION_CHANGED_RELOAD", 409)
  try { return await fn(conversation) } finally { await Conversation.updateOne({ _id: id, sendLock: token }, { $set: { sendLock: null, sendUntil: null } }) }
}
export async function sendReply(input: { conversationId: string; version: number; content: string; key: string; sender: "AI" | "ADMIN"; actorId?: string; knowledgeId?: string; knowledgeRevision?: number; usage?: number }) {
  let autoLease: string | undefined
  let activeSettings: Record<string, any> | undefined
  if (input.sender === "AI") {
    autoLease = randomUUID()
    const settings = await AIAgentSettings.findOneAndUpdate({ _id: "primary", enabled: true, mode: "AUTO", $or: [{ autoLease: null }, { autoLeaseUntil: { $lt: new Date() } }] }, { $set: { autoLease, autoLeaseUntil: new Date(Date.now() + 90000) } }, { new: true }).lean()
    if (!settings) throw new CenterError("AUTO_DISABLED_OR_BUSY", 409)
    activeSettings = settings
  }
  try {
    return await withConversationLock(input.conversationId, input.version, input.sender === "AI" ? "AI_ACTIVE" : "HUMAN_ACTIVE", async conversation => {
      if (conversation.channel !== "WHATSAPP") throw new CenterError("CHANNEL_NOT_CONNECTED", 409)
      if (input.sender === "ADMIN" && String(conversation.assignedTo) !== input.actorId) throw new CenterError("TAKE_OVER_TO_REPLY", 409)
      const identity = await ChannelIdentity.findById(conversation.identityId).lean()
      if (identity?.optedOut) throw new CenterError("CUSTOMER_OPTED_OUT", 409)
      if (!serviceWindowOpen(conversation.lastInboundAt)) throw new CenterError("APPROVED_TEMPLATE_REQUIRED", 409)
      if (input.sender === "AI") {
        const knowledge = await AIKnowledgeEntry.findOne({ _id: input.knowledgeId, state: "PUBLISHED", revision: input.knowledgeRevision }).lean()
        if (!knowledge || ![knowledge.replyEnglish, knowledge.replyHinglish].includes(input.content)) throw new CenterError("APPROVED_REPLY_CHANGED", 409)
        if (!activeSettings?.autoCategories?.includes(knowledge.category) || ["PRICING", "DO_NOT_SAY"].includes(knowledge.category) || input.content.length > activeSettings.maxReplyLength || (!activeSettings.allowAfterHours && !workingNow(activeSettings as Parameters<typeof workingNow>[0]))) throw new CenterError("AUTO_POLICY_CHANGED", 409)
      }
      const key = `${input.conversationId}:${input.sender}:${input.key}`
      const prior = await CustomerMessage.findOne({ idempotencyKey: key }).lean()
      if (prior) return { status: prior.status, id: String(prior._id) }
      const message = await CustomerMessage.create({ conversationId: input.conversationId, identityId: conversation.identityId, idempotencyKey: key, channel: "WHATSAPP", direction: "OUTBOUND", senderType: input.sender, senderId: input.actorId, content: input.content, status: "sending", tokenUsage: input.usage || 0 })
      try {
        // Recheck after persisting the outbox: another inbound message may have changed the context.
        if (!await Conversation.exists({ _id: input.conversationId, version: input.version, sendLock: conversation.sendLock })) { message.status = "cancelled"; await message.save(); throw new CenterError("CONVERSATION_CHANGED_RELOAD", 409) }
        const externalMessageId = await sendWhatsApp(conversation.phone, input.content, conversation.lastInboundAt)
        await CustomerMessage.updateOne({ _id: message._id }, { $set: { externalMessageId, status: "sent", statusRank: 1, sentAt: new Date() } })
        await Conversation.updateOne({ _id: input.conversationId, version: input.version }, { $set: { lastMessage: input.content.slice(0, 250), lastMessageAt: new Date(), draft: "" } })
        await AIAgentSettings.updateOne({ _id: "primary" }, { $set: { lastSendAt: new Date() } })
        await centerAudit(input.sender === "AI" ? "AI_REPLY_SENT" : "HUMAN_REPLY_SENT", input.conversationId, input.actorId)
        return { status: "sent", id: String(message._id) }
      } catch (error) {
        if (error instanceof CenterError && error.code === "CONVERSATION_CHANGED_RELOAD") throw error
        const category = error instanceof CenterError ? error.code : "SEND_UNCERTAIN"
        await CustomerMessage.updateOne({ _id: message._id, status: "sending" }, { $set: { status: category === "META_SEND_REJECTED" || category === "META_RATE_LIMIT" ? "failed" : "uncertain", errorCategory: category } })
        await Conversation.updateOne({ _id: input.conversationId }, { $set: { mode: "HUMAN_REQUIRED", handoffReason: category } })
        await centerNotice(input.conversationId, `send:${message._id}`, "Message delivery needs review")
        throw new CenterError(category, 503)
      }
    })
  } finally { if (autoLease) await AIAgentSettings.updateOne({ _id: "primary", autoLease }, { $set: { autoLease: null, autoLeaseUntil: null } }) }
}
