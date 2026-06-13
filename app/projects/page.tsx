// app/projects/page.tsx

import type { Metadata } from "next"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { ProjectsHeroSlider } from "@/components/projects-hero-slider"
import { ProjectsPageContent } from "@/components/projects-page-content"

export const metadata: Metadata = {
  title: "Our Projects | VisionSecure Smart Technologies",
  description:
    "Explore our portfolio of CCTV, biometric, networking, fire alarm, access control, and smart security projects across Lucknow and Uttar Pradesh.",
}

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