"use client"

import { useEffect, useRef, useState } from "react"
import {
  Award,
  CheckCircle2,
  Clock3,
  Headphones,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: ShieldCheck,
    title: "Premium Quality Products",
    description:
      "We work with trusted security and networking brands such as CP Plus, Hikvision, Dahua, IMOU, Prama, and TP-Link. Products are selected according to your requirements, environment, and budget for dependable long-term performance.",
  },
  {
    icon: Headphones,
    title: "Professional Technical Support",
    description:
      "Our support continues after installation. We assist with troubleshooting, maintenance, configuration, upgrades, and other technical requirements to help keep your systems performing reliably.",
  },
  {
    icon: Users,
    title: "Experienced Technical Team",
    description:
      "Our technical team works across CCTV, networking, access control, and security & IT solutions, with a focus on proper planning, installation, configuration, and system performance.",
  },
  {
    icon: Clock3,
    title: "Responsive Service",
    description:
      "We aim to respond promptly to installation, maintenance, troubleshooting, and service requirements, helping you address security and IT issues with minimal disruption.",
  },
  {
    icon: Award,
    title: "Warranty & AMC Support",
    description:
      "We provide warranty assistance according to applicable product and service terms, along with AMC options for customers who want ongoing maintenance and technical support.",
  },
  {
    icon: Target,
    title: "Customized Solutions",
    description:
      "Every property has different requirements. We design security and IT solutions around your space, priorities, usage, and budget instead of offering a one-size-fits-all approach.",
  },
]

const trustPoints = [
  "Trusted Technology",
  "Professional Installation",
  "Customized Solutions",
  "Responsive Support",
]

export function WhyChooseUs() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = sectionRef.current

    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px",
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-labelledby="why-choose-us-heading"
      className="relative isolate overflow-hidden border-y border-border bg-muted py-20 dark:border-border/[0.06] dark:bg-background sm:py-24 lg:py-28"
    >
      {/* ---------------------------------------------------------
          Background atmosphere
          --------------------------------------------------------- */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Brand atmosphere */}
        <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-primary/[0.07] blur-[120px] dark:bg-primary/[0.10]" />

        <div className="absolute -bottom-40 -right-32 h-[460px] w-[460px] rounded-full bg-highlight/[0.05] blur-[130px] dark:bg-highlight/[0.07]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* ---------------------------------------------------------
            Main heading
            --------------------------------------------------------- */}

        <div
          className={cn(
            "mx-auto mb-14 max-w-3xl text-center transition-all duration-700 ease-out sm:mb-16",
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          )}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-ink dark:border-primary/20 dark:bg-primary/[0.08] dark:text-brand-ink">
            <ShieldCheck className="h-3.5 w-3.5" />
            Why Choose Us
          </div>

          <h2
            id="why-choose-us-heading"
            className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl dark:text-foreground"
          >
            Security Solutions Built Around{" "}
            <span className="bg-gradient-to-r from-brand-ink to-highlight-ink bg-clip-text text-transparent">
              Your Needs
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg dark:text-muted-foreground">
            We combine trusted technology, professional installation,
            customized solutions, and responsive support to help protect
            homes, offices, shops, and businesses.
          </p>
        </div>

        {/* ---------------------------------------------------------
            Trust indicators
            --------------------------------------------------------- */}

        <div
          className={cn(
            "mx-auto mb-14 grid max-w-4xl grid-cols-2 overflow-hidden rounded-2xl border border-border bg-card/70 shadow-sm backdrop-blur-sm transition-all duration-700 sm:grid-cols-4 dark:border-border/[0.07] dark:bg-card/[0.025]",
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          )}
          style={{ transitionDelay: "150ms" }}
        >
          {trustPoints.map((point, index) => (
            <div
              key={point}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-4 text-center text-xs font-semibold text-muted-foreground sm:text-sm dark:text-muted-foreground",
                index !== 0 && "border-border sm:border-l dark:border-border/[0.07]",
                index >= 2 && "border-t sm:border-t-0"
              )}
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-ink dark:text-brand-ink" />
              <span>{point}</span>
            </div>
          ))}
        </div>

        {/* ---------------------------------------------------------
            Feature grid
            --------------------------------------------------------- */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <article
                key={feature.title}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-border bg-card/80 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_18px_45px_rgba(15,23,42,0.09)] dark:border-border/[0.07] dark:bg-card/[0.025] dark:shadow-none dark:hover:border-primary/25 dark:hover:bg-card/[0.045]",
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                )}
                style={{
                  transitionDelay: `${250 + index * 80}ms`,
                }}
              >
                {/* Subtle hover glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-primary/[0.08] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                />

                {/* Icon */}
                <div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/15 bg-primary/[0.07] text-brand-ink transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary hover:text-primary-foreground group-hover:text-foreground group-hover:shadow-lg group-hover:shadow-blue-600/20 dark:border-primary/15 dark:bg-primary/[0.08] dark:text-brand-ink">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="mb-3 text-lg font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-brand-ink dark:text-foreground dark:group-hover:text-brand-ink">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-6 text-muted-foreground dark:text-muted-foreground">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom accent */}
                <div
                  aria-hidden="true"
                  className="absolute bottom-0 left-6 right-6 h-px origin-left scale-x-0 bg-gradient-to-r from-primary to-highlight transition-transform duration-500 group-hover:scale-x-100"
                />
              </article>
            )
          })}
        </div>

        {/* ---------------------------------------------------------
            Closing statement
            --------------------------------------------------------- */}

        <div
          className={cn(
            "mx-auto mt-14 max-w-3xl text-center transition-all duration-700 ease-out sm:mt-16",
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-5 opacity-0"
          )}
          style={{ transitionDelay: "700ms" }}
        >
          <p className="text-sm leading-6 text-muted-foreground dark:text-muted-foreground">
            From initial consultation to installation and ongoing support,
            we focus on delivering practical solutions that fit your
            requirements.
          </p>
        </div>
      </div>
    </section>
  )
}