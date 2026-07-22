export interface IInquiryInput {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
}

export interface IInquiry extends IInquiryInput {
  _id: string;
  createdAt: Date;
}