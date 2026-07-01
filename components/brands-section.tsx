"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Sahi kiya hua unique brands array
const brands = [
  { name: "CP Plus", logoPath: "/images/brands/cpplus_logo.png" },
  { name: "Hikvision", logoPath: "/images/brands/hikvision_logo.png" },
  { name: "Dahua", logoPath: "/images/brands/DAHUA_logo.png" },
  { name: "IMOU", logoPath: "/images/brands/Imou_logo.png" },
  { name: "EZVIZ", logoPath: "/images/brands/EZVIZ_logo.png" },
  { name: "Tenda", logoPath: "/images/brands/TENDA_logo.png" },
  { name: "TP-Link", logoPath: "/images/brands/Tp-Link_logo.png" }, 
  { name: "ESSL", logoPath: "/images/brands/ESSL_logo.png" },
  { name: "Honeywell", logoPath: "/images/brands/HONEYWELL_logo.png" },
  { name: "Tapo", logoPath: "/images/brands/tapo_logo.png" },
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
            {/* Duplicating the array for infinite scroll effect */}
            {[...brands, ...brands].map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="flex-shrink-0 mx-4 lg:mx-8"
              >
                {/* Logo Card with Hover Effects */}
                <div className="group flex items-center justify-center w-36 h-20 lg:w-44 lg:h-24 rounded-xl bg-card/40 border border-border/40 hover:border-accent/40 hover:bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 p-4">
                  <div className="relative w-full h-full opacity-60 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all duration-300">
                    <Image
                      src={brand.logoPath}
                      alt={`${brand.name} Logo`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 144px, 176px"
                      priority={index < 6} // First few images load immediately for performance
                    />
                  </div>
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