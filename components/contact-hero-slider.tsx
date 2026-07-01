// components/contact-hero-slider.tsx

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
} from "lucide-react"

import { Button } from "@/components/ui/button"

const slides = [
  {
    title: "Get Professional Security Solutions",
    subtitle:
      "Connect with VisionSecure Smart Technologies for CCTV installation, biometric systems, networking, fire alarm systems, and smart security solutions.",
    image: "/images/hero-contact.jpg",
  },
  {
    title: "Free Site Visit & Consultation",
    subtitle:
      "Our experts provide free security assessment and customized solutions for homes, offices, schools, hospitals, and industries.",
    image: "/images/service-cctv.jpg",
  },
  {
    title: "24/7 Support & Maintenance Services",
    subtitle:
      "Professional AMC services, technical support, remote assistance, and fast response for all your security systems.",
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
    }, 5000)

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
    <section className="relative h-[95vh] overflow-hidden bg-black">

      {/* BACKGROUND SLIDER */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            fill
            priority
            className="object-cover"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-black/75" />

          {/* GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-blue-950/70 to-black/60" />

          {/* GLOW EFFECTS */}
          <div className="absolute -top-24 right-0 h-[450px] w-[450px] rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-blue-500/10 blur-3xl" />
        </motion.div>
      </AnimatePresence>

      {/* CONTENT */}
      <div className="relative z-20 flex h-full items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            {/* BADGE */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm font-medium text-cyan-300 backdrop-blur-md">
              <ShieldCheck className="h-4 w-4" />
              VisionSecure Smart Technologies
            </div>

            {/* HEADING */}
            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-7xl">
              {slides[currentSlide].title}
            </h1>

            {/* SUBTITLE */}
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300 lg:text-xl">
              {slides[currentSlide].subtitle}
            </p>

            {/* BUTTONS */}
            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                size="lg"
                className="rounded-full bg-cyan-500 px-8 text-black shadow-2xl shadow-cyan-500/30 transition-all duration-300 hover:scale-105 hover:bg-cyan-400"
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
                className="rounded-full border-white/30 bg-white/10 px-8 text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20"
                asChild
              >
                <a href="tel:+919872133840">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </a>
              </Button>
            </div>

            {/* FEATURES */}
            <div className="mt-12 grid grid-cols-2 gap-4 text-sm text-zinc-300 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Free Consultation
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Expert Engineers
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Fast Support
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/10">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-cyan-400" />
                  Lucknow, UP
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* LEFT BUTTON */}
      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-cyan-500 hover:text-black"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* RIGHT BUTTON */}
      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-cyan-500 hover:text-black"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* DOTS */}
      <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 ${
              currentSlide === index
                ? "h-3 w-10 rounded-full bg-cyan-500"
                : "h-3 w-3 rounded-full bg-white/40 hover:bg-white"
            }`}
          />
        ))}
      </div>

      {/* SCROLL DOWN */}
      <div className="absolute bottom-20 left-1/2 z-30 -translate-x-1/2 animate-bounce">
        <Link
          href="#contact-section"
          className="flex flex-col items-center text-sm text-white/80 transition hover:text-white"
        >
          <span>Scroll Down</span>
          <ArrowRight className="mt-2 h-4 w-4 rotate-90" />
        </Link>
      </div>

    </section>
  )
}