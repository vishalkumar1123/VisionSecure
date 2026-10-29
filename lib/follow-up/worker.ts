import "server-only"
import Lead from "@/models/Lead"
import Configuration from "@/models/EmailConfiguration"
import Delivery from "@/models/EmailDeliveryLog"
import { connectDB } from "@/lib/mongodb"
import { businessDay, BUSINESS_TIMEZONE, CLOSED_STATUSES } from "@/lib/dashboard-time"
import { brandEmail, adminEmailUrl } from "@/lib/email/brand-template"
import { queueEmail, processPendingEmails } from "@/lib/email-config/delivery"
import { emailEventEnabled } from "@/lib/email-config/shared"

const projection = { name: 1, phone: 1, address: 1, service: 1, message: 1, status: 1, followUpDate: 1, assignedTo: 1, notes: { $slice: -1 } }
const when = (date: Date | string) => new Date(date).toLocaleString("en-IN", { timeZone: BUSINESS_TIMEZONE, dateStyle: "medium", timeStyle: "short" }) + " IST"
const fields = (lead: any): [string, unknown][] => [["Customer", lead.name], ["Phone", lead.phone], ["Full Address", lead.address || "Not provided"], ["Service", lead.service], ["Requirement", lead.message], ["Status", lead.status], ["Assigned to", lead.assignedTo?.name || "Unassigned"], ["Follow-up time", when(lead.followUpDate)], ["Latest note / next action", lead.notes?.at(-1)?.text || "No follow-up note saved. Review the lead before calling."]]

/** Runs only through an authenticated external scheduler; no browser timer is needed. */
export async function processFollowUps(now = new Date()) {
 await connectDB()
 const config = await Configuration.findById("primary").lean()
 if (!config?.isVerified || config.status !== "ACTIVE" || !emailEventEnabled(config.eventSettings, "followUpReminder")) return { state: "EMAIL_INACTIVE_OR_EVENT_DISABLED", reminders: 0 }
 await processPendingEmails()
 const { start, end, key } = businessDay(now)
 const active = { status: { $nin: CLOSED_STATUSES } }
 let summary = false, reminders = 0, errors = 0
 const hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: BUSINESS_TIMEZONE, hour: "2-digit", hourCycle: "h23" }).format(now))
 const summaryKey = `follow-up-plan:${key}`
 if (hour >= 8 && !await Delivery.exists({ eventKey: summaryKey })) {
  const today = { ...active, followUpDate: { $gte: start, $lt: end } }
  const [leads, total] = await Promise.all([Lead.find(today).sort({ followUpDate: 1, _id: 1 }).limit(50).select(projection).populate("assignedTo", "name").lean(), Lead.countDocuments(today)])
  const template = brandEmail({ label: "TODAY'S FOLLOW-UP PLAN", title: `Follow-up plan for ${key}`, intro: `${total} appointments today (IST). Showing ${leads.length}; open the dashboard for the full and latest schedule. Prepared ${when(now)}.`, fields: leads.map((lead: any) => [lead.name, fields(lead).map(([label, value]) => `${label}: ${value ?? ""}`).join("\n")] as [string, unknown]), action: "Open today's call schedule", href: adminEmailUrl("/admin/dashboard"), nextStep: "Call customers at their saved times, review the latest note, record the outcome and reschedule if needed. Overdue and undated follow-ups are available on the dashboard." })
  const result = await queueEmail({ eventKey: summaryKey, eventType: "followUpReminder", entityId: key, subject: `Today's follow-up plan | ${key} | VisionSecure`, ...template })
  summary = !!result && result.status !== "skipped"
 }
 const due = await Lead.find({ ...active, followUpDate: { $gte: start, $lte: now }, $expr: { $ne: [{ $ifNull: ["$followUpReminderFor", null] }, "$followUpDate"] } }).sort({ followUpDate: 1, _id: 1 }).limit(5).select(projection).populate("assignedTo", "name").lean()
 for (const candidate of due) {
  try {
   const lead = await Lead.findOne({ _id: candidate._id, ...active, followUpDate: candidate.followUpDate }).select(projection).populate("assignedTo", "name").lean()
   if (!lead) continue
   const date = new Date(lead.followUpDate).toISOString()
   const template = brandEmail({ label: "FOLLOW-UP DUE", title: "A customer follow-up is due.", intro: "Review the customer's saved requirement and latest note before calling.", fields: fields(lead), action: "Review lead and call", href: adminEmailUrl(`/admin/leads/${encodeURIComponent(String(lead._id))}#follow-up`), nextStep: "Call the customer, save the call outcome and set the next follow-up date/time when needed." })
   const result = await queueEmail({ eventKey: `follow-up-due:${lead._id}:${date}`, eventType: "followUpReminder", entityId: String(lead._id), subject: `Follow-up due | ${when(lead.followUpDate)} | VisionSecure`, ...template })
   if (result && result.status !== "skipped") {
    await Lead.updateOne({ _id: lead._id, followUpDate: lead.followUpDate }, { $set: { followUpReminderFor: lead.followUpDate } }, { timestamps: false })
    reminders++
   }
  } catch { errors++ }
 }
 return { state: "PROCESSED", summary, reminders, errors, batchLimit: 5 }
}
