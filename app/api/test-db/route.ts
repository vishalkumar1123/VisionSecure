// app/api/test-db/route.ts

import { connectDB } from "@/lib/mongodb"

export async function GET() {

  try {

    await connectDB()

    return Response.json({
      success: true,
      message: "MongoDB Connected"
    })

  } catch (error) {

    return Response.json(
      {
        success: false,
        error: String(error)
      },
      { status: 500 }
    )
  }
}