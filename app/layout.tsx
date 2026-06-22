import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Providers from "@/components/providers"
import { Toaster } from "sonner"

import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
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
      className="dark scroll-smooth"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-black text-white`}
      >
         <Providers>
          {children}
          <Toaster richColors position="top-right" />
         </Providers>

        {process.env.NODE_ENV === "production" && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
        
      </body>
    </html>
  )
}
