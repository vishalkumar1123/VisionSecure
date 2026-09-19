import { notFound } from "next/navigation"
import WebsiteDashboard from "@/components/admin/website-analytics/dashboard"
export default async function WebsiteSection({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  if (!["traffic", "search", "keywords", "pages", "indexing", "performance"].includes(section)) notFound()
  return <WebsiteDashboard key={section} section={section}/>
}
