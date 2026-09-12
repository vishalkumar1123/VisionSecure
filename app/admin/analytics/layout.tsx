import { RequireAdmin } from "@/components/admin/require-admin"

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return <RequireAdmin>{children}</RequireAdmin>
}
