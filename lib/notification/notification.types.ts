import { IInquiryInput } from "@/types/inquiry";

export interface INotificationPayload {
  inquiry: IInquiryInput;
  adminEmail: string;
  adminPhone: string;
}