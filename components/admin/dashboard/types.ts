export type DashboardLead = { _id: string; name: string; phone: string; service?: string; source?: string; status: string; priority?: string; assignedTo?: { name: string } | null; followUpDate?: string | null; createdAt: string }
export type DashboardData = {
  displayName: string; updatedAt: string; timezone: string; days: number; errors: string[]
  metrics: null | { total: number; converted: number; active: number; today: number; yesterday: number; due: number; overdue: number; attention: number; new: number; quotations: number; installations: number; conversionRate: number; pipeline: { _id: string; total: number }[]; services: { _id: string; total: number }[] }
  leads: DashboardLead[] | null; schedule: DashboardLead[] | null
  trend: null | { rows: { date: string; label: string; total: number }[]; current: number; previous: number; change: number | null }
  users: null | { total: number; active: number; roles: { role: string; total: number }[] }
  activity: null | { _id: string; action: string; resourceType: string; resourceId?: string; status: string; createdAt: string; userId?: { name: string } | null }[]
}
