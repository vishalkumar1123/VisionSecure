"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { FaWhatsapp } from "react-icons/fa"

const slides = [
  {
    image: "/images/CCTV_Camera.png",
    headline: "Smart Security Solutions for Your Safety",
    subheading: "Protect your home and business with advanced CCTV surveillance systems",
    accent: "CCTV Surveillance",
  },
  {
    image: "/images/Essl_Biom.png",
    headline: "Advanced Biometric & Access Control",
    subheading: "Secure your premises with fingerprint, face recognition & card access systems",
    accent: "Biometric Systems",
  },
  {
    image: "/images/Smart_home.png",
    headline: "Complete Smart Home Automation",
    subheading: "Control your security, lighting, and appliances from anywhere",
    accent: "Home Automation",
  },
  {
    image: "/images/Networking_blog.png",
    headline: "Professional Networking Solutions",
    subheading: "Reliable structured cabling and network infrastructure for your business",
    accent: "Networking",
  },
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const nextSlide = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setTimeout(() => setIsAnimating(false), 600)
  }, [isAnimating])

  const prevSlide = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setTimeout(() => setIsAnimating(false), 600)
  }, [isAnimating])

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000)
    return () => clearInterval(timer)
  }, [nextSlide])

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {slides.map((slide, index) => <div key={slide.image} aria-hidden={index !== currentSlide} className={cn("absolute inset-0 transition-opacity duration-1000", index === currentSlide ? "opacity-100" : "opacity-0")}>
        <Image src={slide.image} alt={slide.accent} fill sizes="100vw" className="object-cover object-center" priority={index === 0} />
      </div>)}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/10" />
      <div className="container mx-auto px-4 lg:px-8 pt-24 lg:pt-32 relative z-10">
        <div className="flex items-center min-h-[calc(100vh-8rem)]">
          {/* Content */}
          <div className="max-w-2xl space-y-8 py-24 text-white">
            <div
              key={currentSlide}
              className="space-y-6 animate-slide-up"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/25 border border-white/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                <span className="text-sm font-medium text-lime-300">{slides[currentSlide].accent}</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight text-balance">
                {slides[currentSlide].headline}
              </h1>

              <p className="text-lg lg:text-xl text-white/85 max-w-xl leading-relaxed">
                {slides[currentSlide].subheading}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 h-14 text-base font-semibold shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link href="/contact">Get Free Site Visit</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 h-14 text-base font-semibold border-white/40 bg-black/25 text-white hover:bg-black/45 hover:scale-105 transition-all duration-300"
                asChild
              >
                <a href="https://wa.me/919872133840" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp className="h-5 w-5 text-lime-300" />
                  WhatsApp Now
                </a>
              </Button>
            </div>

            {/* Slide Navigation */}
            <div className="flex items-center gap-6 pt-8">
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full border border-white/40 bg-black/25 text-white hover:bg-black/45 hover:border-accent/50 transition-all duration-300"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full border border-white/40 bg-black/25 text-white hover:bg-black/45 hover:border-accent/50 transition-all duration-300"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!isAnimating) {
                        setIsAnimating(true)
                        setCurrentSlide(index)
                        setTimeout(() => setIsAnimating(false), 600)
                      }
                    }}
                    className={cn(
                      "h-2 rounded-full transition-all duration-500",
                      index === currentSlide
                        ? "w-8 bg-accent"
                        : "w-2 bg-white/40 hover:bg-white/70"
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in">
        <span className="text-xs text-white/85 uppercase tracking-widest">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-accent rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
