// app/gallery/page.tsx

import type { Metadata } from "next"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { GalleryHeroSlider } from "@/components/gallery-hero-slider"
import { GalleryPageContent } from "@/components/gallery-page-content"

export const metadata: Metadata = {
  title: "Gallery | VisionSecure Smart Technologies",

  description:
    "Explore our gallery of CCTV installations, biometric systems, fire alarm systems, networking projects, smart home automation, and security solutions across Lucknow and Uttar Pradesh.",

  keywords: [
    "VisionSecure Gallery",
    "CCTV Installation Gallery",
    "Security System Images",
    "Biometric Projects",
    "Fire Alarm Installations",
    "Smart Home Automation",
    "Networking Projects",
    "Lucknow CCTV Projects",
  ],
}

export default function GalleryPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">

      {/* NAVBAR */}
      <Navbar />

      {/* HERO SLIDER */}
      <GalleryHeroSlider />

      {/* GALLERY CONTENT */}
      <GalleryPageContent />

      {/* FOOTER */}
      <Footer />

    </main>
  )
}