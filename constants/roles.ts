/**
 * Role definitions and constants
 */

import type { UserRole } from '@/types'

export const USER_ROLES: Record<UserRole, { label: string; description: string }> = {
  super_admin: {
    label: 'Super Admin',
    description: 'Full system access',
  },
  admin: {
    label: 'Admin',
    description: 'Can manage leads, analytics, and team',
  },
  sales_executive: {
    label: 'Sales Executive',
    description: 'Can manage assigned leads',
  },
  technician: {
    label: 'Technician',
    description: 'Can manage service tickets',
  },
  viewer: {
    label: 'Viewer',
    description: 'Read-only access',
  },
}

export const ROLE_COLORS: Record<UserRole, string> = {
  super_admin: 'bg-red-500',
  admin: 'bg-blue-500',
  sales_executive: 'bg-green-500',
  technician: 'bg-purple-500',
  viewer: 'bg-gray-500',
}

export const ROLE_ICONS: Record<UserRole, string> = {
  super_admin: '👑',
  admin: '🔧',
  sales_executive: '💼',
  technician: '🔨',
  viewer: '👁️',
}
