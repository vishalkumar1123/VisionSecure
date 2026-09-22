import type { NotificationLeadPayload } from "@/notification/types/notification.types"
import { brandEmail, adminEmailUrl } from "@/lib/email/brand-template"
export function newLeadEmailTemplate(leadId: string, lead: NotificationLeadPayload) {
  const code = `VS-${leadId.slice(-6).toUpperCase()}`
  const date = lead.createdAt ? new Date(lead.createdAt) : new Date()
  const received = Number.isFinite(+date) ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(date) + " IST" : undefined
  return { subject: `New lead received | ${code} | VisionSecure`, ...brandEmail({ label: "NEW LEAD RECEIVED", title: "A new opportunity to help.", intro: "A customer requirement has been added to your CRM. Review the enquiry and help the customer choose the right solution.",
    fields: [["Lead reference", code], ["Customer", lead.name], ["Mobile", lead.phone], ["Email", lead.email], ["Service", lead.service], ["Source", lead.source], ["Location", lead.location], ["Address", lead.address], ["Requirement", lead.requirement], ["Priority", lead.priority], ["Current status", lead.status], ["Received", received]],
    action: "Open Lead & Follow Up", href: adminEmailUrl(`/admin/leads/${encodeURIComponent(leadId)}`), nextStep: "Contact the customer, understand the requirement and record the next follow-up in the lead timeline." }) }
}
