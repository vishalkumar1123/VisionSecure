import { RequireAdmin } from "@/components/admin/require-admin"
export default function ActivityLayout({ children }: { children: React.ReactNode }) {
  return <RequireAdmin>{children}</RequireAdmin>
}
