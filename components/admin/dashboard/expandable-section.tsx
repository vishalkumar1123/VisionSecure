import type { ReactNode } from "react"
import { ChevronDown } from "lucide-react"

export function ExpandableSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return <details className="group min-w-0 self-start rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-lg [&::-webkit-details-marker]:hidden">
      <div><h2 className="text-lg font-bold">{title}</h2>{description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}</div>
      <ChevronDown aria-hidden="true" size={20} className="shrink-0 text-brand-green transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" />
    </summary>
    <div className="mt-3 border-t border-border pt-3">{children}</div>
  </details>
}
