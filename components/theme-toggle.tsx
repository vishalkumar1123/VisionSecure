"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const dark = mounted && resolvedTheme === "dark"
  const label = mounted ? `Switch to ${dark ? "light" : "dark"} mode` : "Change color theme"
  return <button type="button" disabled={!mounted} onClick={() => setTheme(dark ? "light" : "dark")}
    className="theme-toggle inline-flex shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    aria-label={label} title={label}>
    {dark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
  </button>
}

export function StandaloneThemeToggle() {
  const path = usePathname()
  if (!(path === "/admin/login" || path === "/profile" || path === "/register")) return null
  return <div className="fixed right-4 top-4 z-50"><ThemeToggle /></div>
}
