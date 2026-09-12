import type { NotificationLeadPayload } from "@/notification/types/notification.types"
import { escapeHtml } from "@/notification/utils/sanitize"

const value = (input: unknown) => typeof input === "string" ? input.trim() : input ? String(input) : ""

export function newLeadEmailTemplate(leadId: string, lead: NotificationLeadPayload) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "https://visionsecuretech.in").replace(/\/$/, "")
  const dashboardUrl = `${siteUrl}/admin/leads/${encodeURIComponent(leadId)}`
  const code = `VS-${leadId.slice(-6).toUpperCase()}`
  const createdAt = lead.createdAt ? new Date(lead.createdAt) : new Date()
  const date = new Intl.DateTimeFormat("en-IN", { dateStyle: "long", timeZone: "Asia/Kolkata" }).format(createdAt)
  const time = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata", timeZoneName: "short" }).format(createdAt)
  const availableFields: Array<[string, unknown]> = [
    ["Lead ID", code], ["Customer Name", lead.name], ["Mobile", lead.phone], ["Email", lead.email],
    ["Service Required", lead.service], ["Lead Source", lead.source], ["Location", lead.location],
    ["Address", lead.address], ["Customer Requirement", lead.requirement], ["Status", lead.status],
    ["Submitted On", date], ["Submitted At", time],
  ]
  const fields = availableFields.filter(([, fieldValue]) => value(fieldValue))
  const rows = fields.map(([label, fieldValue]) => `<tr><td style="padding:11px 14px;border-bottom:1px solid #e5e7eb;color:#475569;font-size:13px;font-weight:700;vertical-align:top;width:34%">${escapeHtml(label)}</td><td style="padding:11px 14px;border-bottom:1px solid #e5e7eb;color:#0f172a;font-size:14px;line-height:1.5;vertical-align:top">${escapeHtml(value(fieldValue))}</td></tr>`).join("")
  const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#eef2f6;font-family:Arial,Helvetica,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td style="padding:28px 12px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:auto;background:#fff;border:1px solid #dbe4ee;border-radius:12px;overflow:hidden"><tr><td style="padding:26px 28px;background:#071d35;color:#fff"><div style="font-size:20px;font-weight:800;letter-spacing:.4px">VISIONSECURE SMART TECHNOLOGIES</div><div style="margin-top:8px;color:#bae6fd;font-size:13px">Secure Today. Safe Tomorrow.</div></td></tr><tr><td style="padding:28px"><div style="display:inline-block;padding:7px 11px;background:#dc2626;color:#fff;border-radius:5px;font-size:12px;font-weight:800;letter-spacing:.8px">NEW LEAD RECEIVED</div><h1 style="margin:18px 0 8px;color:#0f172a;font-size:24px">A new customer requirement has arrived</h1><p style="margin:0 0 22px;color:#475569;font-size:15px;line-height:1.6">A customer submitted an inquiry from the VisionSecure website. Please review the details and follow up promptly.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">${rows}</table><div style="margin-top:24px;padding:16px;background:#f8fafc;border-left:4px solid #0284c7;color:#334155;font-size:14px;line-height:1.6"><strong>ACTION REQUIRED</strong><br>Please contact the customer and update the lead status in the admin dashboard.</div><div style="margin-top:24px;text-align:center"><a href="${escapeHtml(dashboardUrl)}" style="display:inline-block;padding:13px 22px;background:#0369a1;color:#fff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:800">View Lead in Admin Dashboard</a></div></td></tr><tr><td style="padding:19px 28px;background:#f8fafc;border-top:1px solid #e5e7eb;text-align:center;color:#64748b;font-size:12px">VisionSecure Smart Technologies · Secure Today. Safe Tomorrow.</td></tr></table></td></tr></table></body></html>`
  const text = ["NEW LEAD RECEIVED - VisionSecure Smart Technologies", "", ...fields.map(([label, fieldValue]) => `${label}: ${value(fieldValue)}`), "", "ACTION REQUIRED", "Please contact the customer and update the lead status in the admin dashboard.", "", `Admin Dashboard: ${dashboardUrl}`].join("\n")
  return { subject: `New Lead Received | VisionSecure | ${code}`, html, text }
}
