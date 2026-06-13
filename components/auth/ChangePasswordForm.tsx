"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { changePasswordSchema } from "@/lib/validation-auth"

export function ChangePasswordForm() {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setSuccess(false)

    try {
      // Validate
      changePasswordSchema.parse(formData)

      // Submit
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Password change failed")
        return
      }

      setSuccess(true)
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      toast.success("Password changed successfully!")

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (error: any) {
      if (error.issues) {
        const formErrors: Record<string, string> = {}
        error.issues.forEach((issue: any) => {
          const path = issue.path.join(".")
          formErrors[path] = issue.message
        })
        setErrors(formErrors)
      } else {
        toast.error("An error occurred. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">Your password has been changed successfully.</p>
        </div>
      )}

      <div>
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          placeholder="Enter current password"
          disabled={loading}
        />
        {errors.currentPassword && (
          <p className="mt-1 text-sm text-red-500">{errors.currentPassword}</p>
        )}
      </div>

      <div>
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="Enter new password"
          disabled={loading}
        />
        <p className="mt-2 text-xs text-gray-500">
          Must contain: uppercase, lowercase, number, special character (!@#$%^&*), min 8 chars
        </p>
        {errors.newPassword && <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>}
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm new password"
          disabled={loading}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Changing..." : "Change Password"}
      </Button>
    </form>
  )
}
