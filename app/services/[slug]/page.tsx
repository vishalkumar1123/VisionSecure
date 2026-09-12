import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle2, ChevronRight, ClipboardCheck, Cable, Settings2 } from "lucide-react"

import { serviceBySlug, services } from "@/lib/services"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ServiceDetailHeroSlider } from "@/components/service-detail-hero-slider"
import { ServiceTechnologyVisual } from "@/components/service-technology-visual"

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const service = serviceBySlug((await params).slug)

  return service
    ? {
        title: `${service.title} | VisionSecure Smart Technologies`,
        description: service.summary,
        alternates: { canonical: `/services/${service.slug}` },
        openGraph: { title: service.title, description: service.summary, images: [service.image] },
      }
    : {}
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const service = serviceBySlug((await params).slug)
  if (!service) notFound()

  const related = services.filter((item) => item.slug !== service.slug).sort((a, b) => Number(b.category === service.category) - Number(a.category === service.category)).slice(0, 3)
  const process = ["Requirement discussion", "Site assessment", "Solution design", "Technology selection", "Installation", "Configuration and testing", "Handover", "Support and AMC"]
  const systemComponents = service.category === "Networking & IT"
    ? ["Cabling and termination", "Router or gateway", "Managed switching", "Rack and power planning"]
    : service.category === "Security & Surveillance"
      ? ["Field devices and sensors", "Controller or recorder", "Power and cabling", "Monitoring and user access"]
      : service.category === "Alarm & Safety"
        ? ["Detection devices", "Control and alert unit", "Power backup", "Notification devices"]
        : ["Smart devices", "Control interface", "Reliable connectivity", "User configuration"]

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <ServiceDetailHeroSlider
        title={service.title}
        category={service.category}
        summary={service.summary}
        image={service.image}
        solutions={service.solutions}
        benefits={service.benefits}
      />

      <nav aria-label="Breadcrumb" className="page-container py-5 text-sm text-muted-foreground"><ol className="flex flex-wrap items-center gap-2"><li><Link href="/" className="hover:text-accent">Home</Link></li><ChevronRight className="h-4 w-4" aria-hidden="true" /><li><Link href="/services" className="hover:text-accent">Services</Link></li><ChevronRight className="h-4 w-4" aria-hidden="true" /><li aria-current="page" className="text-foreground">{service.title}</li></ol></nav>

      <section className="page-container grid items-center gap-10 pb-20 pt-10 lg:grid-cols-2">
        <div><p className="text-sm font-semibold uppercase tracking-[.18em] text-accent">Technology solution hub</p><h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">A properly planned {service.title.toLowerCase()} solution.</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{service.summary} We begin with your property, daily workflow and coverage needs so the equipment, infrastructure and installation work together as one maintainable system.</p><p className="mt-4 leading-7 text-muted-foreground">Suitable for {service.applications.join(", ").toLowerCase()}, with practical options for new installations, upgrades and ongoing support.</p></div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border"><Image src={service.image} alt={`${service.title} equipment and professional installation`} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 to-transparent" /></div>
      </section>

      <section className="page-container section-space grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-accent">Solutions we provide</p>
          <h2 className="mt-3 text-3xl font-bold">Designed for your site and workflow.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {service.solutions.map((item) => (
            <div key={item} className="rounded-xl border border-border bg-card p-5">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              <h3 className="mt-3 font-semibold">{item}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#061B38] text-white"><div className="page-container section-space"><p className="text-sm font-semibold uppercase tracking-[.18em] text-[#79C914]">How it works</p><h2 className="mt-3 font-display text-3xl font-bold">From requirement to reliable handover.</h2><div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{process.map((step, index) => <article key={step} className="relative rounded-2xl border border-white/10 bg-white/[.04] p-5"><span className="text-xs font-bold tracking-[.18em] text-[#79C914]">{String(index + 1).padStart(2, "0")}</span><h3 className="mt-3 font-semibold">{step}</h3>{index < process.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 text-[#08A8E8]/70 lg:block" aria-hidden="true" />}</article>)}</div></div></section>

      <section className="page-container section-space"><div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]"><div><p className="text-sm font-semibold uppercase tracking-[.18em] text-accent">System components</p><h2 className="mt-3 font-display text-3xl font-bold">The building blocks behind the solution.</h2><p className="mt-4 leading-7 text-muted-foreground">Final components are selected after site assessment and compatibility checks.</p></div><div className="grid gap-4 sm:grid-cols-2">{systemComponents.map((item, index) => { const Icon = [Cable, Settings2, ClipboardCheck, CheckCircle2][index]; return <article key={item} className="group rounded-xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-accent/60"><Icon className="h-6 w-6 text-accent" aria-hidden="true" /><h3 className="mt-4 font-semibold">{item}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Specified around site conditions, capacity, reliability and future maintenance.</p></article> })}</div></div></section>

      <section className="bg-secondary/35">
        <div className="page-container section-space">
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-accent">Why it matters</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {service.benefits.map((item) => (
              <article key={item} className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold">{item}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">A focused solution shaped around practical security and technology needs.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ServiceTechnologyVisual category={service.category} title={service.title} />

      <section className="page-container section-space">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-accent">Applications</p>
            <h2 className="mt-3 text-3xl font-bold">Where this solution fits.</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {service.applications.map((item) => <span key={item} className="rounded-full border border-border bg-card px-4 py-2 text-sm">{item}</span>)}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-accent">Frequently asked questions</p>
            <div className="mt-5 space-y-3">
              {service.faqs.map((faq) => (
                <details key={faq.question} className="rounded-xl border border-border bg-card p-5">
                  <summary className="cursor-pointer font-semibold">{faq.question}</summary>
                  <p className="mt-3 leading-7 text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 text-slate-950"><div className="page-container section-space"><p className="text-sm font-semibold uppercase tracking-[.18em] text-sky-700">Installation standards</p><div className="mt-5 grid gap-5 md:grid-cols-3"><article className="rounded-xl border border-slate-200 bg-white p-6"><h3 className="font-semibold">Clean infrastructure</h3><p className="mt-2 text-sm leading-6 text-slate-600">Planned routes, termination and equipment placement for a serviceable installation.</p></article><article className="rounded-xl border border-slate-200 bg-white p-6"><h3 className="font-semibold">Configuration and testing</h3><p className="mt-2 text-sm leading-6 text-slate-600">Functional checks, user configuration and verification before handover.</p></article><article className="rounded-xl border border-slate-200 bg-white p-6"><h3 className="font-semibold">Clear handover</h3><p className="mt-2 text-sm leading-6 text-slate-600">Practical guidance for operation, maintenance and support options.</p></article></div></div></section>

      <section className="bg-secondary/35">
        <div className="page-container section-space">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[.18em] text-accent">Related services</p>
              <h2 className="mt-3 text-3xl font-bold">Explore other solutions.</h2>
            </div>
            <Link href="/services" className="hidden text-sm font-semibold text-accent sm:block">View all services</Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link key={item.slug} href={`/services/${item.slug}`} className="group rounded-xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-accent/60">
                <item.icon className="h-6 w-6 text-accent" />
                <h3 className="mt-5 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.summary}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent">Explore <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#05101f] px-4 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold">Need the right security or IT solution?</h2>
          <p className="mt-4 text-slate-300">Tell us about your requirement and our team can help plan the right solution.</p>
          <Link href={`/contact?service=${encodeURIComponent(service.title)}`} className="mt-7 inline-flex rounded-xl bg-[#79C914] px-5 py-3 font-semibold text-white shadow-[0_8px_22px_rgba(121,201,20,.25)] transition hover:-translate-y-0.5 hover:bg-[#65AE0B]">Get free site visit</Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
