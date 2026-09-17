"use client"
import { useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { USER_ROLES } from "@/constants/roles"
import type { UserDTO, UserRole } from "@/types"

export default function EditUserDialog({ open, onClose, user, refreshUsers }: {
  open: boolean; onClose: () => void; user: UserDTO; refreshUsers: () => void | Promise<void>
}) {
  const { data: session } = useSession()
  const self = !session?.user?.id || session.user.id === user.id
  const [role, setRole] = useState<UserRole>(user.role)
  const [loading, setLoading] = useState(false)
  const busy = useRef(false)
  const [error, setError] = useState("")
  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    if (busy.current || self) return
    busy.current = true; setLoading(true); setError("")
    const notice = toast.loading(`Updating role for ${user.name}...`)
    try {
      const response = await fetch(`/api/users/${encodeURIComponent(user.id)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role }) })
      const data = await response.json().catch(() => null)
      if (!response.ok || !data?.success) throw new Error(data?.error || "Unable to change role.")
      toast.success(`Role updated for ${user.name}`, { id: notice })
      await refreshUsers(); onClose()
    } catch (failure) { const message = failure instanceof Error ? failure.message : "Unable to change role."; setError(message); toast.error(message, { id: notice }) }
    finally { busy.current = false; setLoading(false) }
  }
  return <Dialog open={open} onOpenChange={(value) => { if (!value && !busy.current) onClose() }}>
    <DialogContent className="bg-card text-foreground" showCloseButton={!loading}>
      <DialogHeader><DialogTitle>Change user role</DialogTitle><DialogDescription>Manage the role for {user.name} ({user.email}).</DialogDescription></DialogHeader>
      <form onSubmit={save} className="space-y-5" aria-busy={loading}>
        {(error || self) && <p role="alert" className="text-sm text-destructive">{self ? "You cannot change your own role." : error}</p>}
        <label className="block space-y-2 text-sm font-medium">Role<select disabled={self || loading} value={role} onChange={(event) => setRole(event.target.value as UserRole)} className="w-full rounded-xl border border-input bg-background p-3">{Object.entries(USER_ROLES).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}</select></label>
        <div className="flex justify-end gap-2"><Button type="button" variant="outline" disabled={loading} onClick={onClose}>Cancel</Button><Button type="submit" disabled={self || loading || role === user.role} className="bg-accent text-accent-foreground hover:bg-brand-hover">{loading ? "Updating..." : "Update role"}</Button></div>
      </form>
    </DialogContent>
  </Dialog>
}
