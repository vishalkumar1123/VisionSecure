import { pageMetadata } from "@/lib/seo"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { ServicesHeroSlider } from "@/components/services-hero-slider"
import { ServicesPageContent } from "@/components/services-page-content"

export const metadata = pageMetadata("/services")

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