import type { Metadata } from "next"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { ServicesHeroSlider } from "@/components/services-hero-slider"
import { ServicesPageContent } from "@/components/services-page-content"

export const metadata: Metadata = {
  title: "Our Services | VisionSecure Smart Technologies",
  description:
    "Comprehensive security solutions including CCTV surveillance, biometric systems, access control, networking, fire alarm systems, home automation, and AMC services in Lucknow.",
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background overflow-hidden">

      {/* Navbar */}
      <Navbar />

      {/* Hero Slider */}
      <ServicesHeroSlider />

      {/* Services Content */}
      <ServicesPageContent />

      {/* Footer */}
      <Footer />

    </main>
  )
}