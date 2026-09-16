import { cn } from "@/lib/utils"

type SectionHeadingProps = { eyebrow?: string; title: string; description?: string; align?: "left" | "center"; className?: string }

export function SectionHeading({ eyebrow, title, description, align = "left", className }: SectionHeadingProps) {
  return <header className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
    {eyebrow && <p className="text-sm font-semibold uppercase tracking-[.16em] text-brand-green">{eyebrow}</p>}
    <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
    {description && <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>}
  </header>
}
