"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRight, ChevronDown, Menu, Phone, X } from "lucide-react"
import { services } from "@/lib/services"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

const navLinks = [{ href: "/gallery", label: "Gallery" }, { href: "/blog", label: "Blog" }, { href: "/faq", label: "FAQ" }, { href: "/contact", label: "Contact" }]
const categories = ["Security & Surveillance", "Networking & IT", "Smart Technology", "Alarm & Safety"] as const

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current) }
  const scheduleClose = () => { cancelClose(); closeTimer.current = setTimeout(() => setServicesOpen(false), 200) }

  useEffect(() => { const update = () => setScrolled(window.scrollY > 16); update(); window.addEventListener("scroll", update, { passive: true }); return () => window.removeEventListener("scroll", update) }, [])
  useEffect(() => { setMobileOpen(false); setServicesOpen(false) }, [pathname])
  useEffect(() => { document.body.style.overflow = mobileOpen ? "hidden" : ""; return () => { document.body.style.overflow = "" } }, [mobileOpen])
  useEffect(() => { const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setServicesOpen(false); setMobileOpen(false) } }; document.addEventListener("keydown", close); return () => document.removeEventListener("keydown", close) }, [])
  useEffect(() => { const outside = (event: MouseEvent) => { if (!menuRef.current?.contains(event.target as Node)) setServicesOpen(false) }; document.addEventListener("mousedown", outside); return () => document.removeEventListener("mousedown", outside) }, [])

  const serviceActive = pathname === "/services" || pathname.startsWith("/services/")

  return <header className={cn("fixed inset-x-0 top-0 z-50 border-b transition duration-300", scrolled ? "border-border/80 bg-background/95 shadow-lg shadow-black/10 backdrop-blur-md" : "border-transparent bg-secondary/95")}>
    <nav className="page-container flex h-[72px] items-center justify-between" aria-label="Primary navigation">
      <Link href="/" className="shrink-0 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent" aria-label="VisionSecure home"><Image src="/images/Visionsecuretech_logo.png" alt="VisionSecure Smart Technologies" width={250} height={70} priority className="h-11 w-auto object-contain sm:h-12 dark:rounded-md dark:bg-white dark:p-1" /></Link>
      <div className="hidden items-center gap-5 xl:flex">
        <Link href="/" className={cn("nav-link", pathname === "/" && "nav-link-active")}>Home</Link>
        <Link href="/about" className={cn("nav-link", pathname === "/about" && "nav-link-active")}>About</Link>
        <div ref={menuRef} className="relative" onMouseEnter={() => { cancelClose(); setServicesOpen(true) }} onMouseLeave={scheduleClose} onFocusCapture={() => { cancelClose(); setServicesOpen(true) }} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) scheduleClose() }}>
          <button type="button" onClick={() => setServicesOpen((value) => !value)} onKeyDown={(event) => { if (event.key === " " || event.key === "Enter") { event.preventDefault(); setServicesOpen(true) } }} aria-expanded={servicesOpen} aria-haspopup="true" aria-controls="services-mega-menu" className={cn("nav-link inline-flex items-center gap-1", serviceActive && "nav-link-active")}>Services <ChevronDown className={cn("h-4 w-4 transition", servicesOpen && "rotate-180")} /></button>
          <div id="services-mega-menu" aria-hidden={!servicesOpen} className={cn("absolute left-1/2 top-[calc(100%+18px)] w-[820px] -translate-x-1/2 rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl shadow-black/35 transition duration-200", servicesOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0")}>
            <div className="mb-5 flex items-end justify-between border-b border-border pb-4"><div><p className="text-sm font-semibold uppercase tracking-[.16em] text-highlight-ink">Services</p><p className="mt-1 text-sm text-muted-foreground">Complete Security, Networking, IT & Smart Solutions</p></div><Link href="/services" className="inline-flex items-center gap-1 rounded text-sm font-semibold text-highlight-ink hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-highlight">View all services <ArrowRight className="h-4 w-4" /></Link></div>
            <div className="grid grid-cols-2 gap-x-9 gap-y-5">{categories.map((category) => <section key={category}><h2 className="mb-2 text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">{category}</h2>{services.filter((service) => service.category === category).map((service) => { const Icon = service.icon; return <Link key={service.slug} href={`/services/${service.slug}`} className="group flex min-h-10 items-center gap-2 rounded-lg px-2 py-2 text-sm text-foreground transition hover:bg-highlight/80 hover:text-highlight-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-highlight"><Icon className="h-4 w-4 shrink-0 text-highlight-ink transition group-hover:scale-110" aria-hidden="true" />{service.title}<ArrowRight className="ml-auto h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" aria-hidden="true" /></Link> })}</section>)}</div>
          </div>
        </div>
        {navLinks.map((link) => <Link key={link.href} href={link.href} className={cn("nav-link", pathname === link.href && "nav-link-active")}>{link.label}</Link>)}
      </div>
      <div className="hidden items-center gap-4 xl:flex"><a href="tel:+919872133840" className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-bold text-brand-ink transition hover:bg-muted"><Phone size={15} />Call Now</a><Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-[0_8px_22px_rgba(121,201,20,.25)] transition hover:-translate-y-0.5 hover:bg-brand-hover"><ArrowRight size={15} />Get Free Site Visit</Link></div>
      <div className="flex items-center gap-2"><ThemeToggle />
      <button onClick={() => setMobileOpen((value) => !value)} className="rounded-lg p-2 text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent xl:hidden" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} aria-controls="mobile-navigation">{mobileOpen ? <X /> : <Menu />}</button></div>
    </nav>
    <div id="mobile-navigation" className={cn("overflow-y-auto border-t border-border/70 bg-background transition-all duration-300 xl:hidden", mobileOpen ? "max-h-[calc(100dvh-72px)] opacity-100" : "max-h-0 opacity-0")}><div className="page-container py-3"><Link href="/" className="mobile-nav-link">Home</Link><Link href="/about" className="mobile-nav-link">About</Link><div className="border-b border-border/50"><button type="button" onClick={() => setMobileServicesOpen((value) => !value)} aria-expanded={mobileServicesOpen} className="mobile-nav-link flex w-full items-center justify-between">Services <ChevronDown className={cn("h-4 w-4 transition", mobileServicesOpen && "rotate-180")} /></button>{mobileServicesOpen && <div className="ml-3 border-l border-border pb-2 pl-3">{categories.map((category) => <div key={category} className="py-2"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{category}</p>{services.filter((service) => service.category === category).map((service) => <Link key={service.slug} href={`/services/${service.slug}`} className="block min-h-11 py-3 text-sm hover:text-brand-green">{service.title}</Link>)}</div>)}<Link href="/services" className="block py-3 text-sm font-semibold text-brand-green">View all services →</Link></div>}</div>{navLinks.map((link) => <Link key={link.href} href={link.href} className="mobile-nav-link">{link.label}</Link>)}<Link href="/contact" className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground"><ArrowRight size={16} />Get a Quote</Link></div></div>
  </header>
}
