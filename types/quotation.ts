/**
 * Quotation Types and Interfaces
 */

import type { TimestampedDocument } from './common'

export type QuotationStatus = 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired'

export interface IQuotationItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface IQuotation extends TimestampedDocument {
  _id: string
  number: string
  leadId: string
  customerId: string
  items: IQuotationItem[]
  subTotal: number
  gstRate: number
  gstAmount: number
  total: number
  status: QuotationStatus
  validUntil?: Date
  notes?: string
  sentAt?: Date
  createdBy: string
}

export interface CreateQuotationRequest {
  leadId: string
  customerId: string
  items: IQuotationItem[]
  gstRate?: number
  notes?: string
}

export interface UpdateQuotationRequest {
  items?: IQuotationItem[]
  gstRate?: number
  notes?: string
  status?: QuotationStatus
}
