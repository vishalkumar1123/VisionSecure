import { connectDB } from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry"; // Ab ye error gayab ho jayega!
import { IInquiryInput } from "@/types/inquiry";

export class InquiryService {
  static async createInquiry(data: IInquiryInput) {
    await connectDB();
    const newInquiry = new Inquiry(data);
    return await newInquiry.save();
  }
}