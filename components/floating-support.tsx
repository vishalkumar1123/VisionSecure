"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bot, CheckCircle2, Loader2, Send, Sparkles, X } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { services } from "@/lib/services"

type Message = { from: "agent" | "user"; text: string }
type Lead = { name: string; phone: string; email: string; service: string; message: string }

const whatsappUrl = "https://wa.me/919872133840"
const initialOptions = ["CCTV", "Networking / WiFi", "Biometric", "Smart Security", "AMC / Repair", "Book Site Visit"]
const followUps: Record<string, string[]> = {
  CCTV: ["Home CCTV", "Shop CCTV", "Office CCTV", "How Many Cameras?", "IP vs Analog", "Get Quotation"],
  "Networking / WiFi": ["Weak WiFi", "New Office Network", "Mesh WiFi", "Network Cabling", "Server / Rack Setup", "Network AMC"],
  Biometric: ["Fingerprint Attendance", "Face Attendance", "RFID Attendance", "Access Control", "Office Attendance Setup"],
  "AMC / Repair": ["CCTV Repair", "Network Issue", "Existing System AMC", "Preventive Maintenance", "Talk to Technician"],
}

function replyFor(input: string) {
  const value = input.toLowerCase()
  const matched = services.find((service) => value.includes(service.title.toLowerCase()) || value.includes(service.slug.split("-")[0]))
  if (matched) return `${matched.title}: ${matched.summary} To discuss your requirement, you can request a site visit or quotation.`
  if (/(office|location|address)/.test(value)) return "Our verified office location is 153, Pili Market, Near Ram Lal Marriage Lawn, Narouna, Kakori Mod, Mohan Road, Lucknow, Uttar Pradesh - 227107. You can find directions on the Contact page."
  if (/(price|cost|quote|quotation)/.test(value)) return "Please submit your requirement and our team will provide a quotation based on the site and solution needed."
  if (/(site visit|visit|enquiry|enquire|contact|call)/.test(value)) return "Certainly. Share your requirement below and the VisionSecure team can contact you about a site visit or quotation."
  if (/(service|cctv|camera|biometric|attendance|access|network|wifi|wi-fi|automation|alarm|door lock|door phone|server|amc)/.test(value)) return "VisionSecure provides CCTV surveillance, biometric attendance, access control, networking and WiFi, IT support and AMC, video door phones, smart door locks, home automation, and alarm and safety solutions."
  return "I don't have verified information about that yet. I can help you contact the VisionSecure team for a site visit or quotation."
}

export function FloatingSupport() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadStatus, setLeadStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [lead, setLead] = useState<Lead>({ name: "", phone: "", email: "", service: "", message: "" })
  const [quickOptions, setQuickOptions] = useState(initialOptions)
  const [messages, setMessages] = useState<Message[]>([{ from: "agent", text: "Hi! How can we help? Choose a service and we'll guide you toward the right security, networking or smart technology solution." }])
  const userInteracted = useRef(false)
  const inactivityTimer = useRef<number | null>(null)

  const markInteraction = () => {
    userInteracted.current = true
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
  }

  useEffect(() => {
    if (pathname.startsWith("/admin")) return
    if (sessionStorage.getItem("visionsecure-ai-intro-shown")) return
    const timer = window.setTimeout(() => {
      sessionStorage.setItem("visionsecure-ai-intro-shown", "true")
      setOpen(true)
      inactivityTimer.current = window.setTimeout(() => {
        if (!userInteracted.current) setOpen(false)
      }, 10_000)
    }, 4_000)
    return () => window.clearTimeout(timer)
  }, [pathname])

  useEffect(() => () => { if (inactivityTimer.current) clearTimeout(inactivityTimer.current) }, [])

  if (pathname.startsWith("/admin")) return null

  const send = (event?: FormEvent, text = input) => {
    event?.preventDefault()
    markInteraction()
    const value = text.trim()
    if (!value || typing) return
    setMessages((current) => [...current, { from: "user", text: value }])
    setInput("")
    setTyping(true)
    window.setTimeout(() => {
      setMessages((current) => [...current, { from: "agent", text: replyFor(value) }])
      setTyping(false)
      if (/(site visit|visit|enquiry|enquire|quote|quotation|contact)/i.test(value)) setShowLeadForm(true)
    }, 350)
  }

  const chooseOption = (option: string) => {
    markInteraction()
    setLead((current) => ({ ...current, service: current.service || option }))
    send(undefined, option)
    if (followUps[option]) setQuickOptions(followUps[option])
    if (/quotation|site visit|technician|repair|amc/i.test(option)) setShowLeadForm(true)
  }

  const submitLead = async (event: FormEvent) => {
    event.preventDefault()
    setLeadStatus("sending")
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...lead, source: "AI Assistant" }) })
      if (!response.ok) throw new Error("Unable to submit")
      setLeadStatus("success")
    } catch { setLeadStatus("error") }
  }

  return <div className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-5 z-[60] flex flex-col items-end gap-3">
    {open && <section onPointerDown={markInteraction} onFocus={markInteraction} className="fixed inset-x-3 bottom-24 max-h-[min(76dvh,38rem)] overflow-hidden rounded-xl border border-border bg-card shadow-2xl sm:static sm:w-[23rem]" aria-label="VisionSecure AI Assistant">
      <header className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground"><div className="flex items-center gap-2"><Image src="/images/Visionsecuretech_logo.png" alt="VisionSecure" width={36} height={36} className="h-9 w-9 rounded-full bg-card object-contain p-1" /><div><span className="flex items-center gap-2 font-semibold"><Sparkles className="h-4 w-4" />VisionSecure AI Assistant</span><p className="mt-0.5 text-xs text-primary-foreground/80">Smart Security & IT Advisor</p></div></div><button type="button" onClick={() => { markInteraction(); sessionStorage.setItem("visionsecure-ai-intro-shown", "true"); setOpen(false) }} aria-label="Close VisionSecure AI Assistant" className="rounded p-1 transition hover:bg-card/15"><X className="h-4 w-4" /></button></header>
      <div className="max-h-52 space-y-3 overflow-y-auto p-4 sm:max-h-64" aria-live="polite">{messages.map((message, index) => <p key={index} className={`w-fit max-w-[90%] rounded-lg px-3 py-2 text-sm leading-6 ${message.from === "agent" ? "bg-secondary text-foreground" : "ml-auto bg-primary text-primary-foreground"}`}>{message.text}</p>)}{typing && <p className="w-fit rounded-lg bg-secondary px-3 py-2 text-xs text-muted-foreground">VisionSecure AI is typing...</p>}</div>
      {!showLeadForm && <div className="flex flex-wrap gap-2 px-4 pb-3">{quickOptions.map((option) => <button key={option} type="button" onClick={() => chooseOption(option)} className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition hover:border-primary hover:text-brand-ink">{option}</button>)}</div>}
      {showLeadForm && <form onSubmit={submitLead} className="space-y-2 border-t border-border p-3">{leadStatus === "success" ? <p className="flex items-center gap-2 rounded-md bg-accent/10 p-3 text-sm text-brand-green"><CheckCircle2 className="h-4 w-4" />Thank you. Your enquiry has been received.</p> : <><input required value={lead.name} onChange={(event) => setLead({ ...lead, name: event.target.value })} placeholder="Name" className="h-9 w-full rounded border border-border bg-background px-3 text-sm outline-none focus:border-accent" /><input required inputMode="tel" pattern="[0-9]{10}" value={lead.phone} onChange={(event) => setLead({ ...lead, phone: event.target.value })} placeholder="10-digit mobile number" className="h-9 w-full rounded border border-border bg-background px-3 text-sm outline-none focus:border-accent" /><input type="email" value={lead.email} onChange={(event) => setLead({ ...lead, email: event.target.value })} placeholder="Email (optional)" className="h-9 w-full rounded border border-border bg-background px-3 text-sm outline-none focus:border-accent" /><input value={lead.service} onChange={(event) => setLead({ ...lead, service: event.target.value })} placeholder="Service required" className="h-9 w-full rounded border border-border bg-background px-3 text-sm outline-none focus:border-accent" /><textarea required value={lead.message} onChange={(event) => setLead({ ...lead, message: event.target.value })} placeholder="Tell us about your requirement and location" className="min-h-16 w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent" /><button disabled={leadStatus === "sending"} className="inline-flex h-9 w-full items-center justify-center gap-2 rounded bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-60">{leadStatus === "sending" ? <><Loader2 className="h-4 w-4 animate-spin" />Sending...</> : "Request a Site Visit"}</button>{leadStatus === "error" && <p className="text-xs text-destructive">Something went wrong. Please try again or contact us on WhatsApp.</p>}</>}</form>}
      <form onSubmit={send} className="flex border-t border-border p-3"><input value={input} onChange={(event) => setInput(event.target.value)} className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" placeholder="Ask about our services" aria-label="Ask VisionSecure AI" /><button aria-label="Send message" className="rounded bg-primary p-2 text-primary-foreground"><Send className="h-4 w-4" /></button></form>
      <Link href="/contact" className="block border-t border-border px-4 py-3 text-center text-xs font-semibold text-brand-ink hover:underline">Open contact form</Link>
    </section>}
    <div className="flex flex-col items-center gap-3"><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" title="Chat on WhatsApp" className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg shadow-green-500/30 transition hover:scale-105 hover:bg-accent motion-reduce:transition-none"><FaWhatsapp className="h-7 w-7" /></a><button type="button" onClick={() => { markInteraction(); setOpen((value) => !value) }} aria-label={open ? "Close VisionSecure AI" : "Ask VisionSecure AI"} title="Ask VisionSecure AI" aria-expanded={open} className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition hover:scale-105 hover:bg-primary/90 motion-reduce:transition-none"><Bot className="h-6 w-6" /></button></div>
  </div>
}
