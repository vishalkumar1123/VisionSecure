"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { forgotPasswordSchema } from "@/lib/validation-auth"

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Validate
      forgotPasswordSchema.parse({ email })

      // Submit
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to send reset email")
        return
      }

      setSent(true)
      toast.success("Password reset link sent to your email!")
    } catch (error: any) {
      if (error.issues) {
        setError(error.issues[0]?.message || "Validation failed")
      } else {
        setError("An error occurred. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            Password reset link has been sent to <strong>{email}</strong>. Check your email and click the link to reset your password.
          </p>
        </div>

        <p className="text-center text-sm text-gray-500">
          Remember your password?{" "}
          <a href="/admin/login" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setError("")
          }}
          placeholder="john@example.com"
          disabled={loading}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>

      <p className="text-sm text-gray-600">
        We'll send you a link to reset your password. The link expires in 1 hour for security.
      </p>

      <Button type="submit" className="w-full" disabled={loading || !email.trim()}>
        {loading ? "Sending..." : "Send Reset Link"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Remember your password?{" "}
        <a href="/admin/login" className="text-blue-600 hover:underline">
          Sign in
        </a>
      </p>
    </form>
  )
}
