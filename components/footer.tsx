import Image from "next/image"
import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"
import { services } from "@/lib/services"

const companyLinks = [["Home", "/"], ["About VisionSecure", "/about"], ["Services", "/services"], ["Gallery", "/gallery"], ["Blogs", "/blog"], ["Contact Us", "/contact"]]
const serviceGroups = [
  { title: "Security & Surveillance", categories: ["Security & Surveillance"] },
  { title: "Networking & IT", categories: ["Networking & IT"] },
  { title: "Smart Technology & Safety", categories: ["Smart Technology", "Alarm & Safety"] },
]
const linkClass = "inline-flex min-h-10 items-center rounded py-2 text-sm leading-6 transition hover:text-brand-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"

export function Footer() {
  return <footer className="border-t border-border bg-secondary text-muted-foreground">
    <div className="page-container py-10 lg:py-12">
      <div className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
        <div className="min-w-0">
        <Link href="/" aria-label="VisionSecure home" className="inline-block w-fit shrink-0 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"><Image src="/images/Visionsecuretech_logo.png" alt="VisionSecure Smart Technologies" width={300} height={84} className="h-14 max-w-full w-auto object-contain dark:rounded-md dark:bg-white dark:p-2" /></Link>

        </div>
        <div className="space-y-3 text-sm leading-7">
          <p>VisionSecure Smart Technologies offers CCTV surveillance, security systems, IT infrastructure, networking and smart technology solutions in Lucknow, Uttar Pradesh.</p>
          <p>Our services include CCTV camera installation and maintenance, biometric attendance systems, access control, video door phones, LAN networking, Wi-Fi and mesh Wi-Fi solutions, IT support, AMC services, server infrastructure, smart door locks, home automation, speaker systems, glass-break sensors and emergency alarm systems.</p>
          <p>We provide reliable and cost-effective technology solutions for homes, shops, offices, schools, colleges, hospitals, commercial establishments and other institutions.</p>
          <p>From consultation and system planning to installation, configuration, troubleshooting and ongoing technical support, we focus on delivering efficient, future-ready solutions tailored to each customer&apos;s needs.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 py-8 md:grid-cols-3 xl:grid-cols-[.85fr_1.1fr_1.15fr_1.2fr_.8fr] xl:gap-x-8">
        <nav aria-label="Footer company" className="min-w-0"><h2 className="text-sm font-bold text-foreground">Company</h2><ul className="mt-3">{companyLinks.map(([label, href]) => <li key={href}><Link href={href} className={linkClass}>{label}</Link></li>)}</ul></nav>
        {serviceGroups.map(group => <nav key={group.title} aria-label={`Footer ${group.title}`} className="min-w-0"><h2 className="text-sm font-bold leading-6 text-foreground">{group.title}</h2><ul className="mt-3">{services.filter(service => group.categories.includes(service.category)).map(service => <li key={service.slug}><Link href={`/services/${service.slug}`} className={linkClass}>{service.slug === "wifi-mesh-networking" ? "Wi-Fi & Mesh Networking" : service.title}</Link></li>)}</ul></nav>)}
        <nav aria-label="Footer support" className="col-span-2 min-w-0 pr-20 md:col-span-1 md:pr-0"><h2 className="text-sm font-bold text-foreground">Support</h2><ul className="mt-3 grid grid-cols-2 gap-x-6 md:block">
          <li><Link href="/faq" className={linkClass}>FAQs</Link></li><li><Link href="/contact" className={linkClass}>Request a Quote</Link></li>
          <li><a href="tel:+919872133840" className={linkClass}>Call Us</a></li><li><a href="https://wa.me/919872133840" target="_blank" rel="noopener noreferrer" className={linkClass}>WhatsApp Us</a></li>
        </ul></nav>
      </div>
      <div className="grid gap-3 rounded-2xl border border-border bg-card/60 px-4 py-3 text-sm sm:grid-cols-2 lg:grid-cols-3 lg:px-5">
        <a className="inline-flex min-h-11 items-center gap-3 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary" href="tel:+919872133840"><Phone size={18} className="shrink-0 text-brand-green" aria-hidden="true" />+91 98721 33840</a>
        <a className="inline-flex min-h-11 min-w-0 items-center gap-3 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary" href="mailto:info@visionsecuretech.in"><Mail size={18} className="shrink-0 text-brand-green" aria-hidden="true" /><span className="break-all">info@visionsecuretech.in</span></a>
        <a href="https://www.google.com/maps?cid=11122454082046890724" target="_blank" rel="noopener noreferrer" aria-label="VisionSecure office on Google Maps in Lucknow, Uttar Pradesh" className="inline-flex min-h-11 items-center gap-3 rounded hover:text-brand-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"><MapPin size={18} className="shrink-0 text-brand-green" aria-hidden="true" />Lucknow, Uttar Pradesh</a>
      </div>
      <div className="mt-6 flex flex-col justify-between gap-1 text-xs leading-6 sm:flex-row"><span>&copy; {new Date().getFullYear()} VisionSecure Smart Technologies.</span><span>Security and IT solutions with professional support.</span></div>
    </div>
  </footer>
}
