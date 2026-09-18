"use client"
import { useEffect, useState } from "react"
import { AnalogClock } from "./analog-clock"
import { greeting, relativeTime } from "@/lib/dashboard-time"
export function LiveHeader({ name }: { name: string }) {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => { const tick = () => setNow(new Date()); tick(); const timer = setInterval(tick, 1000); return () => clearInterval(timer) }, [])
  return <div className="flex flex-wrap items-center justify-between gap-4"><div className="min-w-0 flex-1"><p className="text-xs font-semibold uppercase tracking-widest text-brand-green">VisionSecure / Business control center</p><h1 className="mt-2 break-words text-2xl font-bold sm:text-3xl">{now ? greeting(now.getHours()) : "Welcome"}, {name || "Admin"}</h1><p className="mt-2 text-sm text-muted-foreground">Your team, customers and next actions in one place.</p></div><AnalogClock now={now}/></div>

}
export function RelativeTime({ value }: { value: string }) {
 const [now, setNow] = useState<number | null>(null)
 useEffect(() => { setNow(Date.now()); const timer=setInterval(()=>setNow(Date.now()),60000);return()=>clearInterval(timer) },[])
 return <time dateTime={value} title={new Date(value).toISOString()}>{now ? relativeTime(value, now) : "Recorded"}</time>
}
