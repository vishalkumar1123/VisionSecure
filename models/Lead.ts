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
    customerCenterIdentity: { type: String, unique: true, sparse: true },
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



    address: { type: String, trim: true, default: "", maxlength: 600 },
    locality: { type: String, trim: true, default: "", maxlength: 160 },

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
  "Installed Successfully",
  "Cancelled",
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
    "AI Chat",
    "AI Assistant",
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
    followUpReminderFor: { type: Date, default: null, select: false },
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

// Next's development reloads can retain a model compiled before these fields
// existed. Extend that model and recompile its accessors instead of silently
// dropping new address values under Mongoose's strict schema handling.
if (models.Lead) {
  let changed = false
  for (const field of ["address", "followUpReminderFor"] as const) {
    if (!Lead.schema.path(field)) {
      Lead.schema.add({ [field]: LeadSchema.obj[field] })
      changed = true
    }
  }
  if (changed) Lead.recompileSchema()
}

export default Lead
