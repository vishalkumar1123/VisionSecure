"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Target, Eye, Award, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function AboutSection() {
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
    <section id="about" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-background" />
      
      {/* Decorative Elements */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[128px] translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className={cn(
            "space-y-8 transition-all duration-700",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          )}>
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                About Us
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance leading-tight">
                Securing India’s Future, One Installation at a Time
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                VisionSecure Smart Technologies is committed to delivering advanced, reliable and intelligent security solutions to homes, businesses, institutions and industries across India.
              </p>
            </div>            
            <p className="text-muted-foreground leading-relaxed">
              With years of experience in CCTV surveillance, biometric attendance systems, access control, networking, fire safety, smart automation and integrated security infrastructure, we are well-equipped to help keep our clients protected, connected and confident.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              With our years of experience, we understand the unique security needs of each customer and provide tailor-made solutions with trusted international brands and state-of-the-art technologies. From small residential installations to large commercial projects, we assure professional installation, dependable support and long-term performance.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              At VisionSecure smart technologies, we know security is more than cameras and devices. It’s about creating peace of mind, protecting what matters most and building safer environments for families, employees, businesses and communities.
            </p>
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 h-14 text-base font-semibold shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-105 transition-all duration-300"
              asChild
            >
              <a href="/contact">
                Get Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>

          {/* Mission & Vision Cards */}
          <div className={cn(
            "space-y-6 transition-all duration-700",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          )}>
            {/* Mission Card */}
            <div className="group p-8 rounded-2xl bg-card border border-border/50 hover:border-accent/50 transition-all duration-500 hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                    Our Mission
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our Mission To empower homes, shop, offices, schools, your business retail outlets and industries with innovative, affordable and reliable security solutions that ensure safety, peace of mind and operational efficiency.
                    We promise to provide world class technology, professional service and customer focused support to the highest standards of quality, trust and reliability on every project we work on.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="group p-8 rounded-2xl bg-card border border-border/50 hover:border-accent/50 transition-all duration-500 hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                  <Eye className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                    Our Vision
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To be one of the most trusted and innovative smart security solution providers in India by constantly adopting advanced technologies, providing exceptional customer experiences and setting new benchmarks in safety, automation and surveillance solutions.
                    We envision a future where intelligent security systems make every home and business in India smarter, safer and better protected.
                  </p>
                </div>
              </div>
            </div>

            {/* Experience Card */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-primary to-accent text-white transition-all duration-500 hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 rounded-xl bg-white/10">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold mb-3">
                    5+ Years of Excellence
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    VisionSecure Smart Technologies has successfully completed numerous security and surveillance projects for residential, commercial, educational and industrial clients over the years.
                    We have developed long-term relationships with customers who trust us for their security needs through our commitment to quality products, professional installation and reliable after-sales support.
                    Whether it’s CCTV installations, biometric systems, networking or smart automation, we continue to provide reliable solutions integrating technology, safety and performance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
