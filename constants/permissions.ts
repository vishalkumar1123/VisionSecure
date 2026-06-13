/**
 * Role-based permissions matrix
 * Defines what each role can do
 */

import type { UserRole, Permission } from '@/types'

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    // Leads
    'lead.create',
    'lead.read',
    'lead.update',
    'lead.delete',
    'lead.assign',
    // Users
    'user.create',
    'user.read',
    'user.update',
    'user.delete',
    // Analytics
    'analytics.view',
    // Quotations
    'quotation.create',
    'quotation.read',
    'quotation.update',
    'quotation.delete',
    // Service
    'service.create',
    'service.read',
    'service.update',
    // Settings
    'settings.view',
    'settings.update',
    // Activity
    'activity.view',
  ],
  admin: [
    // Leads
    'lead.create',
    'lead.read',
    'lead.update',
    'lead.assign',
    // Users
    'user.read',
    'user.update',
    // Analytics
    'analytics.view',
    // Quotations
    'quotation.create',
    'quotation.read',
    'quotation.update',
    // Service
    'service.read',
    'service.update',
    // Settings
    'settings.view',
    // Activity
    'activity.view',
  ],
  sales_executive: [
    // Leads - can only manage assigned ones
    'lead.create',
    'lead.read',
    'lead.update',
    // Quotations
    'quotation.create',
    'quotation.read',
    // Activity
    'activity.view',
  ],
  technician: [
    // Service tickets only
    'service.read',
    'service.update',
  ],
  viewer: [
    // Read-only access
    'lead.read',
    'analytics.view',
    'activity.view',
  ],
}

export const canUserPerform = (role: UserRole, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false
}

export const getUserPermissions = (role: UserRole): Permission[] => {
  return ROLE_PERMISSIONS[role] || []
}
