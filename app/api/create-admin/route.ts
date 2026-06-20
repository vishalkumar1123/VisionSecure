import { NextResponse } from "next/server"

import bcrypt from "bcryptjs"

import { connectDB } from "@/lib/mongodb"

import User from "@/models/User"

export async function GET() {

 try {

   await connectDB()

   const adminEmail =
   "info@visionsecuretech.in"

   const existingAdmin =
   await User.findOne({
    email: adminEmail
   })

   if(existingAdmin){

    return NextResponse.json({

      success:true,

      message:
      "Admin already exists",

      user:existingAdmin

    })

   }

   const password =
   await bcrypt.hash(
    "Admin@1234",
    10
   )

   const admin =
   await User.create({

    name:
    "VisionSecure Admin",

    email:
    adminEmail,

    mobile:
    "9872133840",

    password,

    role:
    "super_admin",

    isActive:true

   })

   return NextResponse.json({

    success:true,

    message:
    "Admin created successfully",

    user:{

      id:admin._id,

      name:admin.name,

      email:admin.email,

      role:admin.role

    }

   })

 } catch(error:any){

   return NextResponse.json({

     success:false,

     message:error.message

   })

 }

}