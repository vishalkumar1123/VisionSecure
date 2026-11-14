import Link from "next/link"
import { pageMetadata } from "@/lib/seo"
export const metadata = pageMetadata("/")
import { Navbar } from "@/components/navbar"
import { HeroSlider } from "@/components/hero-slider"
import { TrustSection } from "@/components/trust-section"
import { ServicesSection } from "@/components/services-section"
import { WhyChooseUs } from "@/components/why-choose-us"
import { TestimonialsSection } from "@/components/testimonials-section"
import { BrandsSection } from "@/components/brands-section"
import { CTABanner } from "@/components/cta-banner"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { LeadPopup } from "@/components/lead-popup"
import { OfficeMap } from "@/components/office-map"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <a href="#home" className="sr-only fixed left-4 top-4 z-[10000] rounded-lg bg-background p-3 text-foreground focus:not-sr-only">Skip to main content</a>
      <Navbar />
      <HeroSlider />
      <TrustSection />      
      <ServicesSection />
      <section className="page-container pb-16 text-center [&>p]:mx-auto [&>p]:max-w-4xl" aria-labelledby="planning-heading">
        <h2 id="planning-heading" className="text-3xl font-bold">Plan the right system for your Lucknow property</h2>
        <p className="mt-4 leading-7 text-muted-foreground">Whether you are starting a new installation or improving an existing one, begin with the rooms, entry points and people using the system. Share your full site address, existing equipment and the problem you want to solve. Equipment selection and quotation depend on layout, capacity, cabling and compatibility.</p>
        <p className="mt-4 leading-7 text-muted-foreground">For camera coverage and recording, read our <Link href="/services/cctv-surveillance" className="underline">CCTV planning guidance</Link>. For wired points, use our <Link href="/services/networking-solutions" className="underline">LAN and structured cabling guidance</Link>; for staff reporting, see <Link href="/services/biometric-attendance" className="underline">attendance system guidance</Link>. If you need help with equipment already installed, review <Link href="/services/it-support-amc" className="underline">maintenance scope and AMC questions</Link> before requesting support.</p>
        <h3 className="mt-6 text-xl font-semibold">Which service should I choose for my property?</h3>
        <p className="mt-3 leading-7 text-muted-foreground">CCTV addresses camera coverage and recording. <Link href="/services/access-control-system" className="underline underline-offset-4">Access control</Link> manages entry permissions, while biometric attendance records staff attendance. Wired LAN points and <Link href="/services/wifi-mesh-networking" className="underline underline-offset-4">Wi-Fi and mesh coverage</Link> solve different connectivity needs. Select the main problem in <Link href="/contact" className="underline underline-offset-4">your enquiry</Link> and mention any related systems so compatibility and the installation scope can be assessed together.</p>
      </section>
      <WhyChooseUs />
      <TestimonialsSection />
      <BrandsSection />
      <CTABanner />
      <ContactSection />
      <section className="page-container pb-20"><OfficeMap /></section>
      <Footer />
      <LeadPopup />
    </main>
  )
}
