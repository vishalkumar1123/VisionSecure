/**
 * Lead Types and Interfaces
 */

import type { TimestampedDocument } from './common'

export type LeadStatus = 'New' | 'In Discussion' | 'Follow-Up' | 'Quotation Sent' | 'Installation Scheduled' | 'Converted' | 'Closed'

export type LeadSource = 'Website' | 'WhatsApp' | 'Facebook' | 'Instagram' | 'Google Ads' | 'Call' | 'Reference' | 'Manual'

export type LeadPriority = 'Low' | 'Medium' | 'High' | 'Urgent'

export interface ILeadNote {
  text: string
  createdBy: string
  createdAt: Date
}

export interface ILeadTimeline {
  action: string
  status?: string
  createdAt: Date
}

export interface ILead extends TimestampedDocument {
  _id: string
  name: string
  phone: string
  email?: string
  service?: string
  budget?: string
  message?: string
  status: LeadStatus
  priority: LeadPriority
  source: LeadSource
  assignedTo?: string
  followUpDate?: Date
  notes: ILeadNote[]
  timeline: ILeadTimeline[]
}

export interface CreateLeadRequest {
  name: string
  phone: string
  email?: string
  service?: string
  budget?: string
  message?: string
  source?: LeadSource
}

export interface UpdateLeadRequest {
  name?: string
  phone?: string
  email?: string
  service?: string
  budget?: string
  message?: string
  status?: LeadStatus
  priority?: LeadPriority
  assignedTo?: string
  followUpDate?: Date
}

export interface AddLeadNoteRequest {
  text: string
}
