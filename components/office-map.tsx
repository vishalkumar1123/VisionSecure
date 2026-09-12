import { Mail, MapPin, Navigation, Phone } from "lucide-react"

type OfficeMapProps = { className?: string }

const officeMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.02858849074!2d80.82520699999999!3d26.839043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x800d7bab5b50735b%3A0x9a5ae50eeeff92e4!2sVisionSecure%20Smart%20Technologies!5e0!3m2!1sen!2sin!4v1786645919918!5m2!1sen!2sin"
const directionsUrl = "https://maps.google.com/?cid=5167156942475472384"

export function OfficeMap({ className = "" }: OfficeMapProps) {
  return (
    <section className={`overflow-hidden rounded-lg border border-border bg-card shadow-xl ${className}`} aria-labelledby="office-location-heading">
      <div className="grid lg:grid-cols-[.85fr_1.15fr]">
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[.14em] text-accent">Visit our office</p>
          <h2 id="office-location-heading" className="mt-3 font-display text-2xl font-semibold text-foreground sm:text-3xl">VisionSecure Smart Technologies</h2>
          <div className="mt-6 space-y-4 text-sm leading-6 text-muted-foreground">
            <p className="flex gap-3"><MapPin className="mt-1 h-4 w-4 shrink-0 text-accent" /><span>153, Pili Market, Near Ram Lal Marriage Lawn, Narouna, Kakori Mod, Mohan Road, Lucknow, Uttar Pradesh - 227107</span></p>
            <a href="tel:+919872133840" className="flex w-fit items-center gap-3 transition hover:text-accent"><Phone className="h-4 w-4 text-accent" />+91 98721 33840</a>
            <a href="mailto:info@visionsecuretech.in" className="flex w-fit items-center gap-3 transition hover:text-accent"><Mail className="h-4 w-4 text-accent" />info@visionsecuretech.in</a>
          </div>
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90"><Navigation className="h-4 w-4" />Get Directions</a>
        </div>
        <div className="min-h-[320px] lg:min-h-full"><iframe src={officeMapUrl} className="h-full min-h-[320px] w-full" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" title="VisionSecure Smart Technologies office location" /></div>
      </div>
    </section>
  )
}
