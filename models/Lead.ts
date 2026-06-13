import mongoose, {
  Schema,
  models,
  model,
} from "mongoose"



// NOTES SCHEMA
const NoteSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },

    createdBy: {
      type: String,
      default: "Admin",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
)



// TIMELINE SCHEMA
const TimelineSchema = new Schema(
  {
    action: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      trim: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
)



const LeadSchema = new Schema(
  {
    // CUSTOMER INFO
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },



    // SERVICE INFO
    service: {
      type: String,
      trim: true,
      default: "",
    },

    budget: {
      type: String,
      trim: true,
      default: "",
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },



    // PROFESSIONAL CRM STATUS FLOW
    status: {
      type: String,

      enum: [
  "New",
  "In Discussion",
  "Follow-Up",
  "Quotation Sent",
  "Installation Scheduled",
  "Converted",
  "Closed",
],

      default: "New",
    },



    // PRIORITY
    priority: {
      type: String,

      enum: [
        "Low",
        "Medium",
        "High",
        "Urgent",
      ],

      default: "Medium",
    },



    // SOURCE
   source: {
  type: String,
  enum: [
    "Website",
    "WhatsApp",
    "Facebook",
    "Instagram",
    "Google Ads",
    "Call",
    "Reference",
    "Manual",
  ],
  default: "Website",
},



    // ASSIGNED USER
    assignedTo: {
      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User",

      default: null,
    },



    // FOLLOW UP DATE
    followUpDate: {
      type: Date,
      default: null,
    },



    // NOTES
    notes: [NoteSchema],



    // TIMELINE
    timeline: [TimelineSchema],
  },

  {
    timestamps: true,
  }
)



const Lead =
  models.Lead ||
  model("Lead", LeadSchema)

export default Lead