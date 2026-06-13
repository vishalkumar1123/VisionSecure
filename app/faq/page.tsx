// app/faq/page.tsx

import type { Metadata } from "next"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { FAQHeroSlider } from "@/components/faq-hero-slider"
import { FAQPageContent } from "@/components/faq-page-content"

export const metadata: Metadata = {
  title: "Frequently Asked Questions | VisionSecure Smart Technologies",

  description:
    "Find answers to common questions about CCTV installation, biometric systems, access control, networking, fire alarm systems, AMC services, and smart security solutions.",

  keywords: [
    "FAQ",
    "CCTV FAQ",
    "Biometric FAQ",
    "Security System Questions",
    "Fire Alarm FAQ",
    "AMC Services",
    "VisionSecure Smart Technologies",
    "Lucknow CCTV Installation",
  ],
}

export default function FAQPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">

      {/* NAVBAR */}
      <Navbar />

      {/* HERO SLIDER */}
      <FAQHeroSlider />

      {/* FAQ CONTENT */}
      <FAQPageContent />

      {/* FOOTER */}
      <Footer />

    </main>
  )
}