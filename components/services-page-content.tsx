"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Camera,
  Fingerprint,
  KeyRound,
  Network,
  Home,
  Video,
  Flame,
  Shield,
  Wrench,
  CheckCircle,
  ArrowRight,
} from "lucide-react"

const services = [
  {
    id: "cctv",
    icon: Camera,
    title: "CCTV Surveillance Solutions",
    shortDesc: "24/7 Smart Monitoring",
    description:
      "Protect your home, office, warehouse, showroom, school, and commercial property with advanced CCTV surveillance systems designed for complete security and real-time monitoring.",
    image: "/images/service-cctv.png",
    features: [
      "4K HD Cameras",
      "Night Vision",
      "Remote Mobile Viewing",
      "AI Motion Detection",
      "Cloud Recording",
      "Weatherproof Cameras",
    ],
    brands: ["CP Plus", "Imou", "Ezviz", "Uniview", "Tapo"],
  },

  {
    id: "biometric",
    icon: Fingerprint,
    title: "Biometric Systems",
    shortDesc: "Attendance & Access Control",
    description:
      "Advanced biometric systems with fingerprint and face recognition technology for secure attendance tracking and access management.",
    image: "/images/essl.jpg",
    features: [
      "Fingerprint Recognition",
      "Face Recognition",
      "Attendance Reports",
      "Payroll Integration",
      "Cloud Dashboard",
      "Mobile Access",
    ],
    brands: ["eSSL", "ZKTeco", "Realtime", "Matrix"],
  },

  {
    id: "access-control",
    icon: KeyRound,
    title: "Access Control Systems",
    shortDesc: "Secure Entry Solutions",
    description:
      "Complete access control solutions including RFID systems, smart locks, boom barriers, and turnstile gates for modern security management.",
    image: "/images/FL200.png",
    features: [
      "RFID Systems",
      "Smart Locks",
      "Boom Barriers",
      "Visitor Management",
      "Real-time Logs",
      "Multi-door Access",
    ],
    brands: ["Honeywell", "HID", "Suprema", "ZKTeco"],
  },

  {
    id: "networking",
    icon: Network,
    title: "Networking Solutions",
    shortDesc: "Reliable Connectivity",
    description:
      "Professional networking solutions including WiFi setup, structured cabling, router configuration, and enterprise security infrastructure.",
    image: "/images/service-networking.jpg",
    features: [
      "Structured Cabling",
      "WiFi Setup",
      "Firewall Security",
      "Server Setup",
      "Router Configuration",
      "LAN & WAN Solutions",
    ],
    brands: ["Cisco", "TP-Link", "Netgear", "D-Link"],
  },

  {
    id: "automation",
    icon: Home,
    title: "Home Automation",
    shortDesc: "Smart Living Experience",
    description:
      "Upgrade your home with intelligent automation systems including smart lighting, voice assistants, curtains, and climate control.",
    image: "/images/service-automation.jpg",
    features: [
      "Smart Lighting",
      "Voice Control",
      "Motorized Curtains",
      "Climate Control",
      "Remote App Access",
      "Energy Saving",
    ],
    brands: ["Google", "Amazon Alexa", "Philips Hue", "Legrand"],
  },

  {
    id: "video-door",
    icon: Video,
    title: "Video Door Phones",
    shortDesc: "Smart Entrance Security",
    description:
      "Modern video door phone systems with HD display, smartphone connectivity, and remote monitoring for safer homes and offices.",
    image: "/images/Door bell.jpg",
    features: [
      "HD Display",
      "Two-way Audio",
      "Night Vision",
      "Mobile App Access",
      "Visitor Capture",
      "Remote Unlock",
    ],
    brands: ["CP Plus", "Godrej", "Panasonic", "Qubo"],
  },

  {
    id: "fire-alarm",
    icon: Flame,
    title: "Fire Alarm Systems",
    shortDesc: "Advanced Fire Protection",
    description:
      "Reliable fire detection and alarm systems with smoke detectors, heat sensors, emergency lighting, and complete fire safety solutions.",
    image: "/images/smoke.jpeg",
    features: [
      "Smoke Detectors",
      "Heat Sensors",
      "Alarm Panels",
      "Emergency Lighting",
      "Fire Monitoring",
      "Safety Systems",
    ],
    brands: ["Honeywell", "Bosch", "Ravel", "Siemens"],
  },

  {
    id: "amc",
    icon: Wrench,
    title: "AMC Services",
    shortDesc: "Maintenance & Support",
    description:
      "Professional AMC services for CCTV, networking, biometric, and security systems with preventive maintenance and technical support.",
    image: "/images/AMC.png",
    features: [
      "Preventive Maintenance",
      "Technical Support",
      "System Inspection",
      "Software Updates",
      "Repair Assistance",
      "On-site Visits",
    ],
    brands: ["CP Plus", "Honeywell", "ZKTeco", "All Major Brands"],
  },
]

export function ServicesPageContent() {
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
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-slate-950 via-black to-slate-950 py-20 text-white overflow-hidden"
    >
      <div className="container mx-auto px-4 lg:px-8">

        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[35px] border border-white/10 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 px-6 py-20 lg:px-14 lg:py-28 mb-28 shadow-2xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_40%)]" />

          <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">

            {/* LEFT CONTENT */}
            <div>
              <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-400 mb-6 backdrop-blur-md">
                Advanced Security Solutions
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                Complete Security Solutions for
                <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Homes & Businesses
                </span>
              </h1>

              <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl">
                Secure your property with advanced CCTV surveillance,
                biometric systems, networking, fire alarms,
                smart automation, and complete security infrastructure.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="rounded-full bg-blue-600 hover:bg-blue-700 px-8 text-white shadow-lg shadow-blue-500/40 transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link href="/contact">
                    Request Free Quote
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-green-500 text-green-400 hover:bg-green-500/10 px-8 transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <a
                    href="https://wa.me/919872133840"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 text-sm text-slate-300">
                {[
                  "500+ Installations",
                  "Trusted Brands",
                  "Expert Team",
                  "PAN India Support",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[30px] border border-white/10 shadow-2xl group">

                <Image
                  src="/images/service-cctv.png"
                  alt="Security Services"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 p-5">
                  <div className="flex items-center gap-3">
                    <Shield className="h-10 w-10 text-blue-400" />

                    <div>
                      <h4 className="font-semibold text-white">
                        24/7 Smart Protection
                      </h4>

                      <p className="text-sm text-slate-300">
                        AI Surveillance & Monitoring
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-10 -right-10 h-52 w-52 rounded-full bg-blue-500/20 blur-3xl" />
            </motion.div>
          </div>
        </motion.div>

        {/* SERVICES */}
        <div className="space-y-28">
          {services.map((service, index) => {
            const Icon = service.icon
            const isEven = index % 2 === 0

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="grid lg:grid-cols-2 gap-14 items-center"
              >
                {/* IMAGE */}
                <div className={`${!isEven ? "lg:order-2" : ""}`}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.4 }}
                    className="relative overflow-hidden rounded-[30px] border border-white/10 shadow-2xl group"
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-black/50 backdrop-blur-md px-4 py-2">
                        <Icon className="h-5 w-5 text-cyan-400" />
                        <span className="text-sm text-white">
                          {service.shortDesc}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* CONTENT */}
                <div className={`space-y-6 ${!isEven ? "lg:order-1" : ""}`}>

                  <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 text-sm font-medium text-cyan-400">
                    <Icon className="h-4 w-4" />
                    Service #{String(index + 1).padStart(2, "0")}
                  </div>

                  <h2 className="text-3xl lg:text-4xl font-bold">
                    {service.title}
                  </h2>

                  <p className="text-slate-300 leading-relaxed">
                    {service.description}
                  </p>

                  {/* FEATURES */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.features.map((feature, featureIndex) => (
                      <motion.div
                        whileHover={{ x: 5 }}
                        key={`${service.id}-${featureIndex}`}
                        className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 p-3 backdrop-blur-md"
                      >
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />

                        <span className="text-sm text-slate-300">
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* BRANDS */}
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-sm text-slate-400 mb-3">
                      Trusted Brands
                    </p>

                    <div className="flex flex-wrap gap-3">
                      {service.brands.map((brand, brandIndex) => (
                        <span
                          key={`${service.id}-${brandIndex}`}
                          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300 transition-all duration-300 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/30"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex flex-wrap gap-4 pt-4">
                    <Button
                      className="rounded-full bg-cyan-500 hover:bg-cyan-600 text-white transition-all duration-300 hover:scale-105"
                      asChild
                    >
                      <Link href="/contact">
                        Get Free Quote
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      className="rounded-full border-green-500 text-green-400 hover:bg-green-500/10 transition-all duration-300 hover:scale-105"
                      asChild
                    >
                      <a
                        href="https://wa.me/919872133840"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Chat on WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* FINAL CTA */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative overflow-hidden mt-28 rounded-[35px] border border-white/10 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-blue-950/40 p-10 lg:p-16 text-center shadow-2xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.15),transparent_40%)]" />

          <Shield className="relative z-10 mx-auto mb-6 h-14 w-14 text-cyan-400" />

          <h3 className="relative z-10 text-3xl lg:text-4xl font-bold mb-5">
            Need a Customized Security Solution?
          </h3>

          <p className="relative z-10 mx-auto max-w-3xl text-slate-300 leading-relaxed mb-8">
            Our experts will analyze your requirements and recommend
            the best CCTV, biometric, networking, fire safety,
            access control, and smart automation solutions
            according to your property and budget.
          </p>

          <div className="relative z-10 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="rounded-full bg-cyan-500 hover:bg-cyan-600 px-8 transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link href="/contact">
                Schedule Free Consultation
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              asChild
            >
              <a href="tel:+919872133840">
                Call: +91 98721 33840
              </a>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-green-500 text-green-400 hover:bg-green-500/10 px-8 transition-all duration-300 hover:scale-105"
              asChild
            >
              <a
                href="https://wa.me/919872133840"
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}