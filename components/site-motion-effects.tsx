"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

const SECTION_SELECTOR = "main section"
const MEDIA_SELECTOR = "main a img, main article img, main .group img"
const CARD_SELECTOR = "main article, main a.group"
const PRESSABLE_SELECTOR = 'main a[class*="rounded"], main button[class*="rounded"]'

/** Adds progressive, page-wide motion without changing the content structure. */
export function SiteMotionEffects() {
  const pathname = usePathname()

  useEffect(() => {
    // The admin area is a productivity surface: keep it stable and distraction-free.
    if (pathname.startsWith("/admin")) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const sections = Array.from(document.querySelectorAll<HTMLElement>(SECTION_SELECTOR))
    const cards = Array.from(document.querySelectorAll<HTMLElement>(CARD_SELECTOR))
    const pressables = Array.from(document.querySelectorAll<HTMLElement>(PRESSABLE_SELECTOR))
    const mediaOwners = new Set<HTMLElement>()

    document.querySelectorAll<HTMLImageElement>(MEDIA_SELECTOR).forEach((image) => {
      const owner = image.closest<HTMLElement>("a, article, .group")
      if (owner) mediaOwners.add(owner)
    })

    cards.forEach((card) => card.classList.add("vs-motion-card"))
    pressables.forEach((item) => item.classList.add("vs-motion-pressable"))
    mediaOwners.forEach((owner) => owner.classList.add("vs-motion-media"))

    if (reducedMotion || !("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("vs-reveal", "is-visible"))
      return () => {
        cards.forEach((card) => card.classList.remove("vs-motion-card"))
        pressables.forEach((item) => item.classList.remove("vs-motion-pressable"))
        mediaOwners.forEach((owner) => owner.classList.remove("vs-motion-media"))
        sections.forEach((section) => section.classList.remove("vs-reveal", "is-visible"))
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add("is-visible")
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    )

    sections.forEach((section, index) => {
      section.classList.add("vs-reveal")
      if (index === 0) section.classList.add("is-visible")
      else observer.observe(section)
    })

    return () => {
      observer.disconnect()
      cards.forEach((card) => card.classList.remove("vs-motion-card"))
      pressables.forEach((item) => item.classList.remove("vs-motion-pressable"))
      mediaOwners.forEach((owner) => owner.classList.remove("vs-motion-media"))
      sections.forEach((section) => section.classList.remove("vs-reveal", "is-visible"))
    }
  }, [pathname])

  return null
}
