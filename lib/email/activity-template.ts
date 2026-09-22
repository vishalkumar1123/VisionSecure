import { brandEmail, adminEmailUrl } from "./brand-template"
type ActivityMail = { action: string; resourceType?: string; resourceId?: string; changes?: Record<string, unknown> }
export function activityEmail(data: ActivityMail) {
  const lead = data.resourceType === "Lead", changed = data.action === "LEAD_STATUS_CHANGED"
  const title = changed ? "Lead status updated" : data.action.replaceAll("_", " ").toLowerCase().replace(/^./, c => c.toUpperCase())
  const info = data.changes || {}
  // Explicit allowlist; arbitrary activity changes never enter email.
  const fields: [string, unknown][] = [["Reference", data.resourceId ? `${lead ? "VS" : "REF"}-${data.resourceId.slice(-6).toUpperCase()}` : undefined]]
  if (lead) fields.push(["Customer", info.customerName], ["Service", info.service], ["Previous status", info.previousStatus], ["New status", info.newStatus], ["Updated by", info.actorName])
  fields.push(["Updated", new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date()) + " IST"])
  return { subject: `${title} | VisionSecure`, ...brandEmail({ label: changed ? "CRM PROGRESS UPDATE" : "ADMIN NOTIFICATION", title, intro: changed ? "Your team has updated a lead’s progress. The latest status and next action are available in the CRM." : "A business account activity has been recorded. Review the details securely in your admin dashboard.", fields, action: lead ? "View Lead Timeline" : "Review Activity", href: adminEmailUrl(lead && data.resourceId ? `/admin/leads/${encodeURIComponent(data.resourceId)}` : "/admin/activity-logs"), nextStep: changed ? "Review the updated stage, coordinate with the assigned team member and confirm the next follow-up." : "Open the activity log to review the recorded change." }) }
}
