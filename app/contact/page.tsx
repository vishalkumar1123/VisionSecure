import { pageMetadata } from "@/lib/seo"
// app/contact/page.tsx


import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { ContactHeroSlider } from "@/components/contact-hero-slider"
import { ContactPageContent } from "@/components/contact-page-content"

export const metadata = pageMetadata("/contact")

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string | string[] }> }) {
  const selected = (await searchParams).service
  const initialService = typeof selected === "string" ? selected : ""
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      
      {/* NAVBAR */}
      <Navbar />

      {/* HERO SLIDER */}
      <ContactHeroSlider />

      {/* CONTACT CONTENT */}
      <ContactPageContent initialService={initialService} />

      {/* FOOTER */}
      <Footer />

    </main>
  )
}