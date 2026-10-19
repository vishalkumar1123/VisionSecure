import { services } from "./services"
export const enquiryServices = [...new Set([...services.map(service => service.title), "Fire Alarm Systems", "EPABX Systems", "Video Intercom", "Attendance Systems", "Smart Security", "Other"])]
export function resolveEnquiryService(value: string | null): string {
  if (!value) return ""
  const matched = services.find(service => service.slug === value || service.title === value)
  if (matched) return matched.title
  const aliases: Record<string, string> = { "Biometric Systems": "Biometric Attendance", "Access Control": "Access Control System", "Access Control Systems": "Access Control System", "Video Door Phones": "Video Door Phone", "AMC / Maintenance": "IT Support & AMC", "PA Systems": "Speaker Solutions", "Smart Locks": "Smart Door Locks" }
  return aliases[value] || (enquiryServices.includes(value) ? value : "")
}
