"use client"

import Image from "next/image"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (!result) {
        setError("Unable to sign in. Please try again.")
        return
      }

      if (result.error) {
        setError("Invalid email or password.")

        return
      }

      router.refresh()
      router.push("/admin/dashboard")
    } catch (err) {
      console.error(err)
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#071528] px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,199,233,0.2),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(37,119,230,0.22),_transparent_40%)]" />
      <form
        onSubmit={handleLogin}
        className="relative w-full max-w-md rounded-[30px] border border-white/25 bg-white/10 p-8 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-10"
      >
        <div className="mb-8 text-center">
          <Image src="/images/Visionsecuretech_logo.png" alt="VisionSecure Smart Technologies" width={190} height={64} priority className="mx-auto mb-5 h-14 w-auto object-contain" />
          <h1 className="text-3xl font-bold tracking-wide text-white">Secure Admin Portal</h1>
          <p className="mt-2 text-sm text-slate-300">Authorized VisionSecure staff only</p>
        </div>

        <div className="space-y-5">
          <label className="block">
            <span className="sr-only">Username or email address</span>
            <div className="flex h-[52px] items-center rounded-full border border-white/25 bg-slate-950/20 px-4 shadow-sm transition focus-within:border-cyan-300 focus-within:ring-2 focus-within:ring-cyan-300/20">
              <UserRound aria-hidden="true" className="mr-3 h-5 w-5 shrink-0 text-cyan-100" />
              <input
                type="email"
                placeholder="username / email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-full w-full bg-transparent text-white outline-none placeholder:text-slate-300"
                autoComplete="username"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="sr-only">Password</span>
            <div className="flex h-[52px] items-center rounded-full border border-white/25 bg-slate-950/20 px-4 shadow-sm transition focus-within:border-cyan-300 focus-within:ring-2 focus-within:ring-cyan-300/20">
              <LockKeyhole aria-hidden="true" className="mr-3 h-5 w-5 shrink-0 text-cyan-100" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-full w-full bg-transparent text-white outline-none placeholder:text-slate-300"
                autoComplete="current-password"
                required
              />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="rounded-md p-2 text-slate-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff aria-hidden="true" className="h-5 w-5" /> : <Eye aria-hidden="true" className="h-5 w-5" />}
              </button>
            </div>
          </label>

          {error && (
            <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-full bg-white font-bold tracking-wide text-[#071528] transition hover:bg-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : "LOG IN"}
          </button>

          <p className="text-center text-xs text-slate-300">
            Need help accessing your account? Contact an administrator.
          </p>
        </div>
      </form>
    </main>
  )
}
