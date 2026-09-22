import "server-only"
import { randomUUID } from "node:crypto"
import { connectDB } from "@/lib/mongodb"
import { AIAgentSettings, Conversation, CustomerJob, CustomerMessage } from "@/models/CustomerCenter"
import { generateDraft } from "./agent"
import { createOrLinkLead, createRequest } from "./crm"
import { CenterError } from "./security"
import { centerAudit, centerNotice } from "./events"
import { isHinglish, workingNow } from "./policy"
import { sendReply, withConversationLock } from "./dispatch"

export async function getAgentSettings() { return AIAgentSettings.findOneAndUpdate({ _id: "primary" }, { $setOnInsert: { mode: "DRAFT", enabled: false } }, { upsert: true, new: true }).lean() }
async function handoff(id: string, version: number, reason: string) {
  const result = await Conversation.updateOne({ _id: id, version, mode: "AI_ACTIVE", sendLock: null }, { $set: { mode: "HUMAN_REQUIRED", handoffReason: reason } })
  if (result.modifiedCount) { await centerAudit(`HANDOFF:${reason}`, id); await centerNotice(id, reason, "AI conversation needs human attention") }
}
async function processConversation(id: string) {
  const settings = await getAgentSettings(), conversation = await Conversation.findById(id).lean()
  if (!conversation || conversation.mode !== "AI_ACTIVE" || !settings.enabled || settings.mode === "HUMAN_ONLY") return
  const version = conversation.version
  try {
    const { decision, knowledge, latest, inbound, usage } = await generateDraft(conversation, settings)
    const entry = knowledge.find(k => String(k._id) === decision.knowledgeId)
    const sensitive = /₹|\b(rs\.?|inr|warranty|guarantee|authorized|certified|discount|megapixel|fps|stock)\b/i.test(decision.reply)
    const exact = entry && [entry.replyEnglish, entry.replyHinglish].includes(decision.reply)
    if (sensitive && !exact) { await handoff(id, version, "UNVERIFIED_BUSINESS_CLAIM"); return }
    const saved = await Conversation.updateOne({ _id: id, version, mode: "AI_ACTIVE", sendLock: null }, { $set: { draft: decision.reply, draftVersion: version, summary: decision.summary, summaryVersion: version, intent: decision.intent, knowledgeIds: entry ? [String(entry._id)] : [], suggestedAction: decision.action }, ...(decision.reply.includes("?") ? { $inc: { clarificationTurns: 1 } } : {}) })
    if (!saved.modifiedCount) return
    if (decision.needsHuman || decision.action === "HANDOFF" || conversation.clarificationTurns >= settings.maxClarifications) { await handoff(id, version, decision.reason || "HUMAN_REVIEW"); return }
    if (settings.mode !== "AUTO") return
    if (!settings.allowAfterHours && !workingNow(settings)) return
    if (decision.action !== "NONE") {
      const visit = decision.action === "SITE_VISIT" && /visit|site|aana|aao|timing|inspection/i.test(latest)
      const support = decision.action === "SUPPORT" && /not working|offline|problem|band|kharab|issue|support|complaint/i.test(latest)
      const lead = decision.action === "CREATE_LEAD" && /install|lagwa|lgwa|chahiye|need|require|setup/i.test(inbound) && !/complaint|refund|payment/i.test(inbound)
      if (!visit && !support && !lead) { await handoff(id, version, "ACTION_REVIEW_REQUIRED"); return }
      const toolLease = randomUUID()
      const authorized = await AIAgentSettings.findOneAndUpdate({ _id: "primary", enabled: true, mode: "AUTO", revision: settings.revision, $or: [{ autoLease: null }, { autoLeaseUntil: { $lt: new Date() } }] }, { $set: { autoLease: toolLease, autoLeaseUntil: new Date(Date.now() + 90000) } })
      if (!authorized) throw new CenterError("AUTO_DISABLED_OR_BUSY", 409)
      try { await withConversationLock(id, version, "AI_ACTIVE", async () => {
        if (lead) await createOrLinkLead(id)
        if (visit || support) await createRequest(id, { kind: visit ? "SITE_VISIT" : "SUPPORT", requirement: latest.slice(0, 2000) }, `ai:${version}`)
        await Conversation.updateOne({ _id: id, version }, { $set: { mode: "HUMAN_REQUIRED", handoffReason: "CRM_ACTION_REVIEW" } })
      }) } finally { await AIAgentSettings.updateOne({ _id: "primary", autoLease: toolLease }, { $set: { autoLease: null, autoLeaseUntil: null } }) }
      await centerNotice(id, `action:${version}`, "Customer request is ready for team review")
      return
    }
    const approvedReply = isHinglish(latest) ? entry?.replyHinglish : entry?.replyEnglish
    if (!entry || !approvedReply || !settings.autoCategories.includes(entry.category) || entry.category === "PRICING" || entry.category === "DO_NOT_SAY" || approvedReply.length > settings.maxReplyLength) { await handoff(id, version, "NO_APPROVED_AUTO_REPLY"); return }
    await sendReply({ conversationId: id, version, content: approvedReply, key: `reply:${version}`, sender: "AI", knowledgeId: String(entry._id), knowledgeRevision: entry.revision, usage })
  } catch (error) {
    if (error instanceof CenterError && error.code === "CONVERSATION_CHANGED_RELOAD") return
    await handoff(id, version, error instanceof CenterError ? error.code : "AI_PROVIDER_UNAVAILABLE")
  }
}
export async function processJobs(max = 2, conversationId?: string) {
  await connectDB()
  // Expired sends are uncertain, never automatically re-sent.
  const stale = await Conversation.find({ sendLock: { $ne: null }, sendUntil: { $lt: new Date() } }).select("_id").limit(20).lean()
  for (const item of stale) {
    await CustomerMessage.updateMany({ conversationId: item._id, status: "sending" }, { $set: { status: "uncertain", errorCategory: "WORKER_INTERRUPTED" } })
    await Conversation.updateOne({ _id: item._id, sendUntil: { $lt: new Date() } }, { $set: { sendLock: null, sendUntil: null, mode: "HUMAN_REQUIRED", handoffReason: "SEND_UNCERTAIN" } })
  }
  let count = 0
  for (let i = 0; i < max; i++) {
    const lease = randomUUID()
    const job = await CustomerJob.findOneAndUpdate({ ...(conversationId ? { _id: conversationId } : {}), state: "PENDING", dueAt: { $lte: new Date() }, $or: [{ leaseUntil: null }, { leaseUntil: { $lt: new Date() } }] }, { $set: { lease, leaseUntil: new Date(Date.now() + 90000) } }, { sort: { dueAt: 1 }, new: true }).lean()
    if (!job) break
    try { await processConversation(job._id); await CustomerJob.updateOne({ _id: job._id, lease, revision: job.revision }, { $set: { state: "DONE" } }); count++ }
    finally { await CustomerJob.updateOne({ _id: job._id, lease }, { $set: { lease: null, leaseUntil: null } }) }
  }
  return { processed: count }
}
