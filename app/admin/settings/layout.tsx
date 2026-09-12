import { RequireAdmin } from "@/components/admin/require-admin"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <RequireAdmin>{children}</RequireAdmin>
}
