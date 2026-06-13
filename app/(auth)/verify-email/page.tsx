import { Suspense } from "react"
import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm"

export const metadata = {
  title: "Verify Email | VisionSecure",
  description: "Verify your email address",
}

function VerifyEmailPageContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Email</h1>
            <p className="text-gray-600">Confirm your email address to complete registration</p>
          </div>

          <VerifyEmailForm />
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <VerifyEmailPageContent />
    </Suspense>
  )
}
