"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  UserCog,
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
]

export default function AdminSidebar() {

  const pathname = usePathname()

  return (
    <aside className="flex min-h-screen w-[280px] flex-col border-r border-white/10 bg-zinc-950">

      {/* HEADER */}
      <div className="border-b border-white/10 p-6">

        <h2 className="text-3xl font-bold tracking-tight text-white">
          VisionSecure
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          Admin Panel
        </p>

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
                href={menu.href}
                className={`group flex items-center gap-4 rounded-2xl px-4 py-3 text-[15px] font-medium transition-all duration-300
                
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
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

        </nav>

      </div>

      {/* FOOTER */}
      <div className="border-t border-white/10 p-4">

        <button
          onClick={() =>
            signOut({
              callbackUrl: "/admin/login",
            })
          }
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-600 px-4 py-3 font-medium text-white transition-all duration-300 hover:bg-red-700"
        >
          <LogOut className="h-5 w-5" />

          Logout
        </button>

      </div>

    </aside>
  )
}