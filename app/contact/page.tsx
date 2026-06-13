// app/contact/page.tsx

import type { Metadata } from "next"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { ContactHeroSlider } from "@/components/contact-hero-slider"
import { ContactPageContent } from "@/components/contact-page-content"

export const metadata: Metadata = {
  title: "Contact Us | VisionSecure Smart Technologies",

  description:
    "Get in touch with VisionSecure Smart Technologies for CCTV installation, biometric systems, fire alarm systems, networking, smart home automation, and complete security solutions in Lucknow.",

  keywords: [
    "Contact VisionSecure",
    "CCTV Installation Lucknow",
    "Biometric Systems",
    "Security Solutions",
    "Fire Alarm Systems",
    "Smart Home Automation",
    "Access Control",
    "Networking Services",
    "VisionSecure Smart Technologies",
  ],
}

export default function ContactPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      
      {/* NAVBAR */}
      <Navbar />

      {/* HERO SLIDER */}
      <ContactHeroSlider />

      {/* CONTACT CONTENT */}
      <ContactPageContent />

      {/* FOOTER */}
      <Footer />

    </main>
  )
}