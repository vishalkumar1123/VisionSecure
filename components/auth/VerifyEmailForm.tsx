"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function VerifyEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [token, setToken] = useState("")
  const email = searchParams.get("email")

  // Auto-verify if token is in URL
  useEffect(() => {
    const urlToken = searchParams.get("token")
    if (urlToken) {
      setToken(urlToken)
      verifyEmail(urlToken)
    }
  }, [])

  const verifyEmail = async (verifyToken: string) => {
    setVerifying(true)
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: verifyToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Verification failed")
        return
      }

      toast.success("Email verified successfully!")
      router.push("/admin/login?verified=true")
    } catch (error) {
      toast.error("An error occurred during verification")
    } finally {
      setVerifying(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token.trim()) {
      toast.error("Please enter verification token")
      return
    }
    await verifyEmail(token)
  }

  if (verifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Verifying your email...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          {email ? `A verification link has been sent to ${email}` : "Check your email for the verification link"}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Verification Token</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste the verification token from your email here"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-xs"
          disabled={loading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading || !token.trim()}>
        {loading ? "Verifying..." : "Verify Email"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Didn't receive the email?{" "}
        <a href="/auth/register" className="text-blue-600 hover:underline">
          Try registering again
        </a>
      </p>
    </form>
  )
}
