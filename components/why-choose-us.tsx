"use client"

import { useEffect, useRef, useState } from "react"
import { CheckCircle2, Headphones, Shield, Clock, Award, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: Shield,
    title: "Premium Quality Products",
    description: "We use trusted brands like CP Plus, IMOU, Prama, Tp-Link, Hikvision, Dahua, and TP-Link to deliver durable, high-performance security systems with long-term reliability."
  },
  {
    icon: Headphones,
    title: "24/7 Technical Support",
    description: "Our support team is always ready to assist with troubleshooting, maintenance, upgrades, and emergency technical issues."
  },
  {
    icon: Users,
    title: "Expert Technicians",
    description: "Certified professionals with hands-on experience in CCTV installation, networking, automation, and enterprise security systems."
  },
  {
    icon: Clock,
    title: "Quick Response Time",
    description: "Fast installation and rapid service response to ensure your security systems remain operational without downtime.."
  },
  {
    icon: Award,
    title: "Warranty & AMC",
    description: "Comprehensive warranty coverage and Annual Maintenance Contracts for hassle-free system performance and long-term peace of mind."
  },
  {
    icon: CheckCircle2,
    title: "Customized Solutions",
    description: "Tailor-made security systems designed according to your property size, business requirements, and safety priorities."
  },
]

export function WhyChooseUs() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[128px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[128px] translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className={cn(
            "transition-all duration-700",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          )}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              Why Choose Us
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
             Why Businesses & Homeowners Trust VisionSecure Smart Technologies
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              We combine advanced security technology, expert installation, and dependable support to deliver customized protection solutions for homes, offices, retail stores, and industries.
            </p>
            
            {/* Key Points */}
            <div className="space-y-4">
              {["Industry-leading technology", "Transparent pricing", "Local support team"].map((point, index) => (
                <div 
                  key={point}
                  className={cn(
                    "flex items-center gap-3 transition-all duration-500",
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  )}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-foreground font-medium">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className={cn(
                    "group p-5 lg:p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-accent/50 hover:bg-card transition-all duration-500 hover:-translate-y-1",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex p-2.5 rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300 mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
