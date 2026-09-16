"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import {
  Clock3,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Youtube,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

/* =========================================================
   TYPES
   ========================================================= */

type WorkingHour = {
  day: string
  hours: string
}

type ContactInfo =
  | {
      icon: LucideIcon
      title: string
      type: "text"
      details: string[]
      href?: string
    }
  | {
      icon: LucideIcon
      title: string
      type: "hours"
      details: WorkingHour[]
    }

/* =========================================================
   WHATSAPP ICON
   No extra package required
   ========================================================= */

function WhatsAppIcon({
  className,
}: {
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.52 3.48A11.83 11.83 0 0 0 12.04 0C5.5 0 .18 5.32.18 11.86c0 2.09.55 4.13 1.59 5.93L.08 24l6.35-1.66a11.86 11.86 0 0 0 5.6 1.43h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.15-3.38-8.43ZM12.04 21.8h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.77.99 1.01-3.67-.23-.38a9.85 9.85 0 0 1-1.51-5.29C2.14 6.42 6.58 1.98 12.04 1.98c2.65 0 5.14 1.03 7.01 2.9a9.84 9.84 0 0 1 2.91 7.02c0 5.46-4.44 9.9-9.92 9.9Zm5.43-7.41c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.94 1.18-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.08 4.5.71.31 1.26.5 1.69.64.71.23 1.35.2 1.86.12.57-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  )
}

/* =========================================================
   CONTACT INFORMATION
   ========================================================= */

const contactInfo: ContactInfo[] = [
  {
    icon: MapPin,
    title: "Visit Us",
    type: "text",
    details: [
      "153, Pili Market, Near Ram Lal Marriage Lawn, Narouna, Kakori Mod, Mohan Road, Lucknow, Uttar Pradesh - 227107",
    ],
  },

  {
    icon: Phone,
    title: "Call Us",
    type: "text",
    details: ["+91 98721 33840"],
    href: "tel:+919872133840",
  },

  {
    icon: Mail,
    title: "Email Us",
    type: "text",
    details: ["info@visionsecuretech.in"],
    href: "mailto:info@visionsecuretech.in",
  },

  {
    icon: Clock3,
    title: "Working Hours",
    type: "hours",
    details: [
      {
        day: "Monday",
        hours: "09 AM – 8:30 PM",
      },
      {
        day: "Tuesday",
        hours: "09 AM – 8:30 PM",
      },
      {
        day: "Wednesday",
        hours: "09 AM – 8:30 PM",
      },
      {
        day: "Thursday",
        hours: "09 AM – 8:30 PM",
      },
      {
        day: "Friday",
        hours: "09 AM – 8:30 PM",
      },
      {
        day: "Saturday",
        hours: "09 AM – 8:30 PM",
      },
      {
        day: "Sunday",
        hours: "10 AM – 4:00 PM",
      },
    ],
  },
]

/* =========================================================
   SOCIAL LINKS
   ========================================================= */

const whatsappMessage = encodeURIComponent(
  "Hello VisionSecure Smart Technologies,\n\nI would like to discuss a security or IT requirement.\n\nPlease let me know how you can help me."
)

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61584897029759",
    icon: Facebook,
    color: "facebook",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/visionsecure_tech/",
    icon: Instagram,
    color: "instagram",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@vishalkumar9004",
    icon: Youtube,
    color: "youtube",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/919872133840",
    icon: WhatsAppIcon,
    color: "whatsapp",
  },
] as const

/* =========================================================
   FORM TYPES
   ========================================================= */

type FormData = {
  name: string
  email: string
  phone: string
  requirement: string
  message: string
}

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  requirement: "",
  message: "",
}

/* =========================================================
   COMPONENT
   ========================================================= */

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)

  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentDay, setCurrentDay] = useState("")

  const [formData, setFormData] =
    useState<FormData>(initialFormData)

  useEffect(() => {
    const updateCurrentDay = () => {
      setCurrentDay(
        new Intl.DateTimeFormat("en-IN", {
          weekday: "long",
          timeZone: "Asia/Kolkata",
        }).format(new Date())
      )
    }

    updateCurrentDay()
    const timer = window.setInterval(updateCurrentDay, 60_000)
    return () => window.clearInterval(timer)
  }, [])

  /* =======================================================
     INTERSECTION OBSERVER
     ======================================================= */

  useEffect(() => {
    const element = sectionRef.current

    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -60px 0px",
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  /* =======================================================
     FORM CHANGE
     ======================================================= */

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  /* =======================================================
     FORM SUBMIT
     ======================================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (isSubmitting) return

    const name = formData.name.trim()
    const email = formData.email.trim()
    const phone = formData.phone.trim()
    const requirement = formData.requirement.trim()
    const message = formData.message.trim()

    /* Required validation */

    if (!name || !email || !phone || !requirement) {
      alert("Please fill in all required fields.")
      return
    }

    /* Phone validation */

    const cleanPhone = phone.replace(/\D/g, "")

    if (!/^\d{10}$/.test(cleanPhone)) {
      alert("Please enter a valid 10-digit mobile number.")
      return
    }

    setIsSubmitting(true)

    try {
      /* =================================================
         SAVE LEAD TO DATABASE
         ================================================= */

      const response = await fetch("/api/leads", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          phone: cleanPhone,
          service: requirement,
          message,
          source: "Website",
        }),
      })

      if (!response.ok) {
        throw new Error(
          "Unable to submit your requirement."
        )
      }

      /* =================================================
         WHATSAPP FOLLOW-UP
         ================================================= */

      const whatsappMessage = [
        "Hello VisionSecure Smart Technologies,",
        "",
        "I would like to discuss a requirement.",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${cleanPhone}`,
        `Requirement: ${requirement}`,
        message ? `Message: ${message}` : "",
      ]
        .filter(Boolean)
        .join("\n")

      const whatsappUrl =
        `https://wa.me/919872133840?text=` +
        encodeURIComponent(whatsappMessage)

      window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer"
      )

      /* =================================================
         SUCCESS
         ================================================= */

      alert(
        "Thank you! Your requirement has been submitted successfully. Our team will contact you shortly."
      )

      setFormData(initialFormData)
    } catch (error) {
      console.error(
        "Contact form submission error:",
        error
      )

      alert(
        "We could not submit your requirement right now. Please try again or contact us directly."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="contact-heading"
      className="relative isolate overflow-hidden border-t border-border bg-muted py-20 dark:border-border/[0.06] dark:bg-background sm:py-24 lg:py-28"
    >
      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        {/* Technical Grid */}

        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Blue Glow */}

        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/[0.07] blur-[140px] dark:bg-primary/[0.10]" />

        {/* Cyan Glow */}

        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-highlight/[0.05] blur-[140px] dark:bg-highlight/[0.07]" />
      </div>

      {/* =====================================================
          CONTAINER
          ===================================================== */}

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">

        {/* ===================================================
            HEADER
            =================================================== */}

        <div
          className={cn(
            "mx-auto mb-14 max-w-3xl text-center transition-all duration-700 ease-out sm:mb-16",
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          )}
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-ink dark:border-primary/20 dark:bg-primary/[0.08] dark:text-brand-ink">
            <MessageCircle className="h-3.5 w-3.5" />

            Get In Touch
          </span>

          <h2
            id="contact-heading"
            className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl dark:text-foreground"
          >
            Let&apos;s Discuss Your{" "}
            <span className="bg-gradient-to-r from-primary to-highlight bg-clip-text text-transparent">
              Requirement
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg dark:text-muted-foreground">
            Tell us what you need. Our team will understand
            your requirement and help you choose the right
            security or IT solution.
          </p>
        </div>

        {/* ===================================================
            MAIN GRID
            =================================================== */}

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">

          {/* =================================================
              LEFT — CONTACT INFORMATION
              ================================================= */}

          <div
            className={cn(
              "flex flex-col items-stretch space-y-5 transition-all duration-700 ease-out",
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-8 opacity-0"
            )}
          >
            {contactInfo.map((info, index) => {
              const Icon = info.icon

              return (
                <article
                  key={info.title}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border border-border bg-card/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg hover:shadow-slate-900/[0.05] dark:border-border/[0.07] dark:bg-card/[0.025] dark:hover:border-primary/20 dark:hover:bg-card/[0.04]",
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-6 opacity-0"
                  )}
                  style={{
                    transitionDelay: `${150 + index * 100}ms`,
                  }}
                >
                  {/* Glow */}

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-primary/[0.08] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  />

                  <div className="relative flex gap-4">

                    {/* Icon */}

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/[0.07] text-brand-ink transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary hover:text-primary-foreground group-hover:text-foreground group-hover:shadow-lg group-hover:shadow-blue-600/20 dark:border-primary/15 dark:bg-primary/[0.08] dark:text-brand-ink">
                      <Icon
                        className="h-5 w-5"
                        strokeWidth={2}
                      />
                    </div>

                    {/* Content */}

                    <div className="min-w-0 flex-1">

                      <h3 className="text-base font-bold text-foreground dark:text-foreground">
                        {info.title}
                      </h3>

                      {/* Text information */}

                      {info.type === "text" && (
                        <div className="mt-2 space-y-1">
                          {info.details.map((detail) => (
                            info.href ? (
                              <a
                                key={detail}
                                href={info.href}
                                className="block break-words text-sm leading-6 text-muted-foreground transition-colors hover:text-brand-ink dark:text-muted-foreground dark:hover:text-brand-ink"
                              >
                                {detail}
                              </a>
                            ) : (
                              <p
                                key={detail}
                                className="break-words text-sm leading-6 text-muted-foreground dark:text-muted-foreground"
                              >
                                {detail}
                              </p>
                            )
                          ))}
                        </div>
                      )}

                      {/* Working Hours */}

                      {info.type === "hours" && (
                        <div className="mt-3 overflow-hidden rounded-xl border border-border bg-muted/70 dark:border-border/[0.06] dark:bg-card/[0.02]">

                          {info.details.map(
                            (schedule, scheduleIndex) => {
                              const isToday = schedule.day === currentDay

                              return (
                                <div
                                  key={schedule.day}
                                  className={cn(
                                    "grid grid-cols-[minmax(80px,1fr)_auto] items-center gap-3 px-3.5 py-2.5 text-sm transition-colors duration-200 sm:grid-cols-[1fr_auto] sm:px-4",

                                    scheduleIndex !==
                                      info.details.length - 1 &&
                                      "border-b border-border dark:border-border/[0.05]",

                                    isToday
                                      ? "relative bg-accent/10 ring-1 ring-inset ring-accent/35"
                                      : "hover:bg-highlight/[0.035]"
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "font-medium",
                                      isToday
                                        ? "font-bold text-brand-ink"
                                        : "text-muted-foreground dark:text-muted-foreground"
                                    )}
                                  >
                                    {schedule.day}
                                    {isToday && (
                                      <span className="ml-2 inline-flex rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">
                                        Today
                                      </span>
                                    )}
                                  </span>

                                  <span
                                    className={cn(
                                      "whitespace-nowrap text-right text-xs sm:text-sm",
                                      isToday
                                        ? "font-bold text-brand-green"
                                        : "text-muted-foreground dark:text-muted-foreground"
                                    )}
                                  >
                                    {schedule.hours}
                                  </span>
                                </div>
                              )
                            }
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}

            {/* =================================================
                SOCIAL MEDIA CARD
                ================================================= */}

            <div
              className={cn(
                "mx-auto w-full max-w-md rounded-2xl border border-border bg-card/85 p-6 text-center shadow-sm backdrop-blur-md transition-all duration-700 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg dark:border-border/[0.07] dark:bg-card/[0.025]",
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              )}
              style={{
                transitionDelay: "600ms",
              }}
            >

              {/* Social Header */}

              <div className="flex flex-col items-center">

                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/[0.08] text-brand-ink transition-all duration-300 hover:scale-110 dark:bg-primary/[0.08] dark:text-brand-ink">
                  <MessageCircle className="h-5 w-5" />
                </span>

                <p className="mt-3 text-base font-bold text-foreground dark:text-foreground">
                  Connect With Us
                </p>

                <p className="mt-1 max-w-xs text-sm leading-6 text-muted-foreground dark:text-muted-foreground">
                  Follow VisionSecure Smart Technologies for updates, solutions,
                  and security tips.
                </p>
              </div>

              {/* =================================================
                  SOCIAL BUTTONS
                  ================================================= */}

              <div className="mt-5 flex flex-wrap justify-center gap-3">

                {socialLinks.map((social) => {
                  const Icon = social.icon

                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit VisionSecure  on ${social.label}`}
                      title={social.label}
                      className={cn(
                        "group/social relative flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-xl border bg-card px-3.5 transition-all duration-300 hover:-translate-y-1.5 hover:text-foreground hover:shadow-xl focus:outline-none focus:ring-4 dark:bg-card/[0.03]",

                        /* Facebook */

                        social.color === "facebook" &&
                          "border-[#1877F2]/20 text-[#1877F2] hover:border-[#1877F2] hover:bg-[#1877F2] hover:shadow-[#1877F2]/25 focus:ring-[#1877F2]/20 dark:border-[#1877F2]/25",

                        /* Instagram */

                        social.color === "instagram" &&
                          "border-status-pink/20 text-[#E4405F] hover:border-[#E4405F] hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#E4405F] hover:to-[#833AB4] hover:shadow-pink-500/25 focus:ring-status-pink/20 dark:border-status-pink/20",

                        /* YouTube */

                        social.color === "youtube" &&
                          "border-[#FF0000]/20 text-[#FF0000] hover:border-[#FF0000] hover:bg-[#FF0000] hover:shadow-red-500/25 focus:ring-destructive/20 dark:border-[#FF0000]/25",

                        /* WhatsApp */

                        social.color === "whatsapp" &&
                          "border-[#25D366]/20 text-[#25D366] hover:border-[#25D366] hover:bg-[#25D366] hover:shadow-[#25D366]/30 focus:ring-[#25D366]/20 dark:border-[#25D366]/25"
                      )}
                    >
                      <Icon
                        className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover/social:scale-110"
                        strokeWidth={2}
                      />
                      <span className="relative z-10 text-sm font-semibold">{social.label}</span>

                      {/* Shine effect */}

                      <span
                        aria-hidden="true"
                        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-background/20 to-transparent transition-transform duration-700 group-hover/social:translate-x-full"
                      />
                    </a>
                  )
                })}
              </div>

              {/* Divider */}

              <div className="mx-auto mt-5 h-px w-16 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

              {/* Footer Text */}

              <p className="mt-4 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground dark:text-muted-foreground">
                Stay Connected • Stay Secure
              </p>
            </div>
          </div>

          {/* =================================================
              RIGHT — CONTACT FORM
              ================================================= */}

          <div
            className={cn(
              "transition-all duration-700 ease-out",
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-8 opacity-0"
            )}
            style={{
              transitionDelay: "150ms",
            }}
          >
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card/90 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.07)] backdrop-blur-sm sm:p-8 dark:border-border/[0.07] dark:bg-card/80 dark:shadow-none">

              {/* Background glow */}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/[0.07] blur-[90px]"
              />

              <div className="relative">

                {/* Form heading */}

                <div className="mb-7">

                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-brand-ink dark:text-brand-ink">
                    Send An Enquiry
                  </span>

                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-foreground dark:text-foreground">
                    Tell Us What You Need
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground dark:text-muted-foreground">
                    Share a few details and our team will get
                    back to you.
                  </p>
                </div>

                {/* =================================================
                    FORM
                    ================================================= */}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >

                  {/* Name + Email */}

                  <div className="grid gap-5 sm:grid-cols-2">

                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-semibold text-foreground dark:text-foreground"
                      >
                        Full Name{" "}
                        <span className="text-destructive">
                          *
                        </span>
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-border/[0.08] dark:bg-card/[0.03] dark:text-foreground dark:placeholder:text-muted-foreground dark:focus:border-primary dark:focus:ring-primary/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-semibold text-foreground dark:text-foreground"
                      >
                        Email{" "}
                        <span className="text-destructive">
                          *
                        </span>
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-border/[0.08] dark:bg-card/[0.03] dark:text-foreground dark:placeholder:text-muted-foreground dark:focus:border-primary dark:focus:ring-primary/10"
                      />
                    </div>
                  </div>

                  {/* Phone + Requirement */}

                  <div className="grid gap-5 sm:grid-cols-2">

                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-2 block text-sm font-semibold text-foreground dark:text-foreground"
                      >
                        Mobile Number{" "}
                        <span className="text-destructive">
                          *
                        </span>
                      </label>

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        required
                        maxLength={10}
                        value={formData.phone}
                        onChange={(event) => {
                          const value =
                            event.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10)

                          setFormData((previous) => ({
                            ...previous,
                            phone: value,
                          }))
                        }}
                        placeholder="10-digit mobile number"
                        className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-border/[0.08] dark:bg-card/[0.03] dark:text-foreground dark:placeholder:text-muted-foreground dark:focus:border-primary dark:focus:ring-primary/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="requirement"
                        className="mb-2 block text-sm font-semibold text-foreground dark:text-foreground"
                      >
                        Requirement{" "}
                        <span className="text-destructive">
                          *
                        </span>
                      </label>

                      <select
                        id="requirement"
                        name="requirement"
                        required
                        value={formData.requirement}
                        onChange={handleChange}
                        className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-border/[0.08] dark:bg-card dark:text-foreground dark:focus:border-primary dark:focus:ring-primary/10"
                      >
                        <option value="">
                          Select a service
                        </option>

                        <option value="CCTV Surveillance">
                          CCTV Surveillance
                        </option>

                        <option value="Networking">
                          Networking & WiFi
                        </option>

                        <option value="Access Control">
                          Access Control
                        </option>

                        <option value="Biometric Attendance">
                          Biometric Attendance
                        </option>

                        <option value="Video Door Phone">
                          Video Door Phone
                        </option>

                        <option value="IT Support & AMC">
                          IT Support & AMC
                        </option>

                        <option value="Smart Security">
                          Smart Security
                        </option>

                        <option value="Other">
                          Other Requirement
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-semibold text-foreground dark:text-foreground"
                    >
                      Tell Us More
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your property, approximate requirements, or anything else we should know..."
                      className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm leading-6 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-border/[0.08] dark:bg-card/[0.03] dark:text-foreground dark:placeholder:text-muted-foreground dark:focus:border-primary dark:focus:ring-primary/10"
                    />
                  </div>

                  {/* Submit */}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground hover:shadow-xl hover:shadow-blue-600/25 focus:outline-none focus:ring-4 focus:ring-primary/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60",
                      isSubmitting &&
                        "hover:translate-y-0"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-white" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Send Requirement

                        <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  {/* Privacy / information */}

                  <p className="text-center text-xs leading-5 text-muted-foreground dark:text-muted-foreground">
                    By submitting this form, you&apos;re
                    requesting a consultation from VisionSecure
                    Smart Technologies.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
