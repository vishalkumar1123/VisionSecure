import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"

export async function RequireAdmin({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === "admin" || session?.user?.role === "super_admin"

  if (!isAdmin) redirect("/admin/login")

  return children
}
