// app/api/debug-users/route.ts

import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"

export async function GET() {
  try {
    await connectDB()

    const users = await User.find({})
      .select("+password")

    return Response.json({
      count: users.length,
      users,
    })
  } catch (error) {
    return Response.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}