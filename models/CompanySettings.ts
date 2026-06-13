import mongoose, { Schema, models, model } from "mongoose"

interface ICompanySettings {
  _id?: string
  companyName: string
  companyLogo?: string
  address: string
  phone: string
  email: string
  gstNumber: string
  website?: string
  socialMedia?: {
    facebook?: string
    instagram?: string
    whatsapp?: string
    linkedin?: string
  }
  smtpSettings?: {
    host: string
    port: number
    secure: boolean
    username: string
    password: string
    fromEmail: string
    fromName: string
  }
  emailTemplatesEnabled: boolean
  whatsappBusinessEnabled: boolean
  whatsappPhoneNumber?: string
  whatsappApiKey?: string
  createdAt: Date
  updatedAt: Date
}

const CompanySettingsSchema = new Schema<ICompanySettings>(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      default: "VisionSecure Smart Technologies",
    },

    companyLogo: {
      type: String,
      default: null,
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      default: "India",
    },

    phone: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, "Phone must be 10 digits"],
    },

    email: {
      type: String,
      required: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
    },

    gstNumber: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: null,
    },

    socialMedia: {
      facebook: { type: String, default: null },
      instagram: { type: String, default: null },
      whatsapp: { type: String, default: null },
      linkedin: { type: String, default: null },
    },

    smtpSettings: {
      host: { type: String, default: null },
      port: { type: Number, default: null },
      secure: { type: Boolean, default: true },
      username: { type: String, default: null },
      password: { type: String, default: null },
      fromEmail: { type: String, default: null },
      fromName: { type: String, default: "VisionSecure" },
    },

    emailTemplatesEnabled: {
      type: Boolean,
      default: true,
    },

    whatsappBusinessEnabled: {
      type: Boolean,
      default: false,
    },

    whatsappPhoneNumber: {
      type: String,
      default: null,
    },

    whatsappApiKey: {
      type: String,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  }
)

export default models.CompanySettings || model<ICompanySettings>(
  "CompanySettings",
  CompanySettingsSchema
)
