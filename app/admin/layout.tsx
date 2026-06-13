import AdminSidebar from "@/components/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className="flex min-h-screen bg-black">

      <AdminSidebar />

      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>

    </div>
  )
}