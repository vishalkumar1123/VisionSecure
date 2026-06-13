/**
 * Application-wide constants
 */

// Password validation rules
export const PASSWORD_RULES = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBERS: true,
  REQUIRE_SPECIAL: true,
}

// Token expiry times (in minutes)
export const TOKEN_EXPIRY = {
  EMAIL_VERIFICATION: 24 * 60, // 24 hours
  PASSWORD_RESET: 60, // 1 hour
  SESSION: 7 * 24 * 60, // 7 days
}

// API pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  DEFAULT_PAGE: 1,
}

// Email configuration
export const EMAIL_CONFIG = {
  FROM_EMAIL: process.env.EMAIL_FROM_ADDRESS || 'noreply@visionsecuretech.in',
  FROM_NAME: 'VisionSecure Smart Technologies',
  REPLY_TO: process.env.EMAIL_REPLY_TO || 'info@visionsecuretech.in',
}

// Company details (to be moved to database in Phase 7)
export const COMPANY_INFO = {
  name: 'VisionSecure Smart Technologies',
  phone: process.env.COMPANY_PHONE || '+91-XXXXXXXXXX',
  email: process.env.COMPANY_EMAIL || 'info@visionsecuretech.in',
  address: process.env.COMPANY_ADDRESS || 'India',
  gst: process.env.COMPANY_GST || '',
}

// Services list
export const SERVICES = [
  'CCTV Surveillance',
  'Biometric Systems',
  'Access Control Systems',
  'Networking Solutions',
  'Video Door Phones',
  'Fire Alarm Systems',
  'Home Automation',
  'EPABX Systems',
  'PA Systems',
  'Video Intercom',
  'Attendance Systems',
  'Smart Locks',
]

export const ACTIVITY_LOG_ACTIONS = [
  'LOGIN',
  'LOGOUT',
  'LEAD_CREATED',
  'LEAD_UPDATED',
  'LEAD_ASSIGNED',
  'LEAD_STATUS_CHANGED',
  'NOTE_ADDED',
  'USER_CREATED',
  'USER_UPDATED',
  'USER_DELETED',
  'PASSWORD_RESET',
  'EMAIL_VERIFIED',
  'QUOTATION_CREATED',
  'SERVICE_TICKET_CREATED',
] as const
