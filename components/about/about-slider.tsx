"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  Building2,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  DoorClosed,
  Fingerprint,
  Headphones,
  Home,
  KeyRound,
  Laptop,
  LockKeyhole,
  MessageCircle,
  Network,
  Radio,
  Router,
  Server,
  Settings2,
  ShieldCheck,
  Smartphone,
  Speaker,
  Target,
  Wifi,
  Wrench,
} from "lucide-react"

import { cn } from "@/lib/utils"

/* =========================================================
   HERO / COMPANY STORY
   ========================================================= */

const slides = [
  {
    image: "/images/CCTV_Camera.png",
    icon: ShieldCheck,
    eyebrow: "WHO WE ARE",
    title: "Technology That Works Around Your Needs",
    text: "VisionSecure Smart Technologies is a technology solutions company focused on security, networking, IT infrastructure, and smart technology. We help homes, offices, shops, and businesses choose, install, and maintain technology that makes everyday operations safer, more connected, and more reliable.",
  },
  {
    image: "/images/Networking_Gallery.png",
    icon: Network,
    eyebrow: "WHAT WE BELIEVE",
    title: "Good Technology Starts With the Right Understanding",
    text: "We believe technology should solve a real problem, not create unnecessary complexity. That is why we begin by understanding your requirement, environment, usage, and priorities before recommending a solution.",
  },
  {
    image: "/images/Essl_Biom.png",
    icon: Settings2,
    eyebrow: "OUR COMMITMENT",
    title: "From Recommendation to Reliable Support",
    text: "Our responsibility does not end when installation is completed. We focus on proper planning, installation, configuration, testing, and continued technical support so your system remains useful and dependable.",
  },
  {
    image: "/images/Smart_home.png",
    icon: Target,
    eyebrow: "LOOKING AHEAD",
    title: "Building Long-Term Technology Relationships",
    text: "Our goal is to grow through trust, quality work, responsible recommendations, and long-term customer relationships — while continuously expanding the technology solutions we can provide.",
  },
]

/* =========================================================
   HOW WE WORK
   ========================================================= */

const approachSteps = [
  {
    icon: MessageCircle,
    title: "Understand Your Requirement",
    description:
      "We begin with a conversation to understand your property, requirement, priorities, existing setup, and expectations.",
  },
  {
    icon: Building2,
    title: "Assess the Environment",
    description:
      "Where required, we review the site, coverage areas, infrastructure, installation conditions, and practical requirements.",
  },
  {
    icon: BadgeCheck,
    title: "Recommend the Right Solution",
    description:
      "We suggest suitable technology and products based on your actual requirement, application, and priorities.",
  },
  {
    icon: CheckCircle2,
    title: "Plan & Quote Clearly",
    description:
      "We prepare a clear solution plan and quotation so you understand what is being proposed before work begins.",
  },
  {
    icon: Wrench,
    title: "Install, Configure & Test",
    description:
      "Our focus is on proper installation, configuration, testing, and handover so the system works as intended.",
  },
  {
    icon: Headphones,
    title: "Support After Installation",
    description:
      "We remain available for troubleshooting, maintenance, upgrades, AMC, and technical assistance when you need it.",
  },
]

/* =========================================================
   WHY VISIONSECURE
   ========================================================= */

const strengths = [
  {
    icon: Target,
    title: "Requirement First",
    description:
      "We start with your actual requirement instead of pushing a standard solution.",
  },
  {
    icon: ShieldCheck,
    title: "Practical Solutions",
    description:
      "We focus on solutions that are useful, maintainable, and suitable for the environment.",
  },
  {
    icon: BadgeCheck,
    title: "Professional Execution",
    description:
      "Planning, installation, configuration, testing, and handover are treated as part of the solution.",
  },
  {
    icon: Headphones,
    title: "Ongoing Support",
    description:
      "We aim to remain a technology partner even after the initial installation is complete.",
  },
]
/* =========================================================
   SELECTED SOLUTIONS
   ========================================================= */

type Service = {
  title: string
  href: string
  icon: typeof Camera
}

type ServiceCategory = {
  title: string
  icon: typeof ShieldCheck
  services: Service[]
}
const serviceCategories: ServiceCategory[] = [
  {
    title: "Security & Surveillance",
    icon: ShieldCheck,
    services: [
      {
        title: "CCTV Surveillance",
        href: "/services/cctv-surveillance",
        icon: Camera,
      },
      {
        title: "Biometric Attendance",
        href: "/services/biometric-attendance",
        icon: Fingerprint,
      },
      {
        title: "Access Control System",
        href: "/services/access-control-system",
        icon: LockKeyhole,
      },
      {
        title: "Video Door Phone",
        href: "/services/video-door-phone",
        icon: DoorClosed,
      },
    ],
  },
  {
    title: "Networking & IT",
    icon: Network,
    services: [
      {
        title: "Networking Solutions",
        href: "/services/networking-solutions",
        icon: Router,
      },
      {
        title: "WiFi & Mesh Networking",
        href: "/services/wifi-mesh-networking",
        icon: Wifi,
      },
      {
        title: "IT Support & AMC",
        href: "/services/it-support-amc",
        icon: Laptop,
      },
      {
        title: "Server & Networking Infrastructure",
        href: "/services/server-networking-infrastructure",
        icon: Server,
      },
    ],
  },
  {
    title: "Smart Technology",
    icon: Smartphone,
    services: [
      {
        title: "Smart Door Locks",
        href: "/services/smart-door-locks",
        icon: KeyRound,
      },
      {
        title: "Home Automation",
        href: "/services/home-automation",
        icon: Home,
      },
      {
        title: "Speaker Solutions",
        href: "/services/speaker-solutions",
        icon: Speaker,
      },
    ],
  },
  {
    title: "Alarm & Safety",
    icon: BellRing,
    services: [
      {
        title: "Glass Break Alarm System",
        href: "/services/glass-break-alarm-system",
        icon: BellRing,
      },
      {
        title: "Emergency Alarm System",
        href: "/services/emergency-alarm-system",
        icon: Radio,
      },
    ],
  },
]
/* =========================================================
   ABOUT SLIDER
   ========================================================= */

export function AboutSlider() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const changeSlide = useCallback(
    (direction: "next" | "previous") => {
      if (isAnimating) return

      setIsAnimating(true)

      setActive((current) =>
        direction === "next"
          ? (current + 1) % slides.length
          : (current - 1 + slides.length) % slides.length
      )

      window.setTimeout(() => {
        setIsAnimating(false)
      }, 700)
    },
    [isAnimating]
  )

  const next = useCallback(() => {
    changeSlide("next")
  }, [changeSlide])

  const previous = useCallback(() => {
    changeSlide("previous")
  }, [changeSlide])

  /* =======================================================
     AUTOPLAY
     ======================================================= */

  useEffect(() => {
    if (paused) return

    const timer = window.setInterval(next, 6500)

    return () => window.clearInterval(timer)
  }, [next, paused])

  /* =======================================================
     KEYBOARD
     ======================================================= */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") next()
      if (event.key === "ArrowLeft") previous()
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [next, previous])

  /* =======================================================
     TOUCH
     ======================================================= */

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }

  const handleTouchMove = (event: React.TouchEvent) => {
    touchEndX.current = event.touches[0]?.clientX ?? null
  }

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) {
      return
    }

    const distance = touchStartX.current - touchEndX.current

    if (Math.abs(distance) > 50) {
      distance > 0 ? next() : previous()
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  const slide = slides[active]
  const Icon = slide.icon

  return (
    <main className="overflow-hidden bg-slate-950">

      {/* =========================================================
          01 — WHO WE ARE
          ========================================================= */}

      <section
        className="relative isolate overflow-hidden bg-slate-950"
        aria-labelledby="about-slider-heading"
        aria-roledescription="carousel"
        aria-label="About VisionSecure Smart Technologies"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background */}

        <div
          key={slide.image}
          className="absolute inset-0 animate-[aboutZoom_6.5s_ease-out_forwards]"
        >
          <Image
            src={slide.image}
            alt=""
            fill
            priority={active === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
        {/* Overlays */}

        <div className="absolute inset-0 bg-slate-950/70" />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/30" />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />

        {/* Grid */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.35) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Glow */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-1/4 h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-[120px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-[120px]"
        />

        {/* Content */}

        <div className="relative mx-auto flex min-h-[650px] max-w-7xl items-center px-4 py-24 sm:px-8 lg:min-h-[700px]">
          <div className="w-full">

            <div className="max-w-3xl">

              <div
                key={`${slide.eyebrow}-eyebrow`}
                className="animate-[aboutFadeUp_0.7s_ease-out_both]"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300 backdrop-blur-md">
                  <Icon className="h-4 w-4" />
                  {slide.eyebrow}
                </span>
              </div>

              <h1
                id="about-slider-heading"
                key={`${slide.title}-title`}
                className="mt-6 text-balance animate-[aboutFadeUp_0.8s_0.08s_ease-out_both] text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                {slide.title}
              </h1>

              <p
                key={`${slide.text}-text`}
                className="mt-6 max-w-2xl animate-[aboutFadeUp_0.8s_0.16s_ease-out_both] text-base leading-7 text-slate-300 sm:text-lg sm:leading-8"
              >
                {slide.text}
              </p>

              <div className="mt-8 flex flex-wrap gap-3 animate-[aboutFadeUp_0.8s_0.24s_ease-out_both]">

                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/25"
                >
                  Discuss Your Requirement
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/services"
                  className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.09]"
                >
                  Explore Our Services
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

              </div>

            </div>

          </div>

          {/* Navigation */}

          <div className="absolute bottom-8 left-4 right-4 flex items-center justify-between sm:left-8 sm:right-8">

            <div className="hidden text-sm font-medium text-slate-400 sm:block">
              <span className="text-white">
                {String(active + 1).padStart(2, "0")}
              </span>

              <span className="mx-2 text-slate-600">/</span>

              <span>
                {String(slides.length).padStart(2, "0")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {slides.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  aria-label={`Show slide ${index + 1}`}
                  aria-current={index === active}
                  onClick={() => {
                    if (index === active || isAnimating) return

                    setIsAnimating(true)
                    setActive(index)

                    window.setTimeout(() => {
                      setIsAnimating(false)
                    }, 700)
                  }}
                  className={cn(
                    "h-2 rounded-full transition-all duration-500",
                    index === active
                      ? "w-10 bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.45)]"
                      : "w-2 bg-white/30 hover:bg-white/60"
                  )}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={previous}
                disabled={isAnimating}
                aria-label="Previous slide"
                className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white backdrop-blur-md transition-all duration-300 hover:-translate-x-1 hover:border-cyan-300/40 hover:bg-cyan-300/10 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={next}
                disabled={isAnimating}
                aria-label="Next slide"
                className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white backdrop-blur-md transition-all duration-300 hover:translate-x-1 hover:border-cyan-300/40 hover:bg-cyan-300/10 disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

            </div>
          </div>
        </div>

        {!paused && (
          <div
            key={active}
            className="absolute bottom-0 left-0 h-[2px] animate-[aboutProgress_6.5s_linear_forwards] bg-cyan-300"
          />
        )}
      </section>

      {/* =========================================================
          02 — COMPANY STORY
          ========================================================= */}

      <section className="relative overflow-hidden bg-slate-950 py-24 sm:py-28">

        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 h-[450px] w-[650px] -translate-x-1/2 rounded-full bg-blue-500/[0.05] blur-[140px]"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-8">

          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

            {/* Text */}

            <div>

              <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
                <Building2 className="h-4 w-4" />
                About VisionSecure Smart Technologies
              </span>

              <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                A technology partner focused on practical solutions.
              </h2>

              <div className="mt-6 space-y-5 text-base leading-8 text-slate-400 sm:text-lg">

                <p>
                  VisionSecure Smart Technologies helps customers bring
                  security, connectivity, IT infrastructure, and smart
                  technology together in a practical way.
                </p>

                <p>
                  We work with homes, offices, shops, commercial spaces, and
                  growing businesses that need dependable technology without
                  unnecessary complexity.
                </p>

                <p>
                  Our approach is simple: understand the requirement first,
                  recommend what makes sense, execute the work professionally,
                  and remain available when support is needed.
                </p>

              </div>

            </div>

            {/* Highlight Card */}

            <div className="relative">

              <div className="absolute -inset-4 rounded-[2rem] bg-blue-500/[0.05] blur-2xl" />

              <article className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-8 backdrop-blur-md sm:p-10">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.07] text-cyan-300">
                  <ShieldCheck className="h-6 w-6" />
                </div>

                <h3 className="mt-7 text-2xl font-bold text-white">
                  Security. Connectivity. Technology.
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
                  Our focus is not simply on installing products. We aim to
                  create complete, usable solutions that fit the customer,
                  property, and application.
                </p>

                <div className="mt-7 space-y-3">

                  {[
                    "Understand the requirement",
                    "Recommend suitable technology",
                    "Execute professionally",
                    "Support after installation",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-slate-300"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-300" />
                      {item}
                    </div>
                  ))}

                </div>

              </article>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          03 — WHAT WE STAND FOR
          ========================================================= */}

      <section className="relative overflow-hidden border-y border-white/[0.06] bg-[#07111f] py-24 sm:py-28">

        <div className="relative mx-auto max-w-7xl px-4 sm:px-8">

          <div className="mx-auto max-w-3xl text-center">

            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
              <ShieldCheck className="h-4 w-4" />
              What We Stand For
            </span>

            <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Technology should make things simpler, safer, and more reliable.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              We believe good technology is not about adding more products.
              It is about choosing the right technology and making it work
              properly for the people who use it.
            </p>

          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {strengths.map((item) => {
              const StrengthIcon = item.icon

              return (
                <article
                  key={item.title}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/25 hover:bg-white/[0.045] hover:shadow-2xl hover:shadow-cyan-950/20"
                >

                  <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cyan-400/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-300 transition-all duration-300 group-hover:border-cyan-400/30 group-hover:bg-cyan-500 group-hover:text-white">
                      <StrengthIcon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-white transition-colors group-hover:text-cyan-300">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>

                  </div>

                </article>
              )
            })}

          </div>

        </div>
      </section>

      {/* =========================================================
          04 — GOAL
          ========================================================= */}

      <section className="relative overflow-hidden bg-slate-950 py-24 sm:py-28">

        <div
          aria-hidden="true"
          className="absolute -right-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-blue-500/[0.06] blur-[140px]"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-8">

          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

            <div>

              <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
                <Target className="h-4 w-4" />
                Our Goal
              </span>

              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                To become a trusted technology partner for the long term.
              </h2>

            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-8 backdrop-blur-md sm:p-10">

              <p className="text-base leading-8 text-slate-400 sm:text-lg">
                Our goal is to build VisionSecure Smart Technologies into a dependable technology
                partner for homes and businesses by delivering solutions that
                are practical, scalable, and easier to manage. We want our
                customers to feel confident not only about the technology they
                purchase, but also about the people supporting it.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">

                {[
                  "Trust",
                  "Quality",
                  "Long-Term Support",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-center text-sm font-semibold text-slate-300 transition-all duration-300 hover:border-blue-400/25 hover:text-white"
                  >
                    {item}
                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          05 — VISION & MISSION
          ========================================================= */}

      <section className="relative overflow-hidden bg-[#07111f] py-24 sm:py-28">

        <div className="relative mx-auto max-w-7xl px-4 sm:px-8">

          <div className="grid gap-6 lg:grid-cols-2">

            {/* Vision */}

            <article className="group relative overflow-hidden rounded-3xl border border-blue-400/10 bg-blue-500/[0.04] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-blue-400/25 hover:bg-blue-500/[0.06] sm:p-10">

              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-500/10 blur-[70px]" />

              <div className="relative">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/[0.08] text-blue-300">
                  <Target className="h-5 w-5" />
                </div>

                <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
                  Our Vision
                </p>

                <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                  Making dependable technology easier to access and easier to
                  trust.
                </h2>

                <p className="mt-5 text-base leading-7 text-slate-400">
                  We envision a technology company that customers can rely on
                  for security, connectivity, IT infrastructure, and smart
                  technology — with solutions that are understandable,
                  practical, and built for long-term use.
                </p>

              </div>

            </article>

            {/* Mission */}

            <article className="group relative overflow-hidden rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.035] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/25 hover:bg-cyan-400/[0.055] sm:p-10">

              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-400/10 blur-[70px]" />

              <div className="relative">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                  Our Mission
                </p>

                <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                  Understand first. Recommend right. Deliver properly. Support
                  continuously.
                </h2>

                <p className="mt-5 text-base leading-7 text-slate-400">
                  Our mission is to understand each customer&apos;s
                  requirement, recommend suitable technology, execute the work
                  professionally, and provide responsive support throughout
                  the life of the solution.
                </p>

              </div>

            </article>

          </div>

        </div>
      </section>

      {/* =========================================================
          06 — HOW WE WORK
          ========================================================= */}

      <section className="relative overflow-hidden bg-slate-950 py-24 sm:py-28">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-8">

          <div className="mx-auto max-w-3xl text-center">

            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
              <Settings2 className="h-4 w-4" />
              How We Work
            </span>

            <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              A clear process from the first conversation to ongoing support.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              We keep the process straightforward, transparent, and focused
              on the actual requirement.
            </p>

          </div>

          <div className="relative mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {approachSteps.map((step, index) => {
              const StepIcon = step.icon

              return (
                <article
                  key={step.title}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-blue-400/25 hover:bg-white/[0.045] hover:shadow-2xl hover:shadow-blue-950/30"
                >

                  <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-blue-500/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative">

                    <div className="flex items-center justify-between">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-400/[0.07] text-blue-300 transition-all duration-300 group-hover:border-blue-400/30 group-hover:bg-blue-500 group-hover:text-white">
                        <StepIcon className="h-5 w-5" />
                      </div>

                      <span className="text-xs font-bold text-slate-700">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                    </div>

                    <h3 className="mt-5 text-lg font-bold text-white transition-colors duration-300 group-hover:text-blue-300">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {step.description}
                    </p>

                  </div>

                </article>
              )
            })}

          </div>

          <div className="mt-12 text-center">

            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/20"
            >
              Discuss Your Requirement
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

          </div>

        </div>
      </section>

      {/* =========================================================
          07 — SELECTED SOLUTIONS
          ALL SERVICES + LINKS
          ========================================================= */}

      <section className="relative overflow-hidden border-y border-white/[0.06] bg-[#07111f] py-24 sm:py-28">

        {/* Ambient Glows */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-cyan-500/[0.05] blur-[120px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 bottom-20 h-[400px] w-[400px] rounded-full bg-blue-500/[0.06] blur-[120px]"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-8">

          {/* Header */}

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

            <div className="max-w-3xl">

              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                <ShieldCheck className="h-4 w-4" />
                Selected Solutions
              </span>

              <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Security, Networking, IT & Smart Technology
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                Explore the technology solutions we provide for homes,
                offices, shops, commercial spaces, and growing businesses.
              </p>

            </div>

            <Link
              href="/services"
              className="group inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.08] md:self-auto"
            >
              View All Services
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

          </div>

          {/* Service Categories */}

          <div className="mt-14 space-y-12">

            {serviceCategories.map((category) => {
              const CategoryIcon = category.icon

              return (
                <div key={category.title}>

                  {/* Category */}

                  <div className="mb-5 flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-300">
                      <CategoryIcon className="h-5 w-5" />
                    </div>

                    <h3 className="text-xl font-bold text-white">
                      {category.title}
                    </h3>

                  </div>

                  {/* Service Cards */}

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                    {category.services.map((service) => {
                      const ServiceIcon = service.icon

                      return (
                        <Link
                          key={service.title}
                          href={service.href}
                          className="group relative flex min-h-[86px] items-center justify-between overflow-hidden rounded-xl border border-white/[0.09] bg-white/[0.02] px-5 py-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-cyan-400/[0.05] hover:shadow-xl hover:shadow-cyan-950/20"
                        >

                          <div className="flex min-w-0 items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.035] text-slate-300 transition-all duration-300 group-hover:border-cyan-400/30 group-hover:bg-cyan-400/10 group-hover:text-cyan-300">

                              <ServiceIcon className="h-5 w-5" />

                            </div>

                            <span className="text-sm font-bold text-white transition-colors duration-300 group-hover:text-cyan-300">
                              {service.title}
                            </span>

                          </div>

                          <ArrowRight className="ml-3 h-4 w-4 shrink-0 text-slate-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-cyan-300" />

                        </Link>
                      )
                    })}

                  </div>

                </div>
              )
            })}

          </div>

        </div>
      </section>

      {/* =========================================================
          08 — FINAL CTA
          ========================================================= */}

      <section className="relative overflow-hidden bg-slate-950 py-24 sm:py-28">

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-blue-600/[0.08] via-transparent to-cyan-500/[0.08]"
        />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-8">

          <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
            <MessageCircle className="h-4 w-4" />
            Let&apos;s Work Together
          </span>

          <h2 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Have a requirement? Let&apos;s find the right solution.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Tell us what you need. We&apos;ll understand the requirement,
            discuss the right approach, and help you take the next step with
            confidence.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">

            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/25"
            >
              Discuss Your Requirement
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/services"
              className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.08]"
            >
              Explore Services
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

          </div>

        </div>
      </section>

      {/* =========================================================
          ANIMATIONS
          ========================================================= */}

      <style jsx>{`
        @keyframes aboutFadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes aboutZoom {
          from {
            transform: scale(1.06);
          }

          to {
            transform: scale(1);
          }
        }

        @keyframes aboutProgress {
          from {
            width: 0%;
          }

          to {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

    </main>
  )
}