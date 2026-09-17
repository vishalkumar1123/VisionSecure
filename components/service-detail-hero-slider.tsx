"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

type ServiceDetailHeroSliderProps = {
  title: string
  category: string
  summary: string
  image: string
  solutions: string[]
  benefits: string[]
}

export function ServiceDetailHeroSlider({
  title,
  category,
  summary,
  image,
  solutions,
  benefits,
}: ServiceDetailHeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduceMotion = useReducedMotion()
  const slides = [
    { eyebrow: category, title: `${title} Solutions`, description: summary },
    { eyebrow: "Explore options", title: solutions.slice(0, 2).join(" & "), description: `We help select the right setup based on your site, usage and requirement.` },
    { eyebrow: "Plan with confidence", title: "Installation and support that fits your site.", description: benefits.slice(0, 2).join(" • ") },
  ]

  useEffect(() => {
    if (reduceMotion || paused) return
    const timer = window.setInterval(() => setCurrentSlide((slide) => (slide + 1) % slides.length), 6000)
    return () => window.clearInterval(timer)
  }, [paused, reduceMotion, slides.length])

  const changeSlide = (direction: 1 | -1) => {
    setCurrentSlide((slide) => (slide + direction + slides.length) % slides.length)
  }

  return (
    <section onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)} onKeyDown={(event) => { if (event.key === "ArrowLeft") changeSlide(-1); if (event.key === "ArrowRight") changeSlide(1) }} className="relative isolate min-h-[640px] overflow-hidden bg-background pt-24 text-foreground sm:min-h-[680px]" aria-roledescription="carousel" aria-label={`${title} highlights`}>
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentSlide}
          initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={image}
            alt={`${title} solution overview`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-background/98 via-background/60 to-background/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(8,168,232,.2),transparent_28%)]" />
        </motion.div>
      </AnimatePresence>

      <div className="page-container relative z-10 flex min-h-[640px] items-center py-20 sm:min-h-[680px]">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-highlight/30 bg-highlight/10 px-4 py-2 text-sm font-semibold text-highlight-ink backdrop-blur">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            {slides[currentSlide].eyebrow}
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{title} Solutions</h1>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: reduceMotion ? 0 : 0.35 }}
              className="mt-5"
            >
              <p className="max-w-2xl font-display text-xl font-semibold text-highlight-ink sm:text-2xl">{slides[currentSlide].title}</p>
              <p className="mt-4 max-w-2xl text-base leading-7 text-foreground sm:text-lg">{slides[currentSlide].description}</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/contact?service=${encodeURIComponent(title)}`} className="rounded-xl bg-accent px-5 py-3 font-semibold text-accent-foreground shadow-[0_8px_22px_rgba(121,201,20,.25)] transition hover:-translate-y-0.5 hover:bg-brand-hover">
              Get free site visit
            </Link>
            <Link href="/services" className="rounded-lg border border-border bg-card/10 px-5 py-3 font-semibold backdrop-blur transition hover:bg-card/20">
              Explore services
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2" aria-label="Hero slides">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`Show slide ${index + 1}: ${slide.title}`}
            aria-current={currentSlide === index ? "true" : undefined}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight ${currentSlide === index ? "w-9 bg-highlight" : "w-2.5 bg-card/50 hover:bg-card"}`}
          />
        ))}
      </div>
      <div className="absolute bottom-5 right-4 z-10 flex gap-2 sm:right-8">
        <button type="button" onClick={() => changeSlide(-1)} aria-label="Previous slide" className="rounded-full border border-border bg-background/45 p-3 backdrop-blur transition hover:bg-card/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-highlight"><ChevronLeft className="h-5 w-5" /></button>
        <button type="button" onClick={() => changeSlide(1)} aria-label="Next slide" className="rounded-full border border-border bg-background/45 p-3 backdrop-blur transition hover:bg-card/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-highlight"><ChevronRight className="h-5 w-5" /></button>
      </div>
      {!reduceMotion && !paused && <div key={currentSlide} className="absolute inset-x-0 bottom-0 z-10 h-1 origin-left animate-[service-progress_6s_linear_forwards] bg-highlight" aria-hidden="true" />}
    </section>
  )
}
