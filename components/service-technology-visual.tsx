import { Camera, House, Network, Radio, Server, ShieldCheck, Smartphone, Wifi } from "lucide-react"

type ServiceTechnologyVisualProps = {
  category: "Security & Surveillance" | "Networking & IT" | "Smart Technology" | "Alarm & Safety"
  title: string
}

const visualByCategory = {
  "Security & Surveillance": {
    Icon: Camera,
    label: "Protected property",
    nodes: [
      { Icon: Camera, label: "Field device" },
      { Icon: Server, label: "Recorder / controller" },
      { Icon: Smartphone, label: "Secure monitoring" },
    ],
  },
  "Networking & IT": {
    Icon: Network,
    label: "Connected infrastructure",
    nodes: [
      { Icon: Wifi, label: "Internet / gateway" },
      { Icon: Radio, label: "Managed network" },
      { Icon: Server, label: "Devices & systems" },
    ],
  },
  "Smart Technology": {
    Icon: House,
    label: "Smart environment",
    nodes: [
      { Icon: Wifi, label: "Reliable connection" },
      { Icon: House, label: "Connected devices" },
      { Icon: Smartphone, label: "Simple control" },
    ],
  },
  "Alarm & Safety": {
    Icon: ShieldCheck,
    label: "Protected premises",
    nodes: [
      { Icon: ShieldCheck, label: "Detection" },
      { Icon: Radio, label: "Alert controller" },
      { Icon: Smartphone, label: "Notification" },
    ],
  },
} as const

export function ServiceTechnologyVisual({ category, title }: ServiceTechnologyVisualProps) {
  const visual = visualByCategory[category]
  const MainIcon = visual.Icon

  return (
    <section className="bg-muted" aria-labelledby="technology-visual-heading">
      <div className="page-container section-space grid items-center gap-12 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.18em] text-brand-ink">How the technology connects</p>
          <h2 id="technology-visual-heading" className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
            One coordinated {title.toLowerCase()} system.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
            Equipment, connectivity and user access are planned together. This simplified illustration explains the system flow; final placement and coverage depend on the site survey.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[24px] border border-border bg-card p-6 shadow-[0_18px_45px_rgba(11,47,99,.10)] sm:p-9">
          <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(8,168,232,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(8,168,232,.08)_1px,transparent_1px)] [background-size:32px_32px]" aria-hidden="true" />
          <div className="relative flex flex-col items-center">
            <div className="flex min-h-28 w-full max-w-sm items-center justify-center gap-4 rounded-2xl border border-accent/40 bg-secondary p-5 shadow-[0_10px_30px_rgba(11,47,99,.08)] [transform:perspective(900px)_rotateX(3deg)]">
              <span className="rounded-2xl bg-primary p-4 text-primary-foreground"><MainIcon className="h-8 w-8" aria-hidden="true" /></span>
              <div><p className="text-xs font-bold uppercase tracking-wider text-brand-green">System centre</p><p className="mt-1 font-display text-lg font-bold text-foreground">{visual.label}</p></div>
            </div>
            <div className="h-10 w-px bg-gradient-to-b from-accent to-highlight" aria-hidden="true" />
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
              {visual.nodes.map(({ Icon, label }) => (
                <div key={label} className="vs-card relative flex min-h-28 flex-col items-center justify-center p-4 text-center transition duration-300 hover:-translate-y-1">
                  <Icon className="h-6 w-6 text-highlight-ink" aria-hidden="true" />
                  <p className="mt-3 text-sm font-semibold text-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
