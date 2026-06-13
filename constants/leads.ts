/**
 * Lead status, priority, and source constants
 */

export const LEAD_STATUSES = [
  'New',
  'In Discussion',
  'Follow-Up',
  'Quotation Sent',
  'Installation Scheduled',
  'Converted',
  'Closed',
] as const

export const LEAD_PRIORITIES = [
  'Low',
  'Medium',
  'High',
  'Urgent',
] as const

export const LEAD_SOURCES = [
  'Website',
  'WhatsApp',
  'Facebook',
  'Instagram',
  'Google Ads',
  'Call',
  'Reference',
  'Manual',
] as const

export const LEAD_STATUS_COLORS: Record<string, string> = {
  'New': 'bg-blue-100 text-blue-800',
  'In Discussion': 'bg-yellow-100 text-yellow-800',
  'Follow-Up': 'bg-purple-100 text-purple-800',
  'Quotation Sent': 'bg-orange-100 text-orange-800',
  'Installation Scheduled': 'bg-cyan-100 text-cyan-800',
  'Converted': 'bg-green-100 text-green-800',
  'Closed': 'bg-gray-100 text-gray-800',
}

export const PRIORITY_COLORS: Record<string, string> = {
  'Low': 'bg-green-100 text-green-800',
  'Medium': 'bg-yellow-100 text-yellow-800',
  'High': 'bg-orange-100 text-orange-800',
  'Urgent': 'bg-red-100 text-red-800',
}

export const SOURCE_COLORS: Record<string, string> = {
  'Website': 'bg-blue-100 text-blue-800',
  'WhatsApp': 'bg-green-100 text-green-800',
  'Facebook': 'bg-indigo-100 text-indigo-800',
  'Instagram': 'bg-pink-100 text-pink-800',
  'Google Ads': 'bg-red-100 text-red-800',
  'Call': 'bg-purple-100 text-purple-800',
  'Reference': 'bg-cyan-100 text-cyan-800',
  'Manual': 'bg-gray-100 text-gray-800',
}
