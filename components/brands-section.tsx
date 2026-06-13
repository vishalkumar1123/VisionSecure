"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const brands = [
  { name: "CP Plus", logo: "CP+" },
  { name: "Hikvision", logo: "HIKVISION" },
  { name: "Dahua", logo: "DAHUA" },
  { name: "IMOU", logo: "IMOU" },
  { name: "EZVIZ", logo: "EZVIZ" },
  { name: "Tenda", logo: "TENDA" },
  { name: "TP-Link", logo: "TP-LINK" },
  { name: "ESSL", logo: "ESSL" },
  { name: "Honeywell", logo: "HONEYWELL" },
  { name: "Tapo", logo: "TAPO" },
]

export function BrandsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-16 lg:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-secondary/30" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={cn(
          "text-center mb-12 lg:mb-16 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Trusted Partners
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground text-balance">
            We Work With The Best Brands
          </h2>
        </div>

        {/* Brands Marquee */}
        <div className="relative overflow-hidden">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-20 lg:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 lg:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          {/* Scrolling Container */}
          <div className="flex animate-marquee">
            {[...brands, ...brands].map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="flex-shrink-0 mx-4 lg:mx-8"
              >
                <div className="group flex items-center justify-center w-32 h-16 lg:w-40 lg:h-20 rounded-xl bg-card/50 border border-border/50 hover:border-accent/50 hover:bg-card transition-all duration-300">
                  <span className="font-display text-sm lg:text-base font-bold text-muted-foreground group-hover:text-accent transition-colors tracking-wider">
                    {brand.logo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
