"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"

import { services, type Service } from "@/lib/services"
import { cn } from "@/lib/utils"

const categories: Array<Service["category"] | "All solutions"> = [
  "All solutions",
  "Security & Surveillance",
  "Networking & IT",
  "Smart Technology",
  "Alarm & Safety",
]

export function ServicesPageContent() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All solutions")
  const visibleServices = activeCategory === "All solutions"
    ? services
    : services.filter((service) => service.category === activeCategory)

  return (
    <section className="relative overflow-hidden bg-background py-16 text-foreground sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,199,233,0.1),transparent_24%),radial-gradient(circle_at_90%_80%,rgba(37,119,230,0.12),transparent_28%)]" />
      <div className="page-container relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-green">Solutions we provide</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Security, connectivity and smart technology—planned around your site.
          </h2>
          <p className="mt-5 leading-7 text-muted-foreground">
            Explore practical solutions for homes, offices and commercial spaces. Each service page explains the available options, common applications and the next steps for installation.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter services by category">
          {categories.map((category) => {
            const selected = activeCategory === category
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  selected
                    ? "border-accent bg-accent/15 text-foreground"
                    : "border-border bg-card/60 text-muted-foreground hover:border-accent/60 hover:text-foreground"
                )}
              >
                {category}
              </button>
            )
          })}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleServices.map((service) => {
            const Icon = service.icon
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/80 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-accent/70 hover:shadow-xl hover:shadow-black/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={`${service.title} installation and technology solution`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 rounded-xl border border-border bg-background/85 p-2.5 text-brand-green backdrop-blur">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-green">{service.category}</p>
                  <h3 className="mt-2 font-display text-xl font-bold">{service.title}</h3>
                  <p className="mt-3 leading-6 text-muted-foreground">{service.summary}</p>
                  <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                    {service.solutions.slice(0, 2).map((solution) => (
                      <li key={solution} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" aria-hidden="true" />
                        {solution}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-green">
                    Explore service <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-16 rounded-3xl border border-border bg-secondary/50 p-8 text-center shadow-sm sm:p-12">
          <h2 className="font-display text-3xl font-bold">Not sure which solution fits your property?</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-muted-foreground">
            Share your space, usage and requirements. We can help you choose a practical setup and plan the installation.
          </p>
          <Link href="/contact" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90">
            Discuss your requirement <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
