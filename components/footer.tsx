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
  ArrowUpRight,
  ShieldCheck,
  Clock3,
  Headphones,
} from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
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
    href: "https://www.youtube.com/@visionsecure_tech",
    label: "YouTube",
    hover: "hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-2 hover:rotate-3",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/visionsecure_tech/",
    label: "Instagram",
    hover: "hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600 hover:text-white hover:border-pink-500 hover:shadow-xl hover:shadow-pink-500/30 hover:-translate-y-2 hover:-rotate-3",
  },
  {
    icon: Facebook,
    href: "https://www.facebook.com/profile.php?id=61584897029759",
    label: "Facebook",
    hover: "hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-2 hover:rotate-3",
  },
  {
    icon: FaWhatsapp,
    href: "https://wa.me/919872133840",
    label: "WhatsApp",
    hover: "hover:bg-green-500 hover:text-white hover:border-green-500 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-2 hover:rotate-3",
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
    title: "Priority Assistance",
    desc: "Dedicated and quick support for your peace of mind",
  },
]

export function Footer() {
  const mapUrl = "https://www.google.com/maps?q=26.8394674,80.8251153&z=17&hl=en"

  return (
    <footer className="relative overflow-hidden border-t border-zinc-200/80 bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] text-zinc-800 [perspective:1200px]">
      
      {/* --- 3D IT-RELATED BACKGROUND ANIMATIONS --- */}
      
      {/* 1. Moving Tech Grid (IT/Data Flow Theme) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.25] bg-[linear-gradient(to_right,#94a3b8_1px,transparent_1px),linear-gradient(to_bottom,#94a3b8_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_20%,#000_60%,transparent_100%)]" 
        style={{
          animation: 'gridDrift 40s linear infinite',
        }}
      />
      
      {/* 2. Floating IT Symbols & Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-[0.12] text-blue-900 font-mono text-sm">
        {/* Element 1: Code tag */}
        <div className="absolute top-[10%] left-[8%] animate-bounce [animation-duration:8s]">&lt;/&gt; CODE</div>
        {/* Element 2: Binary code */}
        <div className="absolute top-[40%] left-[45%] rotate-12 animate-pulse [animation-duration:4s]">01101001</div>
        {/* Element 3: Braces */}
        <div className="absolute top-[25%] right-[12%] -rotate-12 animate-bounce [animation-duration:11s]">&#123; Object &#125;</div>
        {/* Element 4: Network Node symbol text */}
        <div className="absolute bottom-[35%] left-[15%] rotate-45 animate-pulse [animation-duration:6s]">[ IP_CONFIG ]</div>
        {/* Element 5: AI Tech token */}
        <div className="absolute bottom-[20%] right-[25%] animate-bounce [animation-duration:9s]">SYS_INIT // AI</div>
        {/* Element 6: Secure Shell */}
        <div className="absolute top-[65%] left-[32%] -rotate-6 animate-pulse [animation-duration:7s]">SECURE_PORT: 443</div>
      </div>

      {/* 3. Glowing Cyber Blur Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse [animation-duration:7s]" />
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse [animation-duration:10s]" />

      {/* Top Feature Strip */}
      <div className="relative border-b border-slate-200 bg-white/50 backdrop-blur-md z-10">
        <div className="container mx-auto grid gap-6 px-4 py-8 md:grid-cols-3 lg:px-8">
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <div
                key={feature.title}
                className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-md transition-all duration-500 hover:-translate-y-1.5 hover:border-blue-500/40 hover:bg-white hover:shadow-[0_25px_50px_-12px_rgba(59,130,246,0.1)]"
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/20">
                  <Icon className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="mb-1 text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-6 text-slate-600 font-medium">
                    {feature.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative container mx-auto px-4 py-16 lg:px-8 lg:py-20 z-10">
        <div className="grid gap-14 lg:grid-cols-12">
          
          {/* Brand & Contact Cards Section */}
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center transition-transform duration-300 hover:scale-102"
            >
              <Image
                src="/images/logo.png"
                alt="VisionSecure Smart Technologies"
                width={280}
                height={85}
                priority
                className="h-16 w-auto object-contain"
              />
            </Link>

            <p className="mt-6 max-w-lg text-sm leading-8 text-slate-600 font-semibold opacity-90">
              VisionSecure Smart Technologies provides advanced CCTV
              surveillance, biometric systems, access control, networking,
              smart automation, and fire alarm solutions for homes,
              businesses, schools, offices, and industries across India.
            </p>

            {/* --- 3D INTERACTIVE CARDS --- */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2 [transform-style:preserve-3d]">
              
              {/* Phone Card */}
              <a
                href="tel:+919872133840"
                className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white/90 p-4 transition-all duration-500 will-change-transform hover:[transform:rotateX(7deg)_rotateY(-7deg)_translateZ(20px)] hover:border-blue-500 hover:bg-white hover:shadow-[0_20px_40px_rgba(59,130,246,0.12)]"
              >
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:[transform:translateZ(12px)]">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="transition-all duration-300 group-hover:[transform:translateZ(6px)]">
                  <p className="text-xs uppercase tracking-wide text-slate-400 font-extrabold">Call Us</p>
                  <p className="mt-1 text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300 whitespace-nowrap">
                    +91 98721 33840
                  </p>
                </div>
              </a>

              {/* WhatsApp Card */}
              <a
                href="https://wa.me/919872133840"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white/90 p-4 transition-all duration-500 will-change-transform hover:[transform:rotateX(7deg)_rotateY(7deg)_translateZ(20px)] hover:border-green-500 hover:bg-white hover:shadow-[0_20px_40px_rgba(34,197,94,0.12)]"
              >
                <div className="rounded-xl bg-green-50 p-3 text-green-600 transition-all duration-300 group-hover:bg-green-500 group-hover:text-white group-hover:[transform:translateZ(12px)]">
                  <FaWhatsapp className="h-5 w-5" />
                </div>
                <div className="transition-all duration-300 group-hover:[transform:translateZ(6px)]">
                  <p className="text-xs uppercase tracking-wide text-slate-400 font-extrabold">WhatsApp</p>
                  <p className="mt-1 text-sm font-bold text-slate-900 group-hover:text-green-600 transition-colors duration-300">
                    Chat Support
                  </p>
                </div>
              </a>

              {/* Email Card */}
              <a
                href="mailto:info@visionsecuretech.in"
                className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white/90 p-4 transition-all duration-500 will-change-transform hover:[transform:rotateX(-7deg)_rotateY(-7deg)_translateZ(20px)] hover:border-blue-500 hover:bg-white hover:shadow-[0_20px_40px_rgba(59,130,246,0.12)]"
              >
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:[transform:translateZ(12px)]">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="transition-all duration-300 group-hover:[transform:translateZ(6px)]">
                  <p className="text-xs uppercase tracking-wide text-slate-400 font-extrabold">Email</p>
                  <p className="mt-1 text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300 break-all">
                    info@visionsecuretech.in
                  </p>
                </div>
              </a>

              {/* Location Card */}
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white/90 p-4 transition-all duration-500 will-change-transform hover:[transform:rotateX(-7deg)_rotateY(7deg)_translateZ(20px)] hover:border-blue-500 hover:bg-white hover:shadow-[0_20px_40px_rgba(59,130,246,0.12)]"
              >
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600 shrink-0 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:[transform:translateZ(12px)]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="transition-all duration-300 group-hover:[transform:translateZ(6px)]">
                  <p className="text-xs uppercase tracking-wide text-slate-400 font-extrabold">Location</p>
                  <p className="mt-1 text-xs font-bold leading-5 text-slate-800 group-hover:text-blue-600 transition-colors duration-300">
                    153 Pili Market, Mohan Road, Lucknow, UP
                  </p>
                </div>
              </a>

            </div>

            {/* Social Media */}
            <div className="mt-10">
              <h3 className="mb-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Follow Our Journey
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
                        "group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 text-slate-600 shadow-sm transition-all duration-500 hover:shadow-2xl",
                        social.hover
                      )}
                    >
                      <Icon className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Links & Map Section */}
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-3">
            
            {/* Services Column */}
            <div>
              <h3 className="mb-6 text-sm font-bold text-slate-950 uppercase tracking-wider relative after:content-[''] after:block after:w-8 after:h-[2px] after:bg-blue-600 after:mt-2">
                Services
              </h3>
              <ul className="space-y-4">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition-colors duration-300 hover:text-blue-600 relative py-0.5"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5 -ml-5 opacity-0 text-blue-600 transition-all duration-300 transform -translate-x-2 group-hover:ml-0 group-hover:opacity-100 group-hover:translate-x-0" />
                      <span className="relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1.5px] before:bg-blue-600 before:transition-all before:duration-300 group-hover:before:w-full">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="mb-6 text-sm font-bold text-slate-950 uppercase tracking-wider relative after:content-[''] after:block after:w-8 after:h-[2px] after:bg-blue-600 after:mt-2">
                Company
              </h3>
              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition-colors duration-300 hover:text-blue-600 relative py-0.5"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5 -ml-5 opacity-0 text-blue-600 transition-all duration-300 transform -translate-x-2 group-hover:ml-0 group-hover:opacity-100 group-hover:translate-x-0" />
                      <span className="relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1.5px] before:bg-blue-600 before:transition-all before:duration-300 group-hover:before:w-full">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Live Map */}
            <div className="space-y-6">
              <div>
                <h3 className="mb-6 text-sm font-bold text-slate-950 uppercase tracking-wider relative after:content-[''] after:block after:w-8 after:h-[2px] after:bg-blue-600 after:mt-2">
                  Support
                </h3>
                <ul className="space-y-4">
                  {footerLinks.support.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition-colors duration-300 hover:text-blue-600 relative py-0.5"
                      >
                        <ArrowUpRight className="h-3.5 w-3.5 -ml-5 opacity-0 text-blue-600 transition-all duration-300 transform -translate-x-2 group-hover:ml-0 group-hover:opacity-100 group-hover:translate-x-0" />
                        <span className="relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1.5px] before:bg-blue-600 before:transition-all before:duration-300 group-hover:before:w-full">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Map Card with 3D Pop Glow */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white p-1.5 shadow-md transition-all duration-500 hover:border-blue-500/40 hover:shadow-[0_20px_40px_rgba(59,130,246,0.1)] hover:-translate-y-1">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3559.7153625732287!2d80.8251153!3d26.8394674!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDUwJzIyLjEiTiA4MMKwNDknMzAuNCJF!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                  width="100%"
                  height="150"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl opacity-95 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyrights */}
      <div className="relative border-t border-slate-200 bg-slate-200/50 backdrop-blur-md z-10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-5 px-4 py-6 text-xs text-slate-500 md:flex-row lg:px-8">
          <p className="text-center md:text-left font-bold">
            © {new Date().getFullYear()} VisionSecure Smart Technologies. All Rights Reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 font-bold">
            <Link href="/privacy-policy" className="transition-colors hover:text-blue-600">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-blue-600">
              Terms & Conditions
            </Link>
            <Link href="/contact" className="transition-colors hover:text-blue-600">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Pulsing Floating 3D WhatsApp Button */}
      <Button
        size="lg"
        asChild
        className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 p-0 text-white shadow-[0_15px_30px_rgba(34,197,94,0.35)] transition-all duration-300 hover:scale-115 hover:shadow-[0_20px_45px_rgba(34,197,94,0.6)] hover:-translate-y-1 active:scale-95 animate-bounce [animation-duration:4s]"
      >
        <a
          href="https://wa.me/919872133840"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp className="h-7 w-7 animate-pulse" />
        </a>
      </Button>
    </footer>
  )
}