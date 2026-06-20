import mongoose, {
  Schema,
  models,
  model,
} from "mongoose"

import type { IUser } from "@/types"

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [
        2,
        "Name must be at least 2 characters",
      ],
    },

    email: {
      type: String,
      required: [true, "Email is required"],

      unique: true,

      lowercase: true,

      trim: true,

      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,

        "Invalid email format",
      ],
    },

    mobile: {
      type: String,

      required: [
        true,
        "Mobile number is required",
      ],

      unique: true,

      trim: true,

      match: [
        /^[0-9]{10}$/,

        "Mobile must be 10 digits",
      ],
    },

    password: {
      type: String,

      required: [
        true,
        "Password is required",
      ],

      minlength: 8,

      select: false,
    },

    role: {
      type: String,

      enum: [
        "super_admin",

        "admin",

        "sales_executive",

        "technician",

        "viewer",
      ],

      default: "sales_executive",

      required: true,
    },

    permissions: {
      type: [String],

      default: [],
    },

    isActive: {
      type: Boolean,

      default: true,
    },

    profilePicture: {
      type: String,

      default: "",
    },

    lastLoginAt: {
      type: Date,

      default: null,
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Department",

      default: null,
    },

    reportingTo: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      default: null,
    },
  },

  {
    timestamps: true,
  }
)


// Custom Indexes

UserSchema.index({ role: 1 })

UserSchema.index({ createdAt: -1 })


// Hide sensitive fields

UserSchema.methods.toJSON =
function () {

  const user =
  this.toObject()

  delete user.password

  delete user.permissions

  return user
}


const User =
  models.User ||
  model<IUser>(
    "User",
    UserSchema
  )

export default User