import { RequireAdmin } from "@/components/admin/require-admin"
import Inbox from "@/components/admin/customer-center/inbox"
export default function InboxPage() { return <RequireAdmin><Inbox/></RequireAdmin> }
