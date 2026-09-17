"use client"

import { useId, useRef, useState } from "react"
import { KeyRound, Eye, EyeOff, Loader2 } from "lucide-react"
import Swal from "sweetalert2"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { adminResetPasswordSchema } from "@/lib/validation-auth"

interface PasswordUser { id: string; name?: string; email?: string }
const empty = { newPassword: "", confirmPassword: "" }
const fields = [{ name: "newPassword", label: "New password" }, { name: "confirmPassword", label: "Confirm new password" }] as const

export function UserPasswordAction({ user }: { user: PasswordUser }) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(empty)
  const [visible, setVisible] = useState({ newPassword: false, confirmPassword: false })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [failure, setFailure] = useState("")
  const [loading, setLoading] = useState(false)
  const busy = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)
  const name = user.name || user.email || "this user"

  const changeOpen = (value: boolean) => {
    if (busy.current) return
    setOpen(value); setForm(empty); setErrors({}); setFailure("")
    setVisible({ newPassword: false, confirmPassword: false })
  }
  const focusError = (nextErrors: Record<string, string>) => {
    const field = fields.find((item) => nextErrors[item.name])?.name
    if (field) formRef.current?.querySelector<HTMLInputElement>(`[name="${field}"]`)?.focus()
  }
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (busy.current) return
    setErrors({}); setFailure("")
    const parsed = adminResetPasswordSchema.safeParse(form)
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) nextErrors[String(issue.path[0])] ??= issue.message
      setErrors(nextErrors); focusError(nextErrors); return
    }
    busy.current = true; setLoading(true)
    const notification = toast.loading(`Updating password for ${name}...`)
    try {
      const response = await fetch(`/api/users/${encodeURIComponent(user.id)}/reset-password`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok || data?.success !== true) {
        const message = typeof data?.error === "string" ? data.error : "Unable to confirm the password update. Please try again."
        const nextErrors: Record<string, string> = {}
        for (const field of fields) {
          const value = data?.errors?.[field.name]
          if (Array.isArray(value) && typeof value[0] === "string") nextErrors[field.name] = value[0]
        }
        setErrors(nextErrors); focusError(nextErrors); setFailure(message)
        toast.error(message, { id: notification }); return
      }
      setForm(empty); setVisible({ newPassword: false, confirmPassword: false }); setOpen(false)
      toast.dismiss(notification)
      await Swal.fire({ title: "Password updated", text: `Password changed for ${name}. Use the new password at the next sign-in.`, icon: "success" })
    } catch {
      const message = "We could not confirm the update. Check your connection and try again."
      setFailure(message); toast.error(message, { id: notification })
    } finally { busy.current = false; setLoading(false) }
  }

  return <Dialog open={open} onOpenChange={changeOpen}>
    <DialogTrigger asChild><button type="button" title={`Change password for ${name}`} aria-label={`Change password for ${name}`} className="rounded bg-accent p-2 text-accent-foreground transition hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"><KeyRound size={16} aria-hidden="true" /></button></DialogTrigger>
    <DialogContent className="max-h-[90dvh] overflow-y-auto bg-card text-foreground" showCloseButton={!loading}>
      <DialogHeader><DialogTitle>Change user password</DialogTitle><DialogDescription>Set a new password for <strong className="text-foreground">{name}</strong>{user.email && user.email !== name ? ` (${user.email})` : ""}. The new password will be used at the next sign-in.</DialogDescription></DialogHeader>
      <form ref={formRef} onSubmit={submit} noValidate aria-busy={loading} className="space-y-5">
        {failure && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{failure}</p>}
        {fields.map((field) => <div key={field.name} className="space-y-2">
          <Label htmlFor={`${id}-${field.name}`}>{field.label}</Label>
          <div className="relative">
            <Input id={`${id}-${field.name}`} name={field.name} type={visible[field.name] ? "text" : "password"} autoComplete="new-password" required readOnly={loading}
              className="h-12 bg-background pr-12" value={form[field.name]} aria-invalid={!!errors[field.name]}
              aria-describedby={`${id}-requirements${errors[field.name] ? ` ${id}-${field.name}-error` : ""}`}
              onChange={(event) => { setForm({ ...form, [field.name]: event.target.value }); setErrors({ ...errors, [field.name]: "" }); setFailure("") }} />
            <button type="button" disabled={loading} onClick={() => setVisible({ ...visible, [field.name]: !visible[field.name] })} aria-label={`${visible[field.name] ? "Hide" : "Show"} ${field.label.toLowerCase()}`} aria-pressed={visible[field.name]}
              className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring">{visible[field.name] ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          {errors[field.name] && <p id={`${id}-${field.name}-error`} role="alert" className="text-sm text-destructive">{errors[field.name]}</p>}
        </div>)}
        <p id={`${id}-requirements`} className="text-xs leading-5 text-muted-foreground">At least 8 characters with uppercase, lowercase, a number and a special character (!@#$%^&amp;*). Maximum 72 bytes.</p>
        <div className="flex justify-end gap-3"><Button type="button" variant="outline" disabled={loading} onClick={() => changeOpen(false)}>Cancel</Button><Button type="submit" disabled={loading} className="bg-accent text-accent-foreground hover:bg-brand-hover">{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{loading ? "Updating..." : "Change password"}</Button></div>
      </form>
    </DialogContent>
  </Dialog>
}
