import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"

export async function GET() {
  try {
    await connectDB()

    const existingAdmin = await User.findOne({
      email: "info@visionsecuretech.in",
    })

    if (existingAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin already exists",
        },
        {
          status: 400,
        }
      )
    }

    const hashedPassword = await bcrypt.hash(
      "Admin@1234",
      10
    )

    const admin = await User.create({
      name: "Super Admin",

      email: "info@visionsecuretech.in",

      mobile: "9872133840",

      password: hashedPassword,

      role: "super_admin",

      isActive: true,

      emailVerified: true,
    })

    return NextResponse.json({
      success: true,
      message: "Admin created successfully",

      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    })
  } catch (error: any) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    )
  }
}