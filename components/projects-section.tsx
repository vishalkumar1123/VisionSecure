"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const projects = [
  {
    title: "Corporate Office CCTV",
    location: "Gomti Nagar, Lucknow",
    category: "CCTV",
    cameras: "48 Cameras",
    image: "/images/project-1.jpg"
  },
  {
    title: "Hospital Security System",
    location: "Hazratganj, Lucknow",
    category: "Complete Security",
    cameras: "120 Cameras",
    image: "/images/project-2.jpg"
  },
  {
    title: "School Campus Security",
    location: "Aliganj, Lucknow",
    category: "CCTV + Biometric",
    cameras: "85 Cameras",
    image: "/images/project-3.jpg"
  },
  {
    title: "Shopping Mall Security",
    location: "Faizabad Road, Lucknow",
    category: "CCTV",
    cameras: "200 Cameras",
    image: "/images/project-4.jpg"
  },
  {
    title: "Manufacturing Plant",
    location: "Chinhat Industrial Area",
    category: "Industrial Security",
    cameras: "65 Cameras",
    image: "/images/service-networking.jpg"
  },
  {
    title: "Smart Home Automation",
    location: "Mahanagar, Lucknow",
    category: "Home Automation",
    cameras: "16 Cameras + Smart",
    image: "/images/service-automation.jpg"
  },
]

export function ProjectsSection() {
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
    <section id="projects" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={cn(
          "max-w-3xl mx-auto text-center mb-16 lg:mb-20 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Our Projects
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
          Trusted Security Installations Across Lucknow & India
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our successful CCTV, biometric, networking, and smart security installations completed for homes, offices, schools, retail stores, and industries across Lucknow, Uttar Pradesh, and other major cities in India.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={cn(
                "group relative rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-accent/50 transition-all duration-500 hover:-translate-y-2",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-accent/90 text-accent-foreground text-xs font-medium backdrop-blur-sm">
                    {project.category}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{project.location}</span>
                  </div>
                  <span className="text-accent">{project.cameras}</span>
                </div>
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <Button className="bg-accent text-accent-foreground rounded-full pointer-events-auto" asChild>
                  <Link href="/projects">
                    View All Projects
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className={cn(
          "text-center mt-12 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8"
            asChild
          >
            <Link href="/projects">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
