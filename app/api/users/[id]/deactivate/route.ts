import { NextRequest } from "next/server"
import { updateManagedUser } from "@/lib/user-management"
export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  return updateManagedUser(req, (await context.params).id, { isActive: false })
}
