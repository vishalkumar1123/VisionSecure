import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm"

export const metadata = {
  title: "Forgot Password | VisionSecure",
  description: "Reset your password",
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
            <p className="text-gray-600">We'll help you reset your password</p>
          </div>

          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}
