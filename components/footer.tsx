"use client"

import Link from "next/link"
import Image from "next/image"
import {
  Youtube,
  Instagram,
  Facebook,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ArrowUpRight,
  ShieldCheck,
  Clock3,
  Headphones,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const footerLinks = {
  services: [
    { label: "CCTV Surveillance", href: "/services#cctv" },
    { label: "Biometric Systems", href: "/services#biometric" },
    { label: "Access Control", href: "/services#access-control" },
    { label: "Networking Solutions", href: "/services#networking" },
    { label: "Home Automation", href: "/services#automation" },
    { label: "Fire Alarm Systems", href: "/services#fire-alarm" },
  ],

  company: [
    { label: "About Us", href: "/#about" },
    { label: "Projects", href: "/projects" },
    { label: "Gallery", href: "/gallery" },
    { label: "Testimonials", href: "/#testimonials" },
    { label: "Blog & News", href: "/blog" },
    { label: "Contact Us", href: "/contact" },
  ],

  support: [
    { label: "FAQs", href: "/faq" },
    { label: "AMC Plans", href: "/services#amc" },
    { label: "Warranty Support", href: "/faq#warranty" },
    { label: "Technical Support", href: "/contact" },
  ],
}

const socialLinks = [
  {
    icon: Youtube,
    href: "https://www.youtube.com/@vishalkumar9004",
    label: "YouTube",
    hover: "hover:bg-red-500",
  },

  {
    icon: Instagram,
    href: "https://www.instagram.com/visionsecure_tech/",
    label: "Instagram",
    hover:
      "hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600",
  },

  {
    icon: Facebook,
    href: "https://www.facebook.com/profile.php?id=61584897029759",
    label: "Facebook",
    hover: "hover:bg-blue-600",
  },

  {
    icon: MessageCircle,
    href: "https://wa.me/919872133840",
    label: "WhatsApp",
    hover: "hover:bg-green-500",
  },
]

const features = [
  {
    icon: ShieldCheck,
    title: "Trusted Security",
    desc: "Professional CCTV & Smart Security Solutions",
  },

  {
    icon: Clock3,
    title: "Fast Support",
    desc: "Quick Installation & Service Response",
  },

  {
    icon: Headphones,
    title: "24/7 Assistance",
    desc: "Dedicated Customer & Technical Support",
  },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.14),transparent_30%)]" />

      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-0 top-0 h-72 w-72 animate-pulse rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 animate-pulse rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      {/* Top Feature Strip */}
      <div className="relative border-b border-white/10">
        <div className="container mx-auto grid gap-6 px-4 py-8 md:grid-cols-3 lg:px-8">
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <div
                key={feature.title}
                className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-white/10"
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-500/20">
                  <Icon className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="mb-1 text-base font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-6 text-zinc-400">
                    {feature.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative container mx-auto px-4 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-12">
          {/* Brand Section */}
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center transition-transform duration-300 hover:scale-105"
            >
              <Image
                src="/images/logo.png"
                alt="VisionSecure Smart Technologies"
                width={240}
                height={70}
                priority
                className="h-16 w-auto"
              />
            </Link>

            <p className="mt-6 max-w-lg text-sm leading-8 text-zinc-400">
              VisionSecure Smart Technologies provides advanced CCTV
              surveillance, biometric systems, access control, networking,
              smart automation, and fire alarm solutions for homes,
              businesses, schools, offices, and industries across India.
            </p>

            {/* Contact Cards */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <a
                href="tel:+919872133840"
                className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-blue-500/40 hover:bg-blue-500/10"
              >
                <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                  <Phone className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Call Us
                  </p>

                  <p className="mt-1 text-sm font-medium text-white">
                    +91 98721 33840
                  </p>
                </div>
              </a>

              <a
                href="https://wa.me/919872133840"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-green-500/40 hover:bg-green-500/10"
              >
                <div className="rounded-xl bg-green-500/10 p-3 text-green-400">
                  <MessageCircle className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    WhatsApp
                  </p>

                  <p className="mt-1 text-sm font-medium text-white">
                    Chat Support
                  </p>
                </div>
              </a>

              <a
                href="mailto:info@visionsecuretech.in"
                className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-blue-500/40 hover:bg-blue-500/10"
              >
                <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                  <Mail className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Email
                  </p>

                  <p className="mt-1 text-sm font-medium text-white break-all">
                    info@visionsecuretech.in
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-medium leading-6 text-white">
                    Nearby Budheshwar,
                    <br />
                    Lucknow, Uttar Pradesh - 226017
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-10">
              <h3 className="mb-5 text-lg font-semibold text-white">
                Follow Us
              </h3>

              <div className="flex flex-wrap items-center gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon

                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className={cn(
                        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-zinc-300 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:text-white",
                        social.hover
                      )}
                    >
                      <Icon className="relative z-10 h-5 w-5" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-3">
            {/* Services */}
            <div>
              <h3 className="mb-6 text-xl font-semibold text-white">
                Services
              </h3>

              <ul className="space-y-4">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm text-zinc-400 transition-all duration-300 hover:translate-x-1 hover:text-blue-400"
                    >
                      <ArrowUpRight className="h-4 w-4 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="mb-6 text-xl font-semibold text-white">
                Company
              </h3>

              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm text-zinc-400 transition-all duration-300 hover:translate-x-1 hover:text-blue-400"
                    >
                      <ArrowUpRight className="h-4 w-4 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="mb-6 text-xl font-semibold text-white">
                Support
              </h3>

              <ul className="space-y-4">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm text-zinc-400 transition-all duration-300 hover:translate-x-1 hover:text-blue-400"
                    >
                      <ArrowUpRight className="h-4 w-4 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* CTA Card */}
              <div className="mt-8 rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-6 backdrop-blur-md">
                <h4 className="text-lg font-semibold text-white">
                  Need Security Consultation?
                </h4>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Get a free site inspection and customized quotation for
                  your home or business.
                </p>

                <Button
                  asChild
                  className="mt-5 rounded-full bg-blue-600 px-6 text-white hover:bg-blue-700"
                >
                  <Link href="/contact">
                    Get Free Quote
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="relative border-t border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="container mx-auto flex flex-col items-center justify-between gap-5 px-4 py-6 text-sm text-zinc-500 md:flex-row lg:px-8">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} VisionSecure Smart Technologies.
            All Rights Reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link
              href="/privacy-policy"
              className="transition hover:text-blue-400"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-blue-400"
            >
              Terms & Conditions
            </Link>

            <Link
              href="/contact"
              className="transition hover:text-blue-400"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp */}
      <Button
        size="lg"
        asChild
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-green-500 p-0 text-white shadow-2xl shadow-green-500/30 transition-all duration-300 hover:scale-110 hover:bg-green-600"
      >
        <a
          href="https://wa.me/919872133840"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="h-7 w-7 animate-pulse" />
        </a>
      </Button>
    </footer>
  )
}