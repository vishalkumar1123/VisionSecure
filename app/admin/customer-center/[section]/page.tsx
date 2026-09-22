import { notFound } from "next/navigation"
import { RequireAdmin } from "@/components/admin/require-admin"
import Customers from "@/components/admin/customer-center/customers"
import Knowledge from "@/components/admin/customer-center/knowledge"
import AgentSettings from "@/components/admin/customer-center/agent-settings"
import Requests from "@/components/admin/customer-center/requests"
export default async function CustomerCenterPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  const Page = ({ customers: Customers, knowledge: Knowledge, agent: AgentSettings, requests: Requests } as Record<string, React.ComponentType>)[section]
  if (!Page) notFound()
  return <RequireAdmin><Page/></RequireAdmin>
}
