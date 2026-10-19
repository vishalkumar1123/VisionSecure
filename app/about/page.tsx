import { pageMetadata } from "@/lib/seo"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AboutSlider } from "@/components/about/about-slider"

export const metadata = pageMetadata("/about")

export default function AboutPage() {
  return <main className="min-h-screen bg-background"><Navbar /><AboutSlider /><Footer /></main>
}
