import mongoose, { Schema, Document } from "mongoose";
import { IInquiryInput } from "@/types/inquiry";

// Mongoose Document type extend kar rahe hain TypeScript features ke liye
export interface IInquiryDocument extends IInquiryInput, Document {
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
      default: "",
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
  },
  {
    timestamps: true, // Isse createdAt aur updatedAt automatically manage ho jayenge
  }
);

// Next.js Hot Reloading cache issue se bachne ke liye standard check
const Inquiry = mongoose.models.Inquiry || mongoose.model<IInquiryDocument>("Inquiry", InquirySchema);

export default Inquiry;