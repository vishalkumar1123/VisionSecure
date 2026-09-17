"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Plus, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import UsersGrid from "@/components/admin/users-grid"
import { Button } from "@/components/ui/button"
import type { UserDTO } from "@/types"

export default function UsersPage() {
  const [users, setUsers] = useState<UserDTO[]>([])
  const [searchText, setSearchText] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const requestRef = useRef<AbortController | null>(null)
  const fetchUsers = useCallback(async () => {
    requestRef.current?.abort()
    const controller = new AbortController()
    requestRef.current = controller
    setLoading(true); setError("")
    try {
      const allUsers: UserDTO[] = []
      let page = 1, pages = 1
      do {
        const response = await fetch(`/api/users?page=${page}&limit=100`, { cache: "no-store", signal: controller.signal })
        const json = await response.json()
        if (!response.ok) throw new Error(json.error || "Unable to load users.")
        if (!Array.isArray(json.data?.data)) throw new Error("Unexpected users response.")
        allUsers.push(...json.data.data)
        pages = Number(json.data.pages) || 1
        page++
      } while (page <= pages)
      if (!controller.signal.aborted) setUsers(allUsers)
    } catch (failure) {
      if (!controller.signal.aborted) {
        const message = failure instanceof Error ? failure.message : "Unable to load users."
        setError(message); toast.error(message); setUsers([])
      }
    } finally { if (!controller.signal.aborted) setLoading(false) }
  }, [])
  useEffect(() => { void fetchUsers(); return () => requestRef.current?.abort() }, [fetchUsers])

  return <div className="space-y-6">
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="text-4xl font-bold text-foreground">User Management</h1><p className="mt-2 text-muted-foreground">Manage users, roles and account access. Your own role and lock status cannot be changed here.</p></div>
      <div className="flex gap-2"><Button variant="outline" disabled={loading} onClick={() => void fetchUsers()} aria-label="Refresh users"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /></Button><Link href="/admin/users/create" className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-primary-foreground"><Plus size={18} />Create User</Link></div>
    </header>
    <input type="search" aria-label="Search users" placeholder="Search users..." value={searchText} onChange={(event) => setSearchText(event.target.value)} className="w-full rounded-xl border border-border bg-card p-4 text-foreground" />
    {error && <p role="alert" className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{error}</p>}
    <UsersGrid users={users} refreshUsers={fetchUsers} searchText={searchText} loading={loading} />
  </div>
}
