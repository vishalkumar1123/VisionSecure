"use client"

import AdminSidebar from "@/components/admin-sidebar"
import { NotificationBell } from "@/components/admin/notifications/NotificationBell"
import { usePathname, useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { useEffect, useRef } from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const authorizedOnce = useRef(false)

  const isAdmin =
    session?.user?.role === "admin" ||
    session?.user?.role === "super_admin"

  useEffect(() => {
    if (isAdmin) authorizedOnce.current = true
    if (status === "unauthenticated") authorizedOnce.current = false
  }, [isAdmin, status])

  useEffect(() => {
    if (pathname === "/admin/login") return

    if (status === "unauthenticated" || (status === "authenticated" && !isAdmin)) {
      router.replace("/admin/login")
    }
  }, [isAdmin, pathname, router, status])

  useEffect(() => {
    if (pathname === "/admin/login" || status !== "authenticated" || !isAdmin) return

    let idleTimer: number
    let lastServerSync = Date.now()

    const logoutForInactivity = () => {
      void signOut({ callbackUrl: "/admin/login?reason=inactive" })
    }

    const resetIdleTimer = () => {
      window.clearTimeout(idleTimer)
      idleTimer = window.setTimeout(logoutForInactivity, 5 * 60_000)

      // Refresh the signed JWT at most once every 15 seconds. The proxy and
      // protected APIs use this signed timestamp to enforce the same timeout.
      if (Date.now() - lastServerSync >= 15_000) {
        lastServerSync = Date.now()
        void update()
      }
    }

    const events: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "scroll", "touchstart"]
    events.forEach((event) => window.addEventListener(event, resetIdleTimer, { passive: true }))
    resetIdleTimer()

    return () => {
      window.clearTimeout(idleTimer)
      events.forEach((event) => window.removeEventListener(event, resetIdleTimer))
    }
  }, [isAdmin, pathname, status, update])

  // The sign-in page is intentionally outside the back-office shell.
  if (pathname === "/admin/login") return <>{children}</>

  // Do not render protected page content while the session is being checked or
  // after an unauthenticated user has requested an admin URL.
  if (!isAdmin && !authorizedOnce.current) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#071528] px-4 text-sm text-slate-300">
        Checking secure access…
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#04101f]">

      <AdminSidebar />

      <main className="flex-1 overflow-auto p-8">
        <div className="mb-4 flex justify-end">
          <NotificationBell />
        </div>
        {children}
      </main>

    </div>
  )
}
