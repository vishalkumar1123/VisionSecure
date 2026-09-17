"use client"

import { useEffect, useState } from "react"
import { FaWhatsapp } from "react-icons/fa" 
import Image from "next/image"
import Link from "next/link"

import { motion, AnimatePresence } from "framer-motion"
import {
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Wrench,
} from "lucide-react"

import { Button } from "@/components/ui/button"

const slides = [
  {
    title: "Get Professional Security Solutions",
    subtitle:
      "Connect with VisionSecure Smart Technologies for CCTV installation, biometric systems, networking, fire alarm systems, and smart security solutions.",
    image: "/images/Essl_Biom.png",
  },
  {
    title: "Free Site Visit & Consultation",
    subtitle:
      "Our experts provide free security assessment and customized solutions for homes, offices, schools, hospitals, and industries.",
    image: "/images/CCTV_Camera.png",
  },
  {
    title: "Same-Day Quick Maintenance Support", // 24/7 की जगह प्रैक्टिकल और अट्रैक्टिव टेक्स्ट
    subtitle:
      "Get reliable on-site technical support, annual maintenance contracts (AMC), rapid troubleshooting, and system upgrades within hours.",
    image: "/images/AMC.png",
  },
  {
    title: "Advanced Smart Security Systems",
    subtitle:
      "Secure your property with modern CCTV surveillance, access control, fire alarms, and home automation technologies.",
    image: "/images/service-automation.jpg",
  },
]

export function ContactHeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 6000) // स्लाइड बदलने का समय थोड़ा सा बढ़ाया (6s) ताकि यूजर आराम से पढ़ सके

    return () => clearInterval(interval)
  }, [currentSlide])

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    )
  }

  return (
    <section className="relative h-[95vh] w-full overflow-hidden bg-background">

      {/* BACKGROUND SLIDER WITH ANIMATION */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            fill
            priority
            className="object-cover object-center transform"
          />

          {/* DUAL LAYER CINEMATIC OVERLAY */}
          <div className="absolute inset-0 bg-background/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-transparent" />

          {/* DYNAMIC GLOW ORBS */}
          <div className="absolute -top-24 right-0 h-[500px] w-[500px] rounded-full bg-highlight/15 blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* CONTENT LAYER */}
      <div className="relative z-20 flex h-full items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-4xl"
            >
              {/* BRAND BADGE */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-highlight/30 bg-highlight/10 px-5 py-2 text-xs sm:text-sm font-semibold text-highlight-ink backdrop-blur-md shadow-inner shadow-cyan-500/5">
                <ShieldCheck className="h-4 w-4 animate-pulse" />
                VisionSecure Smart Technologies
              </div>

              {/* HEADING */}
              <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-7xl leading-[1.1] text-balance">
                {slides[currentSlide].title}
              </h1>

              {/* SUBTITLE */}
              <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground font-medium">
                {slides[currentSlide].subtitle}
              </p>

              {/* CALL TO ACTIONS */}
              <div className="mt-10 flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="rounded-full bg-highlight px-8 py-6 text-base font-bold text-accent-foreground shadow-xl shadow-cyan-500/20 transition-all duration-300 hover:scale-105 hover:bg-highlight"
                  asChild
                >
                  <a
                    href="https://wa.me/919872133840"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp className="mr-2 h-5 w-5" />
                    WhatsApp Us
                  </a>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-border bg-card/5 px-8 py-6 text-base font-bold text-foreground backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-card/10 hover:border-border"
                  asChild
                >
                  <a href="tel:+919872133840">
                    <Phone className="mr-2 h-5 w-5" />
                    Call Now
                  </a>
                </Button>
              </div>

              {/* KEY HIGHLIGHTS WITH PROPER GOOGLE MAPS INTEGRATION */}
              <div className="mt-14 grid grid-cols-2 gap-4 text-xs sm:text-sm text-muted-foreground lg:grid-cols-4">
                <div className="rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-highlight/20 hover:bg-card/60">
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-brand-green" />
                    <span>Free Consultation</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-highlight/20 hover:bg-card/60">
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-brand-green" />
                    <span>Expert Engineers</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-highlight/20 hover:bg-card/60">
                  <div className="flex items-center gap-2 font-medium">
                    <Wrench className="h-4 w-4 flex-shrink-0 text-highlight-ink" />
                    <span>Same-Day Support</span>
                  </div>
                </div>

                {/* प्रॉपर एड्रेस विथ एक्टिव गूगल मैप नेविगेशन लिंक */}
                <a 
                  href="https://maps.google.com/?q=VisionSecure+Smart+Technologies+Lucknow" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-highlight/20 bg-highlight/5 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-highlight/15 group block cursor-pointer"
                >
                  <div className="flex items-center gap-2 font-bold text-highlight-ink group-hover:text-foreground transition-colors">
                    <MapPin className="h-4 w-4 flex-shrink-0 text-highlight-ink group-hover:animate-bounce" />
                    <span>Lucknow, UP, India</span>
                  </div>
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* NAVIGATION CONTROLS (ARROWS WITH PREMIUM HOVER) */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-5 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/40 text-foreground backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-highlight hover:text-foreground hover:border-highlight"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-5 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/40 text-foreground backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-highlight hover:text-foreground hover:border-highlight"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* DOT INDICATORS */}
      <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all duration-500 ${
              currentSlide === index
                ? "h-2.5 w-10 rounded-full bg-highlight shadow-lg shadow-cyan-500/50"
                : "h-2.5 w-2.5 rounded-full bg-card/20 hover:bg-card/50"
            }`}
          />
        ))}
      </div>

      {/* SCROLL DOWN INDICATOR */}
      <div className="absolute bottom-16 left-1/2 z-30 -translate-x-1/2 hidden md:block">
        <Link
          href="#contact-section"
          className="flex flex-col items-center text-xs font-semibold uppercase tracking-widest text-foreground/50 transition hover:text-highlight-ink group"
        >
          <span className="mb-2">Explore Form</span>
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-border p-1 group-hover:border-highlight/50">
            <motion.div 
              animate={{ y: [0, 14, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="h-2 w-1.5 rounded-full bg-card group-hover:bg-highlight"
            />
          </div>
        </Link>
      </div>

    </section>
  )
}