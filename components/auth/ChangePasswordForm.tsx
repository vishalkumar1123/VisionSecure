"use client"

import { useRef, useState } from "react"
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { changePasswordSchema, type ChangePasswordInput } from "@/lib/validation-auth"

const emptyForm: ChangePasswordInput = { currentPassword: "", newPassword: "", confirmPassword: "" }
const fields = [
  { name: "currentPassword", label: "Current password", autoComplete: "current-password" },
  { name: "newPassword", label: "New password", autoComplete: "new-password" },
  { name: "confirmPassword", label: "Confirm new password", autoComplete: "new-password" },
] as const

export function ChangePasswordForm() {
  const [loading, setLoading] = useState(false)
  const submitting = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState(emptyForm)
  const [visible, setVisible] = useState<Record<string, boolean>>({})
  const [notice, setNotice] = useState<{ success: boolean; message: string } | null>(null)

  const focusError = (fieldErrors: Record<string, string>) => {
    const name = fields.find((field) => fieldErrors[field.name])?.name
    if (name) formRef.current?.querySelector<HTMLInputElement>(`[name="${name}"]`)?.focus()
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (submitting.current) return
    setErrors({})
    setNotice(null)
    const parsed = changePasswordSchema.safeParse(formData)
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) nextErrors[String(issue.path[0])] ??= issue.message
      setErrors(nextErrors)
      focusError(nextErrors)
      return
    }
    submitting.current = true
    setLoading(true)
    const notification = toast.loading("Updating your password...")
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) {
        const message = typeof data?.error === "string" ? data.error : "Unable to change your password. Please try again."
        const fieldErrors: Record<string, string> = {}
        for (const field of fields) {
          const value = data?.errors?.[field.name]
          if (Array.isArray(value) && typeof value[0] === "string") fieldErrors[field.name] = value[0]
        }
        setErrors(fieldErrors)
        setNotice({ success: false, message })
        toast.error(message, { id: notification })
        // Re-enable inputs before moving focus to the invalid field.
        setLoading(false)
        requestAnimationFrame(() => focusError(fieldErrors))
        return
      }
      const message = "Your password has been changed successfully. Use your new password the next time you sign in."
      setFormData(emptyForm)
      setVisible({})
      setNotice({ success: true, message })
      toast.success("Password updated successfully", { id: notification })
    } catch {
      const message = "We could not confirm the update. Check your connection and try again."
      setNotice({ success: false, message })
      toast.error(message, { id: notification })
    } finally {
      submitting.current = false
      setLoading(false)
    }
  }

  return <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" noValidate aria-busy={loading}>
    {notice && <div role={notice.success ? "status" : "alert"} className={`flex items-start gap-3 rounded-xl border p-4 text-sm leading-6 ${notice.success ? "border-brand-green/30 bg-accent/10 text-brand-green" : "border-destructive/30 bg-destructive/10 text-destructive"}`}>
      {notice.success ? <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" /> : <AlertCircle className="mt-1 h-4 w-4 shrink-0" />}
      <p>{notice.message}</p>
    </div>}
    {fields.map((field) => <div key={field.name} className="space-y-2">
      <Label htmlFor={field.name}>{field.label}</Label>
      <div className="relative">
        <Input id={field.name} name={field.name} type={visible[field.name] ? "text" : "password"}
          autoComplete={field.autoComplete} required readOnly={loading} value={formData[field.name]}
          aria-invalid={!!errors[field.name]} aria-describedby={[errors[field.name] ? `${field.name}-error` : "", field.name === "newPassword" ? "password-requirements" : ""].filter(Boolean).join(" ") || undefined}
          className="h-12 bg-background pr-12"
          onChange={(event) => {
            setFormData((previous) => ({ ...previous, [field.name]: event.target.value }))
            setErrors((previous) => ({ ...previous, [field.name]: "" }))
            setNotice(null)
          }} />
        <button type="button" disabled={loading} onClick={() => setVisible((previous) => ({ ...previous, [field.name]: !previous[field.name] }))}
          className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
          aria-label={`${visible[field.name] ? "Hide" : "Show"} ${field.label.toLowerCase()}`} aria-pressed={!!visible[field.name]}>
          {visible[field.name] ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {field.name === "newPassword" && <p id="password-requirements" className="text-xs leading-5 text-muted-foreground">At least 8 characters with uppercase, lowercase, a number and a special character (!@#$%^&amp;*). Maximum 72 bytes.</p>}
      {errors[field.name] && <p id={`${field.name}-error`} role="alert" className="text-sm text-destructive">{errors[field.name]}</p>}
    </div>)}
    <Button type="submit" className="h-12 w-full bg-accent text-accent-foreground hover:bg-brand-hover" disabled={loading}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
      {loading ? "Updating password..." : "Change password"}
    </Button>
  </form>
}
