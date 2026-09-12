"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { services } from "@/lib/services"
import { cn } from "@/lib/utils"
import { SectionHeading } from "@/components/section-heading"

export function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  useEffect(() => { const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setIsVisible(true), { threshold: 0.1 }); const current = sectionRef.current; if (current) observer.observe(current); return () => observer.disconnect() }, [])
  return <section id="services" ref={sectionRef} className="relative overflow-hidden bg-background py-20 lg:py-28"><div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-secondary/30 via-transparent to-background" /><div className="page-container relative z-10"><SectionHeading align="center" className={cn("mb-12 transition duration-500", isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0")} eyebrow="Our services" title="Security, networking and smart solutions" description="Explore requirement-based security and technology solutions for homes, offices and commercial spaces." /><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{services.map((service, index) => { const Icon = service.icon; return <Link href={`/services/${service.slug}`} key={service.slug} className={cn("group relative overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/70 hover:shadow-xl", isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0")} style={{ transitionDelay: `${Math.min(index * 45, 360)}ms` }}><div className="relative h-44 overflow-hidden"><Image src={service.image} alt={service.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition duration-300 group-hover:scale-[1.04]" /><div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" /><div className="absolute bottom-3 left-3 rounded-lg bg-background/85 p-2 text-accent backdrop-blur"><Icon className="h-4 w-4" /></div></div><div className="p-5"><h3 className="font-display text-lg font-semibold text-foreground">{service.title}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{service.summary}</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">Explore service <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></div></Link> })}</div><div className="mt-10 text-center"><Link href="/services" className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-primary hover:text-primary">View all services <ArrowRight className="h-4 w-4" /></Link></div></div></section>
}
