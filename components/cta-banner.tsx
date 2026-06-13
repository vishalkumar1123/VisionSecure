"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Phone, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

export function CTABanner() {
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
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent/80" />
      
      {/* Animated Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-white/10 rounded-full blur-2xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className={cn(
          "max-w-4xl mx-auto text-center transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {/* Icon */}
          <div className="inline-flex p-4 rounded-full bg-white/10 backdrop-blur-sm mb-8">
            <Shield className="h-10 w-10 text-white" />
          </div>
          
          {/* Content */}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 text-balance leading-tight">
            Ready to Secure Your Property?
          </h2>
          <p className="text-lg lg:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Get a free site visit and customized security plan from our experts. No obligations, just solutions.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 rounded-full px-8 h-14 text-base font-semibold shadow-lg shadow-black/20 hover:scale-105 transition-all duration-300"
              asChild
            >
              <a href="/contact">
                Get Free Site Visit
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 rounded-full px-8 h-14 text-base font-semibold hover:scale-105 transition-all duration-300"
              asChild
            >
              <a href="tel:+919872133840">
                <Phone className="mr-2 h-5 w-5" />
                Call Now
              </a>
            </Button>
          </div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span>Free Consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span>Expert Installation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span>Warranty Included</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
