"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  UserCog,
  History,
} from "lucide-react"

const menus = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },

  {
    title: "Leads",
    href: "/admin/leads",
    icon: Users,
  },

  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },

  {
    title: "Users",
    href: "/admin/users",
    icon: UserCog,
  },

  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  { title: "Activity Log", href: "/admin/activity-logs", icon: History },
]

export default function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {

  const pathname = usePathname()

  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-r border-border bg-sidebar">

      {/* HEADER */}
      <div className="border-b border-border p-5">
        <Link href="/admin/dashboard" className="block rounded-xl bg-white p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-highlight" aria-label="VisionSecure Admin Dashboard">
          <Image src="/images/Visionsecuretech_logo.png" alt="VisionSecure Smart Technologies" width={230} height={64} priority className="h-12 w-auto object-contain" />
        </Link>
        <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[.2em] text-muted-foreground">Admin Panel</p>
      </div>

      {/* MENU */}
      <div className="flex-1 overflow-y-auto p-4">

        <nav className="space-y-2">

          {menus.map((menu) => {

            const Icon = menu.icon

            const isActive =
              pathname === menu.href ||
              pathname.startsWith(menu.href + "/")

            return (
              <Link
                key={menu.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                href={menu.href}
                className={`group flex items-center gap-4 rounded-2xl px-4 py-3 text-[15px] font-medium transition-all duration-300
                
                ${
                  isActive
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }
                `}
              >
                <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />

                <span>
                  {menu.title}
                </span>
              </Link>
            )
          })}

          <details open={pathname.startsWith("/admin/website-analytics")} className="rounded-2xl border border-border p-2">
            <summary className="cursor-pointer px-2 py-3 text-sm font-semibold">Website &amp; Marketing</summary>
            <div className="space-y-1">{[["", "Website Overview"], ["/traffic", "Traffic Analytics"], ["/search", "Google Search"], ["/keywords", "Keywords"], ["/pages", "Pages"], ["/indexing", "Indexing"], ["/performance", "Site Performance"]].map(([suffix, title]) => <Link key={suffix} href={`/admin/website-analytics${suffix}`} onClick={onNavigate} aria-current={pathname === `/admin/website-analytics${suffix}` ? "page" : undefined} className={`block rounded-xl px-3 py-2 text-sm ${pathname === `/admin/website-analytics${suffix}` ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"}`}>{title}</Link>)}</div>
          </details>
          <details open={pathname.startsWith("/admin/customer-center") || pathname === "/admin/inbox"} className="rounded-2xl border border-border p-2"><summary className="cursor-pointer px-2 py-3 text-sm font-semibold">Customer Center</summary><div className="space-y-1">{[["/admin/inbox", "Inbox"], ["/admin/customer-center/customers", "Customers"], ["/admin/customer-center/requests", "Requests"], ["/admin/customer-center/knowledge", "AI Knowledge"], ["/admin/customer-center/agent", "AI Agent"], ["/admin/settings/integrations", "Integrations"]].map(([href, title]) => <Link key={href} href={href} onClick={onNavigate} aria-current={pathname === href ? "page" : undefined} className={`block rounded-xl px-3 py-2 text-sm ${pathname === href ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"}`}>{title}</Link>)}</div></details>
        </nav>

      </div>

      {/* FOOTER */}
      <div className="border-t border-border p-4">

        <button
          onClick={() =>
            signOut({
              callbackUrl: "/admin/login",
            })
          }
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-destructive px-4 py-3 font-medium text-destructive-foreground transition-all duration-300 hover:bg-destructive"
        >
          <LogOut className="h-5 w-5" />

          Logout
        </button>

      </div>

    </aside>
  )
}
