"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { homeSlides } from "@/lib/home-slides"
import { cn } from "@/lib/utils"

export function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [ready, setReady] = useState(false)
  const [paused, setPaused] = useState(false)
  const [interacting, setInteracting] = useState(false)
  const [firstImageReady, setFirstImageReady] = useState(false)
  const [loadOthers, setLoadOthers] = useState(false)
  const slide = homeSlides[current]
  useEffect(() => {
    setReady(true)
    setPaused(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])
  useEffect(() => {
    if (!ready || paused || interacting) return
    const timer = setInterval(() => setCurrent(index => (index + 1) % homeSlides.length), 8000)
    return () => clearInterval(timer)
  }, [ready, paused, interacting])
  // Keep the first image high priority and other images outside the critical queue.
  useEffect(() => {
    if (!firstImageReady) return
    if ("requestIdleCallback" in window) {
      const task = window.requestIdleCallback(() => setLoadOthers(true), { timeout: 1500 })
      return () => window.cancelIdleCallback(task)
    }
    const task = setTimeout(() => setLoadOthers(true), 150)
    return () => clearTimeout(task)
  }, [firstImageReady])

  return (
    <section id="home" onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocusCapture={() => setInteracting(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setInteracting(false) }} tabIndex={-1} aria-labelledby="home-heading" className="relative isolate overflow-hidden bg-[#061b32] pt-[72px] text-white">
      <h1 id="home-heading" className="relative z-10 border-y border-white/20 bg-[#061b32] px-4 py-4 text-center font-display text-lg font-bold sm:text-xl lg:text-2xl">
        Security, Networking &amp; Smart Solutions in Lucknow
      </h1>
      <div className="relative min-h-[650px]">
        {homeSlides.map((item, index) => (
          <div key={item.slug} aria-hidden={current !== index} className={cn("absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none", current === index ? "z-[1] opacity-100" : "pointer-events-none opacity-0")}>
            <Link href={`/services/${item.slug}`} tabIndex={current === index ? 0 : -1} aria-label={`${item.label} service details from banner image`} className="absolute inset-0 block focus-visible:outline focus-visible:outline-4 focus-visible:outline-inset focus-visible:outline-accent">{(index === 0 || loadOthers || current === index) && <Image src={item.image} alt={item.alt} fill sizes="100vw" className="object-cover object-center" priority={index === 0} fetchPriority={index === 0 ? "high" : "low"} onLoad={index === 0 ? () => setFirstImageReady(true) : undefined} />}</Link>
          </div>
        ))}
        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-[#03182e]/95 via-[#03182e]/85 to-black/30" />
        <div className="page-container pointer-events-none relative z-10 py-12 sm:py-16 lg:py-20">
          <div id="home-service-panel" className="pointer-events-auto max-w-3xl" aria-live="polite" aria-atomic="true">
            <p className="inline-flex rounded-full border border-lime-300 px-4 py-2 text-sm font-bold uppercase tracking-wide text-lime-300">{slide.accent}</p>
            <h2 className="mt-6 font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{slide.headline}</h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">{slide.description}</p>
            <div className="mt-7 flex flex-wrap gap-4">
              <Link href={`/contact?service=${slide.slug}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-6 py-3 font-bold text-accent-foreground transition hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">{slide.enquiry}</Link>
              <Link href={`/services/${slide.slug}`} className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-white/80 bg-black/20 px-6 py-3 font-bold text-white transition hover:bg-black/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">{slide.explore}</Link>
            </div>
          </div>
          <div className="pointer-events-auto mt-10 flex flex-wrap gap-3 pr-16 sm:pr-0 lg:mt-14" role="group" aria-label="Choose a service">
            {homeSlides.map((item, index) => <button key={item.slug} type="button" disabled={!ready} aria-pressed={current === index} aria-controls="home-service-panel" onClick={() => setCurrent(index)} className={cn("min-h-11 rounded-full border-2 px-5 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white", current === index ? "border-accent bg-accent text-accent-foreground" : "border-white/80 bg-black/20 text-white hover:bg-white/15")}>{item.label}</button>)}
          </div>
          <div className="pointer-events-auto mt-5 flex flex-wrap items-center gap-3 text-sm">
            <button type="button" disabled={!ready} onClick={() => { setPaused(true); setCurrent(index => (index + homeSlides.length - 1) % homeSlides.length) }} aria-label="Previous service slide" className="min-h-11 rounded-full border border-white/60 px-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">Previous</button>
            <button type="button" disabled={!ready} onClick={() => setPaused(value => !value)} aria-label={paused ? "Play service slideshow" : "Pause service slideshow"} className="min-h-11 rounded-full border border-white/60 px-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">{paused ? "Play slideshow" : "Pause slideshow"}</button>
            <button type="button" disabled={!ready} onClick={() => { setPaused(true); setCurrent(index => (index + 1) % homeSlides.length) }} aria-label="Next service slide" className="min-h-11 rounded-full border border-white/60 px-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">Next</button>
          </div>
          <a href="https://wa.me/919872133840" target="_blank" rel="noopener noreferrer" className="pointer-events-auto mt-6 inline-block rounded text-sm font-semibold text-white underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">Discuss your requirement on WhatsApp</a>
        </div>
      </div>
    </section>
  )
}
