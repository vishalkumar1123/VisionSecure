"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Camera, 
  Fingerprint, 
  KeyRound, 
  Wifi, 
  DoorOpen, 
  Flame, 
  Home,
  ArrowRight 
} from "lucide-react"
import { cn } from "@/lib/utils"

const services = [
  {
    icon: Camera,
    title: "CCTV Surveillance",
    description: "24/7 HD surveillance systems with remote mobile monitoring, night vision, cloud backup, and smart security alerts for homes and businesses.",
    features: ["HD/4K Resolution", "Night Vision", "Mobile App Access", "Cloud Storage"],
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    icon: Fingerprint,
    title: "Biometric Systems",
    description: "Advanced fingerprint, RFID, and face recognition systems for secure attendance management and employee access control.",
    features: ["Face Recognition", "Fingerprint Scan", "RFID Cards", "Attendance Reports"],
    color: "from-emerald-500/20 to-teal-500/20"
  },
  {
    icon: KeyRound,
    title: "Access Control",
    description: "Intelligent access systems with smart locks, biometric entry, RFID cards, and centralized security management.",
    features: ["Smart Locks", "Keypad Entry", "Time-based Access", "Visitor Management"],
    color: "from-orange-500/20 to-amber-500/20"
  },
  {
    icon: Wifi,
    title: "Networking Solutions",
    description: "High-speed networking infrastructure including routers, switches, WiFi systems, structured cabling, and enterprise connectivity.",
    features: ["High-Speed WiFi", "Network Security", "Structured Cabling", "Remote Support"],
    color: "from-purple-500/20 to-pink-500/20"
  },
  {
    icon: DoorOpen,
    title: "Video Door Phones",
    description: "Smart video intercom systems that allow secure visitor communication and remote door monitoring from anywhere.",
    features: ["HD Video", "Two-way Audio", "Mobile Alerts", "Night Vision"],
    color: "from-rose-500/20 to-red-500/20"
  },
  {
    icon: Flame,
    title: "Fire Alarm Systems",
    description: "Reliable fire detection and alarm systems designed to protect lives, assets, and businesses with instant emergency alerts.",
    features: ["Smoke Detection", "Heat Sensors", "Instant Alerts", "Emergency Response"],
    color: "from-red-500/20 to-orange-500/20"
  },
  {
    icon: Home,
    title: "Home Automation",
    description: "Smart automation solutions for lighting, climate control, appliances, and security management through mobile devices.",
    features: ["Smart Lighting", "Climate Control", "Voice Control", "Energy Saving"],
    color: "from-cyan-500/20 to-blue-500/20"
  },
]

export function ServicesSection() {
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
    <section id="services" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={cn(
          "max-w-3xl mx-auto text-center mb-16 lg:mb-20 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Smart Security Solutions for Modern Homes & Businesses
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced CCTV surveillance, biometric systems, networking, automation, and enterprise-grade security solutions tailored to protect what matters most.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={service.title}
                className={cn(
                  "group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-accent/50 transition-all duration-500 hover:-translate-y-2",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${index * 75}ms` }}
              >
                {/* Gradient Background on Hover */}
                <div className={cn(
                  "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                  service.color
                )} />
                
                <div className="relative space-y-4">
                  {/* Icon */}
                  <div className="inline-flex p-3 rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  {/* Content */}
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {service.features.slice(0, 3).map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 text-xs rounded-md bg-secondary text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  {/* CTA */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto text-accent hover:text-accent/80 group/btn"
                    asChild
                  >
                    <a href="/services">
                      <span>Learn More</span>
                      <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
