"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { StandaloneThemeToggle } from "@/components/theme-toggle"

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" storageKey="visionsecure-theme" enableSystem disableTransitionOnChange>
        {children}
        <StandaloneThemeToggle />
      </ThemeProvider>
    </SessionProvider>
  )
}