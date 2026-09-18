import { useEffect, useRef } from "react"
import { useReducedMotion } from "framer-motion"

export function AnalogClock({ now }: { now: Date | null }) {
  const secondHand = useRef<SVGLineElement>(null)
  const reducedMotion = useReducedMotion()
  const seconds = now?.getSeconds() ?? 0
  const minutes = (now?.getMinutes() ?? 0) + seconds / 60
  const hours = ((now?.getHours() ?? 0) % 12) + minutes / 60
  const time = now ? new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).format(now) : "--:--:--"

  useEffect(() => {
    if (!now || reducedMotion || !secondHand.current) return
    const angle = now.getSeconds() * 6
    const animation = secondHand.current.animate(
      [{ transform: `rotate(${angle}deg)` }, { transform: `rotate(${angle + 6}deg)` }],
      { duration: 1000, easing: "linear", fill: "forwards" },
    )
    return () => animation.cancel()
  }, [now, reducedMotion])

  return <div className="flex w-full flex-col items-center gap-2 sm:w-auto" data-testid="dashboard-clock">
    <svg viewBox="0 0 240 240" role="img" aria-label={`VisionSecure analog clock, ${time}`} className="h-44 w-44 shrink-0 drop-shadow-sm sm:h-40 sm:w-40">
      <circle cx="120" cy="120" r="116" className="fill-accent/15 stroke-accent/30" strokeWidth="2" />
      <circle cx="120" cy="120" r="105" className="fill-[#FFF9EE] stroke-border dark:fill-card" strokeWidth="1" />
      {Array.from({ length: 60 }, (_, index) => <line key={index} x1="120" y1={index % 5 === 0 ? 20 : 23} x2="120" y2={index % 5 === 0 ? 28 : 26} transform={`rotate(${index * 6} 120 120)`} className={index % 5 === 0 ? "stroke-brand-green" : "stroke-muted-foreground/40"} strokeWidth={index % 5 === 0 ? 2 : 1} strokeLinecap="round" />)}
      {Array.from({ length: 12 }, (_, index) => {
        const hour = index + 1
        const angle = hour * Math.PI / 6
        const major = hour % 3 === 0
        return <text key={hour} x={120 + Math.sin(angle) * 81} y={120 - Math.cos(angle) * 81} textAnchor="middle" dominantBaseline="central" className={major ? "fill-foreground font-bold" : "fill-muted-foreground font-medium"} fontSize={major ? 21 : 12}>{hour}</text>
      })}
      <text x="120" y="153" textAnchor="middle" className="fill-brand-green font-semibold" fontSize="7" letterSpacing="1.2">SMART TECHNOLOGIES</text>
      <rect x="72" y="164" width="96" height="22" rx="7" className="fill-background stroke-border" />
      <text x="120" y="178" textAnchor="middle" className="fill-foreground font-semibold" fontSize="10" fontFamily="ui-monospace, monospace">{time}</text>
      <svg x="97" y="93" width="46" height="53" viewBox="0 0 260 300" aria-hidden="true">
        <image href="/images/logo.png" width="850" height="300" preserveAspectRatio="xMinYMin meet" />
      </svg>
      {now && <g strokeLinecap="round">
        <line data-testid="clock-hour-hand" x1="120" y1="123" x2="120" y2="69" transform={`rotate(${hours * 30} 120 120)`} className="stroke-foreground" strokeWidth="6" />
        <line data-testid="clock-minute-hand" x1="120" y1="128" x2="120" y2="47" transform={`rotate(${minutes * 6} 120 120)`} className="stroke-brand-green" strokeWidth="4" />
        <line ref={secondHand} style={{ transformOrigin: "120px 120px", transform: `rotate(${seconds * 6}deg)` }} data-testid="clock-second-hand" x1="120" y1="134" x2="120" y2="36" className="stroke-destructive" strokeWidth="1.5" />
        <circle cx="120" cy="120" r="4.5" className="fill-foreground stroke-card" strokeWidth="1.5" />
      </g>}
    </svg>
    <p className="max-w-64 text-center text-xs text-muted-foreground">{now ? new Intl.DateTimeFormat(undefined, { weekday: "long", day: "2-digit", month: "short", year: "numeric" }).format(now) : "Local date"}</p>
    <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-brand-green"><span className="h-1.5 w-1.5 rounded-full bg-accent" />Live local time</span>
  </div>
}
