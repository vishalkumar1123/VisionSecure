import { pageMetadata } from "@/lib/seo"
// app/gallery/page.tsx


import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { GalleryHeroSlider } from "@/components/gallery-hero-slider"
import { GalleryPageContent } from "@/components/gallery-page-content"

export const metadata = pageMetadata("/gallery")

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