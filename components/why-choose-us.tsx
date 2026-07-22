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
    title: "Dedicated Technical Support",
    description: "Our professional team is always ready to assist you with quick troubleshooting, timely maintenance, system upgrades, and emergency issues."
  },
  {
    icon: Users,
    title: "Expert Technicians",
    description: "Certified professionals with hands-on experience in CCTV installation, networking, automation, and enterprise security systems."
  },
  {
    icon: Clock,
    title: "Quick Response Time",
    description: "Fast installation and rapid service response to ensure your security systems remain operational without downtime."
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
    // Pure Transparent Background - यह नीचे वाले पैरेंट कंटेनर का बैकग्राउंड ले लेगा
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden bg-transparent">
      
      {/* Dynamic Moving Subtle Tech Grid (Transparent Backdrop Layer) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.12] bg-[linear-gradient(to_right,#94a3b8_1px,transparent_1px),linear-gradient(to_bottom,#94a3b8_1px,transparent_1px)] bg-[size:3rem_3rem] animate-grid-drift" />
      
      {/* Soft & Vibrant Light Glowing Orbs (Floating Behind Content) */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[130px] -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[130px] translate-x-1/3 translate-y-1/3 pointer-events-none" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side Content */}
          <div className={cn(
            "transition-all duration-700",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          )}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/20">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight text-balance">
              Why Businesses & Homeowners Trust VisionSecure Smart Technologies
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 font-medium mb-8 max-w-xl leading-relaxed">
              We combine advanced security technology, expert installation, and dependable support to deliver customized protection solutions for homes, offices, retail stores, and industries.
            </p>
            
            {/* Key Points with Light Transparent Badges */}
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
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/10 flex items-center justify-center border border-blue-600/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <span className="text-slate-800 dark:text-zinc-200 font-semibold text-sm sm:text-base">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Pure Transparent Glassmorphism Features Grid */}
          <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className={cn(
                    // bg-white/10 (Light Mode) और dark:bg-white/5 (Dark Mode) पूरी तरह ट्रांसपेरेंट इफ़ेक्ट देता है
                    "group p-6 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-md border border-slate-200/40 dark:border-zinc-800/50 shadow-sm hover:border-blue-500/40 hover:bg-white/40 dark:hover:bg-zinc-900/40 transition-all duration-500 hover:-translate-y-1.5",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Icon Wrapper */}
                  <div className="inline-flex p-3 rounded-xl bg-blue-500/10 border border-blue-500/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 group-hover:shadow-md group-hover:shadow-blue-600/20 transition-all duration-300 mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <h3 className="font-bold text-slate-950 dark:text-white mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 font-medium leading-relaxed">
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