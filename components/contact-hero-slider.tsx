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
    <section className="relative h-[95vh] w-full overflow-hidden bg-slate-950">

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
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-transparent" />

          {/* DYNAMIC GLOW ORBS */}
          <div className="absolute -top-24 right-0 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
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
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-xs sm:text-sm font-semibold text-cyan-400 backdrop-blur-md shadow-inner shadow-cyan-500/5">
                <ShieldCheck className="h-4 w-4 animate-pulse" />
                VisionSecure Smart Technologies
              </div>

              {/* HEADING */}
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl leading-[1.1] text-balance">
                {slides[currentSlide].title}
              </h1>

              {/* SUBTITLE */}
              <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-zinc-300 font-medium">
                {slides[currentSlide].subtitle}
              </p>

              {/* CALL TO ACTIONS */}
              <div className="mt-10 flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="rounded-full bg-cyan-500 px-8 py-6 text-base font-bold text-slate-950 shadow-xl shadow-cyan-500/20 transition-all duration-300 hover:scale-105 hover:bg-cyan-400"
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
                  className="rounded-full border-white/20 bg-white/5 px-8 py-6 text-base font-bold text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-white/40"
                  asChild
                >
                  <a href="tel:+919872133840">
                    <Phone className="mr-2 h-5 w-5" />
                    Call Now
                  </a>
                </Button>
              </div>

              {/* KEY HIGHLIGHTS WITH PROPER GOOGLE MAPS INTEGRATION */}
              <div className="mt-14 grid grid-cols-2 gap-4 text-xs sm:text-sm text-zinc-300 lg:grid-cols-4">
                <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/20 hover:bg-slate-900/60">
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                    <span>Free Consultation</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/20 hover:bg-slate-900/60">
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                    <span>Expert Engineers</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/20 hover:bg-slate-900/60">
                  <div className="flex items-center gap-2 font-medium">
                    <Wrench className="h-4 w-4 flex-shrink-0 text-cyan-400" />
                    <span>Same-Day Support</span>
                  </div>
                </div>

                {/* प्रॉपर एड्रेस विथ एक्टिव गूगल मैप नेविगेशन लिंक */}
                <a 
                  href="https://maps.google.com/?q=VisionSecure+Smart+Technologies+Lucknow" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-500/15 group block cursor-pointer"
                >
                  <div className="flex items-center gap-2 font-bold text-cyan-300 group-hover:text-white transition-colors">
                    <MapPin className="h-4 w-4 flex-shrink-0 text-cyan-400 group-hover:animate-bounce" />
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
        className="absolute left-5 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-950/40 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-500"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-5 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-950/40 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-500"
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
                ? "h-2.5 w-10 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/50"
                : "h-2.5 w-2.5 rounded-full bg-white/20 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* SCROLL DOWN INDICATOR */}
      <div className="absolute bottom-16 left-1/2 z-30 -translate-x-1/2 hidden md:block">
        <Link
          href="#contact-section"
          className="flex flex-col items-center text-xs font-semibold uppercase tracking-widest text-white/50 transition hover:text-cyan-400 group"
        >
          <span className="mb-2">Explore Form</span>
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/30 p-1 group-hover:border-cyan-500/50">
            <motion.div 
              animate={{ y: [0, 14, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="h-2 w-1.5 rounded-full bg-white group-hover:bg-cyan-400"
            />
          </div>
        </Link>
      </div>

    </section>
  )
}