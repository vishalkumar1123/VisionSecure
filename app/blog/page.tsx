import { pageMetadata } from "@/lib/seo"
// app/blog/page.tsx


import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { BlogHeroSlider } from "@/components/blog-hero-slider"
import BlogPageContent from "@/components/blog-page-content"

export const metadata = pageMetadata("/blog")

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