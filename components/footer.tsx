import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { services } from "@/lib/services"

const companyLinks = [["Home", "/"], ["About VisionSecure", "/about"], ["Services", "/services"], ["Gallery", "/gallery"], ["Blogs", "/blog"], ["Contact Us", "/contact"]]
const serviceGroups = [
  { title: "Security & Surveillance", categories: ["Security & Surveillance"] },
  { title: "Networking & IT", categories: ["Networking & IT"] },
  { title: "Smart Technology & Safety", categories: ["Smart Technology", "Alarm & Safety"] },
]
const socials = [
  { Icon: Youtube, href: "https://www.youtube.com/@visionsecure_tech", label: "YouTube" },
  { Icon: Instagram, href: "https://www.instagram.com/visionsecure_tech/", label: "Instagram" },
  { Icon: Facebook, href: "https://www.facebook.com/profile.php?id=61584897029759", label: "Facebook" },
]
const linkClass = "inline-flex min-h-10 items-center rounded py-2 text-sm leading-6 transition hover:text-brand-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"

export function Footer() {
  return <footer className="border-t border-border bg-secondary text-muted-foreground">
    <div className="page-container py-12 lg:py-16">
      <div className="grid gap-10 border-b border-border pb-10 lg:grid-cols-[1.1fr_2fr] lg:gap-16">
        <div className="max-w-md">
          <Link href="/" aria-label="VisionSecure home" className="inline-block rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"><Image src="/images/Visionsecuretech_logo.png" alt="VisionSecure Smart Technologies" width={300} height={84} className="h-16 max-w-full w-auto object-contain dark:rounded-md dark:bg-white dark:p-2" /></Link>
          <p className="mt-5 text-sm leading-7">VisionSecure Smart Technologies provides CCTV installation, networking, biometric attendance and smart technology solutions for homes, shops, offices and institutions in Lucknow.</p>
          <div className="mt-5 flex gap-3">{socials.map(({ Icon, href, label }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground transition hover:border-primary hover:text-brand-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"><Icon size={18} aria-hidden="true" /></a>)}</div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <nav aria-label="Footer company"><h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Company</h2><ul className="mt-3 grid grid-cols-2 gap-x-4">{companyLinks.map(([label, href]) => <li key={href}><Link href={href} className={linkClass}>{label}</Link></li>)}</ul></nav>
          <nav aria-label="Footer support"><h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Support</h2><ul className="mt-3 grid grid-cols-2 gap-x-4">
            <li><Link href="/faq" className={linkClass}>FAQs</Link></li><li><Link href="/contact" className={linkClass}>Request a Quote</Link></li>
            <li><a href="tel:+919872133840" className={linkClass}>Call Us</a></li><li><a href="https://wa.me/919872133840" target="_blank" rel="noopener noreferrer" className={linkClass}>WhatsApp Us<FaWhatsapp className="ml-2 h-4 w-4 shrink-0" aria-hidden="true" /></a></li>
          </ul></nav>
        </div>
      </div>
      <div className="grid gap-9 py-10 md:grid-cols-3">
        {serviceGroups.map(group => <nav key={group.title} aria-label={`Footer ${group.title}`}><h2 className="text-sm font-bold uppercase tracking-wider text-foreground">{group.title}</h2><ul className="mt-3 space-y-1">{services.filter(service => group.categories.includes(service.category)).map(service => <li key={service.slug}><Link href={`/services/${service.slug}`} className={linkClass}>{service.slug === "wifi-mesh-networking" ? "Wi-Fi & Mesh Networking" : service.title}</Link></li>)}</ul></nav>)}
      </div>
      <div className="grid gap-4 border-t border-border pt-6 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <a className="inline-flex min-h-11 items-center gap-3 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary" href="tel:+919872133840"><Phone size={18} className="shrink-0 text-brand-green" aria-hidden="true" />+91 98721 33840</a>
        <a className="inline-flex min-h-11 min-w-0 items-center gap-3 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary" href="mailto:info@visionsecuretech.in"><Mail size={18} className="shrink-0 text-brand-green" aria-hidden="true" /><span className="break-all">info@visionsecuretech.in</span></a>
        <span className="inline-flex min-h-11 items-center gap-3"><MapPin size={18} className="shrink-0 text-brand-green" aria-hidden="true" />Lucknow, Uttar Pradesh</span>
      </div>
    </div>
    <div className="border-t border-border"><div className="page-container flex flex-col justify-between gap-2 py-5 text-xs leading-6 sm:flex-row"><span>© {new Date().getFullYear()} VisionSecure Smart Technologies.</span><span>Security and IT solutions with professional support.</span></div></div>
  </footer>
}
