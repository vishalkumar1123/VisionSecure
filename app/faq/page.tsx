import { pageMetadata } from "@/lib/seo"
// app/faq/page.tsx


import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { FAQHeroSlider } from "@/components/faq-hero-slider"
import { FAQPageContent } from "@/components/faq-page-content"

export const metadata = pageMetadata("/faq")

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