import { pageMetadata } from "@/lib/seo"
// app/projects/page.tsx


import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { ProjectsHeroSlider } from "@/components/projects-hero-slider"
import { ProjectsPageContent } from "@/components/projects-page-content"

export const metadata = pageMetadata("/projects")

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-background overflow-hidden">

      <Navbar />

      {/* HERO SLIDER */}
      <ProjectsHeroSlider />

      {/* PROJECTS CONTENT */}
      <ProjectsPageContent />

      <Footer />

    </main>
  )
}