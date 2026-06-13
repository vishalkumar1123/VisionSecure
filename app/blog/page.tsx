// app/blog/page.tsx

import type { Metadata } from "next"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { BlogHeroSlider } from "@/components/blog-hero-slider"
import { BlogPageContent } from "@/components/blog-page-content"

export const metadata: Metadata = {
  title: "Blog & News | VisionSecure Smart Technologies",

  description:
    "Read the latest news, security tips, CCTV guides, home automation updates, biometric solutions, and smart technology insights.",

  keywords: [
    "CCTV Blog",
    "Security Tips",
    "Home Automation",
    "Biometric Systems",
    "Networking Solutions",
    "VisionSecure Smart Technologies",
    "Smart Security Blog",
    "Lucknow CCTV Services",
  ],
}

export default function BlogPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">

      {/* NAVBAR */}
      <Navbar />

      {/* HERO SLIDER */}
      <BlogHeroSlider />

      {/* BLOG CONTENT */}
      <BlogPageContent />

      {/* FOOTER */}
      <Footer />

    </main>
  )
}