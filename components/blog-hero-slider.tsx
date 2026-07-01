// components/blog-hero-slider.tsx

"use client"

import { useEffect, useState } from "react"

import Image from "next/image"
import Link from "next/link"

import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Newspaper,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"

import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"

const slides = [
  {
    title: "Latest Security News & Technology Insights",

    subtitle:
      "Stay updated with CCTV technology trends, security innovations, smart automation systems, and surveillance solutions.",

    image: "/images/hero-blog.jpg",
  },

  {
    title: "Smart CCTV Installation Guides",

    subtitle:
      "Learn how to choose the best CCTV cameras, improve surveillance coverage, and secure your home or business effectively.",

    image: "/images/CCTV_Camera.png",
  },

  {
    title: "Biometric & Access Control Solutions",

    subtitle:
      "Explore modern biometric attendance systems, face recognition devices, and intelligent access control technologies.",

    image: "/images/service-biometric.jpg",
  },

  {
    title: "Home Automation & Smart Security",

    subtitle:
      "Discover advanced smart home technologies, automation systems, networking infrastructure, and IoT security.",

    image: "/images/service-automation.jpg",
  },
]

export function BlogHeroSlider() {
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
    <section className="relative h-[92vh] overflow-hidden bg-black">

      {/* BACKGROUND */}
      <AnimatePresence mode="wait">

        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.08 }}
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

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-black/75" />

          {/* GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-blue-950/70 to-black/60" />

          {/* GLOW EFFECTS */}
          <div className="absolute -top-24 right-0 h-[450px] w-[450px] rounded-full bg-blue-500/20 blur-3xl" />

          <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-3xl" />

        </motion.div>

      </AnimatePresence>

      {/* CONTENT */}
      <div className="relative z-20 flex h-full items-center">

        <div className="container mx-auto px-4 lg:px-8">

          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >

            {/* BADGE */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-300 backdrop-blur-md">

              <ShieldCheck className="h-4 w-4" />

              VisionSecure Smart Technologies

            </div>

            {/* TITLE */}
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
                className="group rounded-full bg-blue-600 px-8 text-white shadow-2xl shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:bg-blue-700"
                asChild
              >
                <Link href="/contact">

                  Contact Us

                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />

                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/30 bg-white/10 px-8 text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20"
                asChild
              >
                <Link href="/services">

                  Explore Services

                </Link>
              </Button>

            </div>

            {/* FEATURES */}
            <div className="mt-12 grid grid-cols-2 gap-4 text-sm text-zinc-300 lg:grid-cols-4">

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/10">

                <div className="flex items-center gap-2">

                  <CheckCircle2 className="h-4 w-4 text-green-400" />

                  Security Tips

                </div>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/10">

                <div className="flex items-center gap-2">

                  <CheckCircle2 className="h-4 w-4 text-green-400" />

                  Latest Trends

                </div>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/10">

                <div className="flex items-center gap-2">

                  <CheckCircle2 className="h-4 w-4 text-green-400" />

                  Smart Solutions

                </div>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/10">

                <div className="flex items-center gap-2">

                  <CheckCircle2 className="h-4 w-4 text-green-400" />

                  Expert Guidance

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </div>

      {/* LEFT BUTTON */}
      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-blue-600"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* RIGHT BUTTON */}
      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-blue-600"
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
                ? "h-3 w-10 rounded-full bg-blue-500"
                : "h-3 w-3 rounded-full bg-white/40 hover:bg-white"
            }`}
          />
        ))}

      </div>

      {/* SCROLL FADE */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      {/* FLOATING ICON */}
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
        className="absolute bottom-24 right-10 hidden lg:flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md"
      >

        <Newspaper className="h-8 w-8 text-blue-400" />

      </motion.div>

    </section>
  )
}