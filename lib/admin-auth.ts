import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"

const ADMIN_ROLES = new Set(["admin", "super_admin"])

/**
 * Use this in every route that returns or changes back-office data. Page
 * middleware is helpful for navigation, but it does not protect direct API
 * requests.
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return { user: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  }

  await connectDB()
  const currentUser = await User.findById(session.user.id).select("_id name email role isActive").lean()

  if (!currentUser?.isActive || !ADMIN_ROLES.has(String(currentUser.role))) {
    return { user: null, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
  }

  return {
    user: {
      id: currentUser._id.toString(),
      name: currentUser.name,
      email: currentUser.email,
      role: String(currentUser.role),
    },
    response: null,
  }
}
