import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { services } from "@/lib/services"
import { SectionHeading } from "@/components/section-heading"

const groups = ["Security & Surveillance", "Networking & IT", "Smart Technology", "Alarm & Safety"]
const copy: Record<string, [string, string]> = {
  "cctv-surveillance": ["Plan camera coverage, recording storage or an upgrade to the equipment already at your property.", "Explore CCTV Installation"],
  "biometric-attendance": ["Choose attendance tools around employee numbers, shift patterns and the reports your team needs.", "Explore Attendance Systems"],
  "access-control-system": ["Plan who can enter each door or area, the access methods they need and how permissions will be managed.", "Explore Access Control"],
  "video-door-phone": ["Discuss entrance monitoring, two-way visitor communication and where you need an indoor display.", "Explore Video Door Phones"],
  "networking-solutions": ["Connect computers, printers and other fixed devices with planned LAN points and organised cable routes.", "Explore Office Networking"],
  "wifi-mesh-networking": ["Identify weak-signal rooms and floors so access-point or mesh placement can be assessed for your layout.", "Explore Wi-Fi and Mesh"],
  "it-support-amc": ["Describe the issue with your existing security or IT equipment, or discuss a defined maintenance scope.", "Explore Support and AMC"],
  "server-networking-infrastructure": ["Plan rack space, patch panels, switching and power requirements around your existing infrastructure.", "Explore Network Infrastructure"],
  "smart-door-locks": ["Review door fit, access methods, battery requirements and a suitable backup way to enter.", "Explore Smart Door Locks"],
  "home-automation": ["Choose the lighting or compatible devices you want to control and assess the wiring and integration needed.", "Explore Home Automation"],
  "speaker-solutions": ["Share which areas need music or announcements so speaker placement, zones and coverage can be planned.", "Explore Speaker Solutions"],
  "glass-break-alarm-system": ["Assess glass doors, windows or display areas and discuss detector placement with a compatible alarm system.", "Explore Glass Break Alarms"],
  "emergency-alarm-system": ["Plan alert points and the notification paths needed at your site, subject to the selected system’s capabilities.", "Explore Emergency Alarms"],
}

export function ServicesSection() {
  return <section id="services" className="bg-background py-16 lg:py-24">
    <div className="page-container">
      <SectionHeading align="center" eyebrow="Explore our services" title="CCTV, Networking and Smart Technology Services in Lucknow" description="Plan security, connectivity and everyday technology around your property and the people using it." />
      <p className="mx-auto mt-6 max-w-3xl text-center leading-7 text-muted-foreground">For a home, shop, office or institution, start with the problem you want to solve. Choose a service below to review the scope and the details that help us assess your requirement.</p>
      <div className="mt-12 space-y-12">
        {groups.map(category => <section key={category} aria-label={category}>
          <div className="mb-5 flex items-center gap-4"><h3 className="font-display text-xl font-bold text-foreground sm:text-2xl">{category}</h3><span className="h-px flex-1 bg-border" /></div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {services.filter(service => service.category === category).map(service => {
              const Icon = service.icon
              const [description, label] = copy[service.slug]
              return <Link key={service.slug} href={`/services/${service.slug}`} className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:border-primary/70 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                <div className="relative h-40 overflow-hidden"><Image src={service.image} alt={`${service.title} illustration`} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw" className="object-cover transition group-hover:scale-[1.03]" /></div>
                <div className="flex flex-1 flex-col p-5"><Icon className="mb-3 h-6 w-6 text-brand-green" aria-hidden="true" /><h4 className="font-display text-lg font-bold text-foreground">{service.title}</h4><p className="mb-5 mt-3 text-sm leading-6 text-muted-foreground">{description}</p><span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand-ink">{label}<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></span></div>
              </Link>
            })}
          </div>
        </section>)}
      </div>
      <div className="mt-10 text-center"><Link href="/services" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-semibold text-foreground hover:border-primary">View All Services<ArrowRight className="h-4 w-4" /></Link></div>
    </div>
  </section>
}
