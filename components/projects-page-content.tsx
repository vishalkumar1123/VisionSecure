"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Building2, 
  Hospital, 
  GraduationCap, 
  ShoppingBag,
  Factory,
  Home,
  MapPin,
  Calendar,
  Camera,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

const categories = [
  { id: "all", label: "All Projects", icon: Building2 },
  { id: "corporate", label: "Corporate", icon: Building2 },
  { id: "healthcare", label: "Healthcare", icon: Hospital },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "retail", label: "Retail", icon: ShoppingBag },
  { id: "industrial", label: "Industrial", icon: Factory },
  { id: "residential", label: "Residential", icon: Home },
]

const projects = [
  {
    id: 1,
    title: "Corporate Office Security",
    category: "corporate",
    location: "Gomti Nagar, Lucknow",
    date: "2024",
    cameras: 48,
    image: "/images/project-1.jpg",
    description: "Complete security solution for a 5-floor corporate office including CCTV, biometric attendance, and access control systems.",
    services: ["CCTV", "Biometric", "Access Control"]
  },
  {
    id: 2,
    title: "Multi-Specialty Hospital",
    category: "healthcare",
    location: "Hazratganj, Lucknow",
    date: "2024",
    cameras: 120,
    image: "/images/project-2.jpg",
    description: "Comprehensive surveillance system for a 200-bed hospital covering all departments, OTs, and parking areas.",
    services: ["CCTV", "Fire Alarm", "Access Control"]
  },
  {
    id: 3,
    title: "International School Campus",
    category: "education",
    location: "Aliganj, Lucknow",
    date: "2023",
    cameras: 85,
    image: "/images/project-3.jpg",
    description: "Campus-wide security system including classroom monitoring, gate security, and biometric attendance for staff.",
    services: ["CCTV", "Biometric", "Boom Barrier"]
  },
  {
    id: 4,
    title: "Shopping Mall Security",
    category: "retail",
    location: "Faizabad Road, Lucknow",
    date: "2023",
    cameras: 200,
    image: "/images/project-4.jpg",
    description: "Large-scale retail security with analytics, crowd monitoring, and integrated fire safety systems.",
    services: ["CCTV", "Fire Alarm", "PA System"]
  },
  {
    id: 5,
    title: "Manufacturing Plant",
    category: "industrial",
    location: "Chinhat Industrial Area",
    date: "2023",
    cameras: 65,
    image: "/images/service-networking.jpg",
    description: "Industrial security with perimeter protection, machine monitoring, and worker safety surveillance.",
    services: ["CCTV", "Access Control", "Fire Alarm"]
  },
  {
    id: 6,
    title: "Luxury Villa Automation",
    category: "residential",
    location: "Mahanagar, Lucknow",
    date: "2024",
    cameras: 16,
    image: "/images/service-automation.jpg",
    description: "Smart home security with automation, video door phones, and integrated lighting control.",
    services: ["CCTV", "Home Automation", "Video Door Phone"]
  },
  {
    id: 7,
    title: "Bank Branch Security",
    category: "corporate",
    location: "Chowk, Lucknow",
    date: "2024",
    cameras: 32,
    image: "/images/service-access.jpg",
    description: "High-security installation with vault monitoring, ATM surveillance, and panic alarm systems.",
    services: ["CCTV", "Access Control", "Alarm System"]
  },
  {
    id: 8,
    title: "Government Office",
    category: "corporate",
    location: "Vidhan Sabha Marg",
    date: "2023",
    cameras: 75,
    image: "/images/service-biometric.jpg",
    description: "Government facility security with visitor management, biometric access, and perimeter surveillance.",
    services: ["CCTV", "Biometric", "Visitor Management"]
  },
]

export function ProjectsPageContent() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const sectionRef = useRef<HTMLDivElement>(null)
  const projectsPerPage = 6

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

  const filteredProjects = activeCategory === "all" 
    ? projects 
    : projects.filter(p => p.category === activeCategory)

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage)
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  )

  return (
    <section ref={sectionRef} className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Category Filter */}
        <div className={cn(
          "flex flex-wrap justify-center gap-2 mb-12 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id)
                  setCurrentPage(1)
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  activeCategory === cat.id
                    ? "bg-accent text-accent-foreground shadow-lg shadow-accent/25"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* Stats */}
        <div className={cn(
          "grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {[
            { label: "Projects Completed", value: "500+" },
            { label: "Cameras Installed", value: "10,000+" },
            { label: "Happy Clients", value: "450+" },
            { label: "Cities Covered", value: "15+" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="p-6 rounded-2xl bg-card border border-border/50 text-center"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl lg:text-4xl font-bold text-accent mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedProjects.map((project, index) => (
            <div
              key={project.id}
              className={cn(
                "group relative bg-card rounded-2xl border border-border/50 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-accent/10",
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
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-accent/90 text-accent-foreground text-xs font-medium capitalize">
                  {project.category}
                </div>
                
                {/* Camera Count */}
                <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full glass text-xs">
                  <Camera className="h-3 w-3" />
                  <span>{project.cameras} Cameras</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <h3 className="font-display text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
                
                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {project.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {project.date}
                  </span>
                </div>
                
                {/* Services */}
                <div className="flex flex-wrap gap-2">
                  {project.services.map((service) => (
                    <span
                      key={service}
                      className="px-2 py-1 rounded-full bg-secondary text-xs text-muted-foreground"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "w-10 h-10 rounded-lg font-medium transition-all duration-300",
                  currentPage === page
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                )}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* CTA */}
        <div className={cn(
          "mt-20 text-center transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
            Want Similar Security for Your Property?
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Get a free consultation and customized quote for your security requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 shadow-lg shadow-accent/25"
              asChild
            >
              <Link href="/contact">
                Get Free Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8"
              asChild
            >
              <a href="https://wa.me/919872133840" target="_blank" rel="noopener noreferrer">
                WhatsApp Us
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
