import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AboutSlider } from "@/components/about/about-slider"

export const metadata: Metadata = { title: "About VisionSecure Smart Technologies | Security & IT Solutions", description: "Learn about VisionSecure Smart Technologies, our vision, mission, security solutions and commitment to reliable technology and professional support.", openGraph: { title: "About VisionSecure Smart Technologies", description: "Security and technology solutions designed around real-world needs." } }

export default function AboutPage() {
  return <main className="min-h-screen bg-background"><Navbar /><AboutSlider /><Footer /></main>
}
