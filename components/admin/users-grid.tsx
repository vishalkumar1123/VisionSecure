"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { AgGridReact } from "ag-grid-react"
import type { ColDef } from "ag-grid-community"
import { LockKeyhole, UnlockKeyhole, UserCog, UserX } from "lucide-react"
import { toast } from "sonner"
import EditUserDialog from "./edit-user-dialog"
import { UserPasswordAction } from "./user-password-action"
import type { UserDTO } from "@/types"
import { USER_ROLES } from "@/constants/roles"
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-quartz.css"

export default function UsersGrid({ users, refreshUsers, searchText = "", loading = false }: {
  users: UserDTO[]; refreshUsers: () => void | Promise<void>; searchText?: string; loading?: boolean
}) {
  const { data: session } = useSession()
  const actorId = session?.user?.id
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null)
  const [busy, setBusy] = useState(false)
  const pending = useRef(false)
  const setAccess = useCallback(async (user: UserDTO, deactivate = false) => {
    if (!actorId || user.id === actorId) { toast.error("You cannot lock/unlock your own account."); return }
    if (pending.current) return
    const locked = deactivate || user.isActive
    if (!window.confirm(`${locked ? "Lock" : "Unlock"} ${user.name}?`)) return
    pending.current = true; setBusy(true)
    const notification = toast.loading(`${locked ? "Locking" : "Unlocking"} ${user.name}...`)
    try {
      const response = await fetch(`/api/users/${encodeURIComponent(user.id)}`, { method: deactivate ? "DELETE" : "PATCH", headers: { "Content-Type": "application/json" }, ...(deactivate ? {} : { body: JSON.stringify({ isActive: !locked }) }) })
      const data = await response.json().catch(() => null)
      if (!response.ok || !data?.success) throw new Error(data?.error || "Unable to update account access.")
      toast.success(`${user.name} ${locked ? "locked" : "unlocked"} successfully`, { id: notification })
      await refreshUsers()
    } catch (failure) { toast.error(failure instanceof Error ? failure.message : "Unable to update user.", { id: notification }) }
    finally { pending.current = false; setBusy(false) }
  }, [actorId, refreshUsers])

  const columnDefs = useMemo<ColDef<UserDTO>[]>(() => [
    { headerName: "Name", field: "name", flex: 1, minWidth: 150 },
    { headerName: "Mobile", field: "mobile", flex: 1, minWidth: 130 },
    { headerName: "Email", field: "email", flex: 1.5, minWidth: 190 },
    { headerName: "Role", field: "role", flex: 1, minWidth: 150, valueFormatter: ({ value }) => USER_ROLES[value as UserDTO["role"]]?.label || value },
    { headerName: "Status", field: "isActive", minWidth: 115, flex: 1, cellRenderer: ({ data }: { data?: UserDTO }) => data ? <span className={data.isActive ? "font-medium text-brand-green" : "font-medium text-destructive"}>{data.isActive ? "Unlocked" : "Locked"}</span> : null },
    { headerName: "Actions", minWidth: 205, flex: 1.5, sortable: false, filter: false, cellRenderer: ({ data }: { data?: UserDTO }) => {
      if (!data) return null
      const self = !actorId || data.id === actorId
      const disabled = self || busy || loading
      const reason = self ? "You cannot change your own role or lock status" : ""
      return <div className="flex items-center gap-2 pt-2">
        <button type="button" disabled={disabled} title={reason || `Change role for ${data.name}`} aria-label={`Change role for ${data.name}`} onClick={() => setSelectedUser(data)} className="rounded bg-primary p-2 text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"><UserCog size={16} /></button>
        <button type="button" disabled={disabled} title={reason || `${data.isActive ? "Lock" : "Unlock"} ${data.name}`} aria-label={`${data.isActive ? "Lock" : "Unlock"} ${data.name}`} onClick={() => void setAccess(data)} className="rounded bg-accent p-2 text-accent-foreground disabled:cursor-not-allowed disabled:opacity-40">{data.isActive ? <LockKeyhole size={16} /> : <UnlockKeyhole size={16} />}</button>
        <button type="button" disabled={disabled || !data.isActive} title={reason || `Deactivate ${data.name} (can be unlocked later)`} aria-label={`Deactivate ${data.name}`} onClick={() => void setAccess(data, true)} className="rounded bg-destructive p-2 text-destructive-foreground disabled:cursor-not-allowed disabled:opacity-40"><UserX size={16} /></button>
        <UserPasswordAction user={data} />
      </div>
    } },
  ], [actorId, busy, loading, setAccess])
  return <>
    <div className="ag-theme-quartz-dark rounded-xl" style={{ height: 700, width: "100%" }}>
      <AgGridReact<UserDTO> rowData={users} getRowId={({ data }) => data.id} columnDefs={columnDefs} quickFilterText={searchText} loading={loading} pagination paginationPageSize={10} paginationPageSizeSelector={[10, 25, 50, 100]} animateRows defaultColDef={{ sortable: true, filter: true, floatingFilter: true, resizable: true }} />
    </div>
    {selectedUser && <EditUserDialog key={selectedUser.id} open onClose={() => setSelectedUser(null)} user={selectedUser} refreshUsers={refreshUsers} />}
  </>
}
