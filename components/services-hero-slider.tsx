"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import {
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react"

import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"

const slides = [
  {
    title: "Advanced CCTV Surveillance Solutions",
    subtitle:
      "Protect your home, office, warehouse, school, and commercial property with smart AI-powered CCTV surveillance systems and remote monitoring solutions.",
    image: "/images/service-cctv.png",
  },

  {
    title: "Smart Biometric Attendance Systems",
    subtitle:
      "Fingerprint and face recognition systems for secure employee attendance tracking and intelligent access management.",
    image: "/images/essl.jpg",
  },

  {
    title: "Access Control & Smart Entry Solutions",
    subtitle:
      "Secure your premises using RFID systems, smart locks, boom barriers, and intelligent access control technologies.",
    image: "/images/FL200.png",
  },

  {
    title: "Professional Networking Solutions",
    subtitle:
      "Enterprise-grade WiFi setup, structured cabling, server configuration, and secure networking infrastructure.",
    image: "/images/service-networking.jpg",
  },

  {
    title: "Smart Home Automation Solutions",
    subtitle:
      "Control lighting, curtains, climate, appliances, and security systems with advanced smart home automation.",
    image: "/images/service-automation.jpg",
  },

  {
    title: "Video Door Phone Security Systems",
    subtitle:
      "HD video door phones with mobile connectivity, two-way communication, and smart entrance security.",
    image: "/images/Door bell.jpg",
  },

  {
    title: "Advanced Fire Alarm Systems",
    subtitle:
      "Reliable fire detection systems with smoke sensors, emergency alerts, and complete fire safety protection.",
    image: "/images/smoke.jpeg",
  },

  {
    title: "AMC & Maintenance Services",
    subtitle:
      "Professional AMC services for CCTV, networking, fire alarm systems, biometric devices, and security infrastructure.",
    image: "/images/AMC.png",
  },
]

export function ServicesHeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

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

      {/* Background Slider */}
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
            className="object-cover transition-transform duration-[7000ms] scale-105 hover:scale-110"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/75" />

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-blue-950/70 to-black/60" />

          {/* Glow Effects */}
          <div className="absolute -top-24 right-0 h-[450px] w-[450px] rounded-full bg-blue-500/20 blur-3xl animate-pulse" />

          <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-3xl animate-pulse" />
        </motion.div>

      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-20 flex h-full items-center">

        <div className="container mx-auto px-4 lg:px-8">

          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >

            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-300 backdrop-blur-md">

              <ShieldCheck className="h-4 w-4" />

              VisionSecure Smart Technologies

            </div>

            {/* Heading */}
            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-7xl">

              {slides[currentSlide].title}

            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300 lg:text-xl">

              {slides[currentSlide].subtitle}

            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">

              <Button
                size="lg"
                className="rounded-full bg-blue-600 px-8 text-white shadow-2xl shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:bg-blue-700"
                asChild
              >
                <Link href="/contact">

                  Get Free Consultation

                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/30 bg-white/10 px-8 text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20"
                asChild
              >
                <a
                  href="https://wa.me/919872133840"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat on WhatsApp
                </a>
              </Button>

            </div>

            {/* Features */}
            <div className="mt-12 grid grid-cols-2 gap-4 text-sm text-zinc-300 lg:grid-cols-4">

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/10">

                <div className="flex items-center gap-2">

                  <CheckCircle2 className="h-4 w-4 text-green-400" />

                  500+ Installations

                </div>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/10">

                <div className="flex items-center gap-2">

                  <CheckCircle2 className="h-4 w-4 text-green-400" />

                  Trusted Brands

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

                  PAN India Support

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-blue-600"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-blue-600"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slider Dots */}
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

    </section>
  )
}