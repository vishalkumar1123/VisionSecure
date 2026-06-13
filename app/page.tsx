import { Navbar } from "@/components/navbar"
import { HeroSlider } from "@/components/hero-slider"
import { TrustSection } from "@/components/trust-section"
import { AboutSection } from "@/components/about-section"
import { ServicesSection } from "@/components/services-section"
import { WhyChooseUs } from "@/components/why-choose-us"
import { ProjectsSection } from "@/components/projects-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { BrandsSection } from "@/components/brands-section"
import { CTABanner } from "@/components/cta-banner"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { LeadPopup } from "@/components/lead-popup"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSlider />
      <TrustSection />
      <AboutSection />
      <ServicesSection />
      <WhyChooseUs />
      <ProjectsSection />
      <TestimonialsSection />
      <BrandsSection />
      <CTABanner />
      <ContactSection />
      <Footer />
      <LeadPopup />
    </main>
  )
}
