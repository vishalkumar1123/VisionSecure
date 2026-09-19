import { RequireAdmin } from "@/components/admin/require-admin"
export default function WebsiteLayout({ children }: { children: React.ReactNode }) { return <RequireAdmin>{children}</RequireAdmin> }
