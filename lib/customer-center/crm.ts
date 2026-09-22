import "server-only"
import Lead from "@/models/Lead"
import { ChannelIdentity, Conversation, CustomerMessage, CustomerRequest } from "@/models/CustomerCenter"
import { CenterError } from "./security"
import { centerAudit, centerNotice } from "./events"
import { NotificationService } from "@/notification/services/notification.service"

export async function findLeadForCustomer(identityId: string) {
  const identity = await ChannelIdentity.findById(identityId).lean()
  if (!identity) throw new CenterError("CUSTOMER_NOT_FOUND", 404)
  if (identity.leadId) return Lead.findById(identity.leadId).select("name service status priority followUpDate customerCenterIdentity").lean()
  const phone = String(identity.phone), local = phone.startsWith("91") && phone.length === 12 ? phone.slice(2) : phone
  const candidates = await Lead.find({ $or: [{ customerCenterIdentity: identityId }, { phone: { $in: [phone, `+${phone}`, local] } }] }).select("_id name service status priority followUpDate customerCenterIdentity").limit(3).lean()
  if (candidates.length > 1) throw new CenterError("AMBIGUOUS_LEAD_MATCH", 409)
  if (candidates.length === 1) { await ChannelIdentity.updateOne({ _id: identityId, leadId: { $exists: false } }, { $set: { leadId: candidates[0]._id } }); await Conversation.updateOne({ identityId }, { $set: { leadId: candidates[0]._id } }); return candidates[0] }
  return null
}
export async function createOrLinkLead(conversationId: string, actorId?: string) {
  const conversation = await Conversation.findById(conversationId).lean()
  if (!conversation) throw new CenterError("CONVERSATION_NOT_FOUND", 404)
  const existing = await findLeadForCustomer(conversation.identityId)
  if (existing) return existing
  const identity = await ChannelIdentity.findById(conversation.identityId).lean()
  if (identity?.optedOut) throw new CenterError("CUSTOMER_OPTED_OUT", 409)
  const recent = await CustomerMessage.find({ conversationId, direction: "INBOUND", messageType: "text" }).sort({ createdAt: -1 }).limit(4).select("content").lean()
  const requirement = recent.reverse().map(m => m.content).join("\n").slice(0, 2000)
  if (!requirement.trim()) throw new CenterError("REQUIREMENT_MISSING")
  let lead
  await Lead.init()
  try { lead = await Lead.create({ customerCenterIdentity: conversation.identityId, name: identity?.name || conversation.phone, phone: conversation.phone, source: "WhatsApp", message: requirement, status: "New", priority: "Medium" }) }
  catch (error) { if ((error as { code?: number }).code !== 11000) throw error; lead = await Lead.findOne({ customerCenterIdentity: conversation.identityId }) }
  await ChannelIdentity.updateOne({ _id: conversation.identityId }, { $set: { leadId: lead._id } })
  await Conversation.updateOne({ _id: conversationId }, { $set: { leadId: lead._id, priority: "MEDIUM" } })
  await centerAudit("LEAD_LINKED", conversationId, actorId)
  await NotificationService.notifyNewLead(String(lead._id), { name: lead.name, phone: lead.phone, requirement: lead.message, source: "WhatsApp", status: lead.status, createdAt: lead.createdAt }).catch(() => undefined)
  return lead
}
export async function createRequest(conversationId: string, input: { kind: "SITE_VISIT" | "SUPPORT" | "COMPLAINT" | "FOLLOW_UP"; requirement: string; location?: string; preferredWhen?: string }, key: string, actorId?: string) {
  const conversation = await Conversation.findById(conversationId).lean()
  if (!conversation) throw new CenterError("CONVERSATION_NOT_FOUND", 404)
  const request = await CustomerRequest.findOneAndUpdate({ idempotencyKey: `${conversationId}:${key}` }, { $setOnInsert: { conversationId, identityId: conversation.identityId, leadId: conversation.leadId, ...input, state: input.kind === "SITE_VISIT" ? "PENDING_CONFIRMATION" : "REQUESTED", createdBy: actorId || "AI" } }, { upsert: true, new: true })
  await centerAudit(`${input.kind}_REQUESTED`, conversationId, actorId)
  await centerNotice(conversationId, `request:${request._id}`, input.kind === "SITE_VISIT" ? "Site visit request awaits confirmation" : "Customer support or follow-up requested")
  return request
}
