import { requireAdmin } from "@/lib/admin-auth"

export async function requireNotificationAdmin() {
  return requireAdmin()
}
