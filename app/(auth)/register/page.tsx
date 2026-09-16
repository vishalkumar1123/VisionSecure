import { RegisterForm } from "@/components/auth/RegisterForm"

export const metadata = {
  title: "Register | VisionSecure",
  description: "Create a new account",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
            <p className="text-muted-foreground">Join VisionSecure Smart Technologies</p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
