import { RequireAdmin } from "@/components/admin/require-admin"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <RequireAdmin>{children}</RequireAdmin>
}
