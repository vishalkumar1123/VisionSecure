"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import AdminSidebar from "@/components/admin-sidebar"
import { NotificationBell } from "@/components/admin/notifications/NotificationBell"
import { usePathname, useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react"

import { Menu, Search } from "lucide-react"
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [drawer,setDrawer] = useState(false)
  const [search,setSearch] = useState("")
  const searchRef = useRef<HTMLInputElement>(null)
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

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); searchRef.current?.focus() } }
    window.addEventListener("keydown", shortcut)
    return () => window.removeEventListener("keydown", shortcut)
  }, [])

  // The sign-in page is intentionally outside the back-office shell.
  if (pathname === "/admin/login") return <>{children}</>

  // Do not render protected page content while the session is being checked or
  // after an unauthenticated user has requested an admin URL.
  if (!isAdmin && !authorizedOnce.current) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-sm text-muted-foreground">
        Checking secure access…
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">

      <div className="sticky top-0 hidden h-screen w-60 shrink-0 lg:block"><AdminSidebar /></div>

      <main className="min-w-0 flex-1 bg-secondary/40 p-3 sm:p-5 lg:p-6">
        <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card p-2 sm:gap-3 sm:p-3">
          <Sheet open={drawer} onOpenChange={setDrawer}><SheetTrigger asChild><button aria-label="Open admin navigation" className="flex h-11 w-11 items-center justify-center rounded-lg border border-border lg:hidden"><Menu size={20}/></button></SheetTrigger><SheetContent side="left" className="w-[min(280px,90vw)] gap-0 p-0"><SheetTitle className="sr-only">Admin navigation</SheetTitle><SheetDescription className="sr-only">Navigate VisionSecure management pages</SheetDescription><AdminSidebar onNavigate={()=>setDrawer(false)}/></SheetContent></Sheet>
          <form role="search" className="order-last flex w-full items-center gap-2 sm:order-none sm:min-w-0 sm:flex-1" onSubmit={event=>{event.preventDefault();router.push(`/admin/leads?q=${encodeURIComponent(search.trim())}`)}}><input ref={searchRef} aria-label="Search leads" value={search} onChange={event=>setSearch(event.target.value)} maxLength={100} placeholder="Search leads by name, phone, email or service" className="h-11 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm"/><button aria-label="Submit lead search" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted"><Search size={18}/></button></form>
          <div className="ml-auto flex items-center gap-2"><ThemeToggle/><NotificationBell/><span aria-label="Account avatar" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-bold text-brand-green">{(session?.user?.name || "Admin").trim().split(/\s+/).map(part=>part[0]).slice(0,2).join("")}</span><div className="hidden border-l border-border pl-3 md:block"><p className="max-w-40 truncate text-sm font-semibold">{session?.user?.name || "Admin"}</p><p className="text-xs capitalize text-muted-foreground">{session?.user?.role?.replaceAll("_"," ")}</p></div></div>
        </div>
        {children}
      </main>

    </div>
  )
}
