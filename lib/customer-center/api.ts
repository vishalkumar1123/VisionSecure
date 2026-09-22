import "server-only"
import { NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/admin-auth"
import User from "@/models/User"
import { AIAgentSettings, AIKnowledgeEntry, ChannelIdentity, Conversation, CustomerJob, CustomerMessage, CustomerRequest } from "@/models/CustomerCenter"
import { boundedBody, CenterError, limitRequest, requiredAI, requiredMeta } from "./security"
import { knowledgeInput, settingsInput } from "./policy"
import { centerAudit } from "./events"
import { getAgentSettings, processJobs } from "./worker"
import { createOrLinkLead, createRequest, findLeadForCustomer } from "./crm"
import { sendReply } from "./dispatch"
import { seedKnowledgeDrafts } from "./knowledge"
import { testIntegration } from "@/lib/integrations/health"
import { serviceWindowOpen } from "@/lib/channels/whatsapp"
const id = z.string().regex(/^[a-f0-9]{24}$/i)
const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "private, no-store" } })
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
export async function customerCenterAPI(request: Request, path: string[]) {
  try {
    const { user, response } = await requireAdmin(); if (response) return response
    const write = request.method !== "GET"
    if (write && request.headers.get("origin") !== new URL(request.url).origin) return json({ error: "INVALID_ORIGIN" }, 403)
    await limitRequest(`admin:${user!.id}:${write ? "write" : "read"}`, write ? 30 : 100)
    let body: unknown = undefined
    if (write) { const raw = await boundedBody(request, 24000); try { body = raw ? JSON.parse(raw) : {} } catch { return json({ error: "INVALID_JSON" }, 400) } }
    const [resource, resourceId, command] = path, query = new URL(request.url).searchParams
    if (resource === "settings") {
      const settings = await getAgentSettings()
      if (write) {
        if (user!.role !== "super_admin") throw new CenterError("SUPER_ADMIN_REQUIRED", 403)
        const parsed = settingsInput.parse(body)
        if (parsed.weekOpen >= parsed.weekClose || parsed.sundayOpen >= parsed.sundayClose) throw new CenterError("INVALID_BUSINESS_HOURS")
        if (parsed.mode === "AUTO" && (requiredAI().length || requiredMeta().length)) throw new CenterError("CONFIGURE_PROVIDERS_BEFORE_AUTO")
        const { revision, ...values } = parsed
        const updated = await AIAgentSettings.findOneAndUpdate({ _id: "primary", revision, $or: [{ autoLease: null }, { autoLeaseUntil: { $lt: new Date() } }] }, { $set: values, $inc: { revision: 1 } }, { new: true })
        if (!updated) throw new CenterError("SETTINGS_CHANGED_OR_SEND_IN_PROGRESS", 409)
        await centerAudit("AI_SETTINGS_CHANGED", undefined, user!.id)
        return json({ saved: true })
      }
      const fields = ["enabled", "mode", "autoCategories", "maxReplyLength", "maxClarifications", "allowAfterHours", "weekOpen", "weekClose", "sundayOpen", "sundayClose", "revision"]
      return json({ settings: Object.fromEntries(fields.map(k => [k, settings[k]])), canManage: user!.role === "super_admin" })
    }
    if (resource === "integrations") {
      if (user!.role !== "super_admin") throw new CenterError("SUPER_ADMIN_REQUIRED", 403)
      if (write) {
        if (!["meta", "ai"].includes(resourceId)) throw new CenterError("NOT_FOUND", 404)
        await limitRequest("integration-health-tests", 4)
        return json(await testIntegration(resourceId as "meta" | "ai", user!.id))
      }
      const s = await getAgentSettings()
      return json({ meta: { missing: requiredMeta(), status: requiredMeta().length ? "Not configured" : s.metaStatus || "Not tested", checkedAt: s.metaCheckedAt, lastWebhookAt: s.lastWebhookAt, lastSendAt: s.lastSendAt }, ai: { missing: requiredAI(), status: requiredAI().length ? "Not configured" : s.aiStatus || "Not tested", checkedAt: s.aiCheckedAt }, canManage: user!.role === "super_admin", webhook: "https://visionsecuretech.in/api/webhooks/whatsapp" })
    }
    if (resource === "knowledge") {
      if (!write) return json({ entries: await AIKnowledgeEntry.find({}).sort({ updatedAt: -1 }).limit(300).lean() })
      if (resourceId === "seed") { const count = await seedKnowledgeDrafts(); await centerAudit("KNOWLEDGE_IMPORTED_AS_DRAFT", undefined, user!.id); return json({ count }) }
      if (resourceId) {
        id.parse(resourceId)
        const parsed = knowledgeInput.extend({ revision: z.number().int().positive() }).parse(body), { revision, ...values } = parsed
        const updated = await AIKnowledgeEntry.findOneAndUpdate({ _id: resourceId, revision }, { $set: values, $inc: { revision: 1 } }, { new: true })
        if (!updated) throw new CenterError("KNOWLEDGE_CHANGED_RELOAD", 409)
      } else await AIKnowledgeEntry.create(knowledgeInput.parse(body))
      await centerAudit("KNOWLEDGE_UPDATED", undefined, user!.id)
      return json({ saved: true })
    }
    if (resource === "customers" && !write) {
      const page = z.coerce.number().int().min(1).max(10000).parse(query.get("page") || 1)
      const [items, total] = await Promise.all([ChannelIdentity.find({}).sort({ updatedAt: -1 }).skip((page - 1) * 30).limit(30).lean(), ChannelIdentity.countDocuments({})])
      return json({ items, total, page })
    }
    if (resource === "requests") {
      if (!write) return json({ items: await CustomerRequest.find({ state: { $nin: ["COMPLETED", "CANCELLED"] } }).sort({ createdAt: -1 }).limit(100).lean() })
      id.parse(resourceId)
      const input = z.object({ state: z.enum(["REQUESTED", "PENDING_CONFIRMATION", "SCHEDULED", "ASSIGNED", "COMPLETED", "CANCELLED"]), dueAt: z.string().datetime().nullable(), assignedTo: id.nullable() }).strict().parse(body)
      if (["SCHEDULED", "ASSIGNED"].includes(input.state) && (!input.dueAt || !input.assignedTo)) throw new CenterError("CONFIRMED_DATE_AND_ASSIGNEE_REQUIRED")
      if (input.assignedTo && !await User.exists({ _id: input.assignedTo, role: { $in: ["admin", "super_admin"] }, isActive: true })) throw new CenterError("INVALID_ASSIGNEE")
      const updated = await CustomerRequest.findByIdAndUpdate(resourceId, { $set: { ...input, ...(["SCHEDULED", "ASSIGNED"].includes(input.state) ? { confirmedAt: new Date() } : {}) } }, { new: true })
      if (!updated) throw new CenterError("REQUEST_NOT_FOUND", 404)
      if (updated.kind === "FOLLOW_UP" && updated.leadId && input.dueAt) { const { default: Lead } = await import("@/models/Lead"); await Lead.updateOne({ _id: updated.leadId }, { $set: { followUpDate: new Date(input.dueAt) } }) }
      await centerAudit("CUSTOMER_REQUEST_UPDATED", String(updated.conversationId), user!.id)
      return json({ saved: true })
    }
    if (resource === "team" && !write) return json({ items: await User.find({ isActive: true, role: { $in: ["admin", "super_admin"] } }).select("_id name role").lean() })
    if (resource === "process" && write) return json(await processJobs(2))
    if (resource === "conversations") {
      if (!resourceId && !write) {
        const page = z.coerce.number().int().min(1).max(10000).parse(query.get("page") || 1), filter = query.get("filter") || "all", search = (query.get("q") || "").slice(0, 80)
        const channel = query.get("channel")
        if (channel && !["WHATSAPP", "INSTAGRAM", "FACEBOOK", "WEBSITE"].includes(channel)) throw new CenterError("INVALID_CHANNEL")
        const where = { ...(channel ? { channel } : {}), ...(filter === "unread" ? { unread: { $gt: 0 } } : filter === "mine" ? { assignedTo: user!.id } : filter === "ai" ? { mode: "AI_ACTIVE" } : filter === "human" ? { mode: "HUMAN_REQUIRED" } : filter === "support" ? { intent: { $in: ["TECHNICAL_SUPPORT", "COMPLAINT"] } } : {}), ...(search ? { $or: [{ customerName: { $regex: escapeRegex(search), $options: "i" } }, { phone: { $regex: escapeRegex(search) } }] } : {}) }
        const [items, total] = await Promise.all([Conversation.find(where).select("customerName phone channel mode unread lastMessage lastMessageAt assignedTo priority").sort({ lastMessageAt: -1, _id: -1 }).skip((page - 1) * 30).limit(30).lean(), Conversation.countDocuments(where)])
        const settings = await getAgentSettings()
        return json({ items, total, page, actorId: user!.id, enabledChannels: !requiredMeta().length && settings.metaStatus === "Verified" && settings.webhookVerifiedAt && settings.lastWebhookAt ? ["WHATSAPP"] : [] })
      }
      id.parse(resourceId)
      const conversation = await Conversation.findById(resourceId).lean()
      if (!conversation) throw new CenterError("CONVERSATION_NOT_FOUND", 404)
      if (!write) {
        if (command === "messages") {
          const before = query.get("before"), after = query.get("after")
          if (before) id.parse(before); if (after) id.parse(after)
          const messages = await CustomerMessage.find({ conversationId: resourceId, ...(before ? { _id: { $lt: before } } : after ? { _id: { $gt: after } } : {}) }).select("direction senderType senderId content messageType status errorCategory createdAt externalMessageId").sort({ _id: after ? 1 : -1 }).limit(50).lean()
          const receipts = after ? await CustomerMessage.find({ conversationId: resourceId, direction: "OUTBOUND" }).select("_id status errorCategory").sort({ _id: -1 }).limit(50).lean() : []
          return json({ items: after ? messages : messages.reverse(), receipts, hasMore: messages.length === 50, conversation: { mode: conversation.mode, version: conversation.version, draft: conversation.draft, summary: conversation.summary, draftVersion: conversation.draftVersion, assignedTo: conversation.assignedTo } })
        }
        let lead = null, matchingError: string | null = null
        try { lead = await findLeadForCustomer(conversation.identityId) } catch (e) { matchingError = e instanceof CenterError ? e.code : "LEAD_CONTEXT_UNAVAILABLE" }
        const identity = await ChannelIdentity.findById(conversation.identityId).select("name phone optedOut").lean()
        return json({ conversation, identity, lead, matchingError, requests: await CustomerRequest.find({ conversationId: resourceId }).sort({ createdAt: -1 }).limit(20).lean(), serviceWindowOpen: serviceWindowOpen(conversation.lastInboundAt), actorId: user!.id })
      }
      if (command === "read") { await Conversation.updateOne({ _id: resourceId, version: conversation.version }, { $set: { unread: 0 } }); return json({ saved: true }) }
      if (command === "mode") {
        const input = z.object({ mode: z.enum(["HUMAN_ACTIVE", "AI_ACTIVE", "AI_PAUSED", "CLOSED"]), version: z.number().int() }).strict().parse(body)
        const updated = await Conversation.findOneAndUpdate({ _id: resourceId, version: input.version, sendLock: null }, { $set: { mode: input.mode, draft: "", handoffReason: "", ...(input.mode === "HUMAN_ACTIVE" ? { assignedTo: user!.id } : {}), ...(input.mode === "AI_ACTIVE" ? { clarificationTurns: 0 } : {}) }, $inc: { version: 1 } }, { new: true })
        if (!updated) throw new CenterError("SEND_IN_PROGRESS_OR_CONVERSATION_CHANGED", 409)
        if (input.mode === "AI_ACTIVE") await CustomerJob.findOneAndUpdate({ _id: resourceId }, { $set: { state: "PENDING", dueAt: new Date() }, $inc: { revision: 1 } }, { upsert: true })
        await centerAudit(`MODE_${input.mode}`, resourceId, user!.id); return json({ saved: true })
      }
      if (command === "assign") {
        const input = z.object({ assignedTo: id, version: z.number().int() }).strict().parse(body)
        if (!await User.exists({ _id: input.assignedTo, role: { $in: ["admin", "super_admin"] }, isActive: true })) throw new CenterError("INVALID_ASSIGNEE")
        const result = await Conversation.updateOne({ _id: resourceId, version: input.version, sendLock: null }, { $set: { assignedTo: input.assignedTo, mode: "HUMAN_ACTIVE", draft: "" }, $inc: { version: 1 } })
        if (!result.modifiedCount) throw new CenterError("CONVERSATION_CHANGED_RELOAD", 409)
        await centerAudit("CONVERSATION_ASSIGNED", resourceId, user!.id); return json({ saved: true })
      }
      if (command === "reply") {
        const input = z.object({ content: z.string().trim().min(1).max(4096), version: z.number().int(), key: z.string().uuid() }).strict().parse(body)
        return json(await sendReply({ conversationId: resourceId, ...input, sender: "ADMIN", actorId: user!.id }))
      }
      if (command === "lead") return json({ lead: await createOrLinkLead(resourceId, user!.id) })
      if (command === "request") {
        const input = z.object({ kind: z.enum(["SITE_VISIT", "SUPPORT", "COMPLAINT", "FOLLOW_UP"]), requirement: z.string().trim().min(3).max(2000), location: z.string().max(300), preferredWhen: z.string().max(200), key: z.string().uuid() }).strict().parse(body)
        return json({ request: await createRequest(resourceId, input, input.key, user!.id) })
      }
      if (command === "draft") { const settings = await getAgentSettings(); if (!settings.enabled || settings.mode === "HUMAN_ONLY") throw new CenterError("ENABLE_AI_DRAFTS_IN_AI_AGENT_SETTINGS", 409); if (requiredAI().length) throw new CenterError("OPENAI_NOT_CONFIGURED", 503); if (conversation.mode !== "AI_ACTIVE") throw new CenterError("RETURN_CONVERSATION_TO_AI_FIRST", 409); await CustomerJob.findOneAndUpdate({ _id: resourceId }, { $set: { state: "PENDING", dueAt: new Date() }, $inc: { revision: 1 } }, { upsert: true }); return json(await processJobs(1, resourceId)) }
    }
    return json({ error: "NOT_FOUND" }, 404)
  } catch (error) { return json({ error: error instanceof CenterError ? error.code : error instanceof z.ZodError ? "INVALID_INPUT" : "CUSTOMER_CENTER_UNAVAILABLE" }, error instanceof CenterError ? error.status : error instanceof z.ZodError ? 400 : 503) }
}
