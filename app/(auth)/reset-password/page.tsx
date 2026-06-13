"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm"

function ResetPasswordPageContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Reset Link</h1>
            <p className="text-gray-600 mb-6">The reset link is missing or invalid.</p>
            <a href="/auth/forgot-password" className="text-blue-600 hover:underline">
              Request a new reset link
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">Create a new password for your account</p>
          </div>

          <ResetPasswordForm token={token} />
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <ResetPasswordPageContent />
    </Suspense>
  )
}
