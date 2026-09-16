import type { Metadata } from "next"
import { Inter, Manrope } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Providers from "@/components/providers"
import { Toaster } from "@/components/ui/sonner"
import GoogleAnalytics from "@/components/google-analytics"
import ClarityProvider from "@/components/clarity"
import Schema from "@/components/schema"
import { FloatingSupport } from "@/components/floating-support"
import { SiteMotionEffects } from "@/components/site-motion-effects"

import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://visionsecuretech.in"),
  title:
    "VisionSecure Smart Technologies | CCTV, Biometric & Security Solutions",

  description:
    "Protect your home and business with advanced CCTV surveillance, biometric attendance, access control systems, and smart home automation solutions.",

  keywords: [
    "CCTV camera",
    "Security systems",
    "Biometric attendance",
    "Access control",
    "Home automation",
    "Surveillance",
    "India",
  ],

  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],

    apple: "/apple-icon.png",
  },

  openGraph: {
    title: "VisionSecure Smart Technologies",

    description:
      "Smart Security Solutions for Homes & Businesses",

    type: "website",

    siteName: "VisionSecure Smart Technologies",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className="scroll-smooth"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body
        className={`${inter.variable} ${manrope.variable} font-sans antialiased`}
      >
      <ClarityProvider />
       <Schema />
         <Providers>
          <SiteMotionEffects />
          {children}
          <FloatingSupport />
          <Toaster richColors position="top-right" />
         </Providers>
         <GoogleAnalytics />
        {process.env.NODE_ENV === "production" && <Analytics />}
        
      </body>
    </html>
  )
}
