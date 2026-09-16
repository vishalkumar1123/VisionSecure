// components/gallery-hero-slider.tsx

"use client"

import { useEffect, useState } from "react"

import Image from "next/image"
import Link from "next/link"

import { motion, AnimatePresence } from "framer-motion"

import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Camera,
  ArrowRight,
  CheckCircle2,
  ImageIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"

const slides = [
  {
    title: "Our Security Installation Gallery",
    subtitle:
      "Explore our premium CCTV, biometric, networking, fire alarm, and smart automation projects installed across homes, offices, schools, hospitals, and industries.",
    image: "/images/gallery-1.jpg",
  },

  {
    title: "Professional CCTV Installations",
    subtitle:
      "Advanced surveillance systems with HD cameras, AI analytics, night vision, and remote monitoring solutions.",
    image: "/images/service-cctv.png",
  },

  {
    title: "Smart Biometric & Access Control",
    subtitle:
      "Modern attendance systems, smart locks, boom barriers, and intelligent access management solutions.",
    image: "/images/Essl_Biom.png",
  },

  {
    title: "Networking & Server Infrastructure",
    subtitle:
      "Reliable structured cabling, WiFi networking, server rooms, and enterprise-grade infrastructure setup.",
    image: "/images/Networking_blog.png",
  },

  {
    title: "Smart Home & Automation Solutions",
    subtitle:
      "Luxury smart home automation with lighting control, video door phones, and integrated security systems.",
      image: "/images/Smart_home.png",
    },
]

export function GalleryHeroSlider() {
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
    <section className="relative h-[95vh] overflow-hidden bg-background">

      {/* BACKGROUND */}
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
          <div className="absolute inset-0 bg-background/75" />

          {/* GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/90 to-background/70" />

          {/* GLOW EFFECTS */}
          <div className="absolute -top-20 right-0 h-[450px] w-[450px] rounded-full bg-primary/20 blur-3xl" />

          <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-highlight/10 blur-3xl" />

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
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-medium text-brand-ink backdrop-blur-md">

              <ShieldCheck className="h-4 w-4" />

              VisionSecure Smart Technologies

            </div>

            {/* TITLE */}
            <h1 className="text-4xl font-extrabold leading-tight text-foreground sm:text-5xl lg:text-7xl">

              {slides[currentSlide].title}

            </h1>

            {/* SUBTITLE */}
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground lg:text-xl">

              {slides[currentSlide].subtitle}

            </p>

            {/* BUTTONS */}
            <div className="mt-10 flex flex-wrap gap-4">

              <Button
                size="lg"
                className="rounded-full bg-primary px-8 text-foreground shadow-2xl shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:bg-primary"
                asChild
              >
                <Link href="/contact">

                  Get Free Consultation

                  <ArrowRight className="ml-2 h-5 w-5" />

                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-border bg-card/10 px-8 text-foreground backdrop-blur-md transition-all duration-300 hover:bg-card/20"
                asChild
              >
                <Link href="/services">

                  View Our Services

                </Link>
              </Button>

            </div>

            {/* FEATURES */}
            <div className="mt-12 grid grid-cols-2 gap-4 text-sm text-muted-foreground lg:grid-cols-4">

              <div className="rounded-2xl border border-border bg-card/5 p-4 backdrop-blur-md">

                <div className="flex items-center gap-2">

                  <CheckCircle2 className="h-4 w-4 text-brand-green" />

                  150+ Projects

                </div>

              </div>

              <div className="rounded-2xl border border-border bg-card/5 p-4 backdrop-blur-md">

                <div className="flex items-center gap-2">

                  <Camera className="h-4 w-4 text-highlight-ink" />

                  HD Installations

                </div>

              </div>

              <div className="rounded-2xl border border-border bg-card/5 p-4 backdrop-blur-md">

                <div className="flex items-center gap-2">

                  <ImageIcon className="h-4 w-4 text-status-pink" />

                  Real Project Gallery

                </div>

              </div>

              <div className="rounded-2xl border border-border bg-card/5 p-4 backdrop-blur-md">

                <div className="flex items-center gap-2">

                  <CheckCircle2 className="h-4 w-4 text-brand-green" />

                  Trusted Support

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </div>

      {/* LEFT BUTTON */}
      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/40 text-foreground backdrop-blur-md transition-all duration-300 hover:bg-primary"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* RIGHT BUTTON */}
      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/40 text-foreground backdrop-blur-md transition-all duration-300 hover:bg-primary"
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
                ? "h-3 w-10 rounded-full bg-primary"
                : "h-3 w-3 rounded-full bg-card/40 hover:bg-card"
            }`}
          />
        ))}

      </div>

    </section>
  )
}