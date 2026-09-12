import { RequireAdmin } from "@/components/admin/require-admin"

export default function LeadsLayout({ children }: { children: React.ReactNode }) {
  return <RequireAdmin>{children}</RequireAdmin>
}
