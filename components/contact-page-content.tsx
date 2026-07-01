"use client"

import { useEffect, useRef, useState } from "react"
import { FaWhatsapp } from "react-icons/fa" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

// FIX 2: यहाँ से FaWhatsapp को हटा दिया गया है
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Youtube,
  Instagram,
  Facebook,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react"

import { cn } from "@/lib/utils"

const services = [
  "CCTV Surveillance",
  "Biometric Systems",
  "Access Control",
  "Networking Solutions",
  "Video Door Phones",
  "Fire Alarm Systems",
  "Home Automation",
  "AMC / Maintenance",
  "Other",
]

const budgets = [
  "Under ₹25,000",
  "₹25,000 - ₹50,000",
  "₹50,000 - ₹1 Lakh",
  "₹1 - ₹3 Lakhs",
  "Above ₹3 Lakhs",
]

const contactInfo = [
  {
    icon: Phone,
    title: "Phone / WhatsApp",
    details: ["+91 98721 33840"],
    action: "tel:+919872133840",
    actionLabel: "Call Now",
  },
  {
    icon: Mail,
    title: "Email Address",
    details: ["info@visionsecuretech.in"],
    action: "mailto:info@visionsecuretech.in",
    actionLabel: "Send Email",
  },
  {
    icon: MapPin,
    title: "Office Address",
    details: [
      "Nearby Budheshwar",
      "Lucknow, Uttar Pradesh - 226017",
    ],
    action: "https://maps.google.com/?q=Budheshwar,Lucknow",
    actionLabel: "View Location",
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: [
      "Monday - Saturday : 9:00 AM - 7:00 PM",
      "Sunday : By Appointment",
    ],
  },
]

const socialLinks = [
  {
    icon: Youtube,
    href: "https://www.youtube.com/@vishalkumar9004",
    label: "YouTube",
    hover: "hover:bg-red-500",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/visionsecure_tech/",
    label: "Instagram",
    hover:
      "hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600",
  },
  {
    icon: Facebook,
    href: "https://www.facebook.com/profile.php?id=61584897029759",
    label: "Facebook",
    hover: "hover:bg-blue-600",
  },
  {
    icon: FaWhatsapp,
    href: "https://wa.me/919872133840",
    label: "WhatsApp",
    hover: "hover:bg-green-500",
  },
]

const benefits = [
  {
    icon: ShieldCheck,
    text: "Certified Security Experts",
  },
  {
    icon: BadgeCheck,
    text: "Affordable Installation & AMC Plans",
  },
  {
    icon: CheckCircle2,
    text: "Free Site Visit & Consultation",
  },
  {
    icon: CheckCircle2,
    text: "Quick Response Within 24 Hours",
  },
]

export function ContactPageContent() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    budget: "",
    message: "",
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (!formData.service) {
      setErrorMessage("Please select a service")
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Failed to submit form")
        return
      }

      setIsSubmitted(true)
      setFormData({
        name: "",
        phone: "",
        email: "",
        service: "",
        budget: "",
        message: "",
      })
    } catch (error: any) {
      console.error("Unexpected Error:", error)
      setErrorMessage("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.15),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.10),transparent_30%)]" />

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-400">
            Contact VisionSecure
          </span>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-white lg:text-5xl">
            Let's Secure Your Home & Business
          </h2>
          <p className="mt-5 text-lg leading-8 text-zinc-400">
            Professional CCTV, biometric, networking, automation, and smart security solutions tailored to your needs.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-5">
          {/* LEFT SIDE - FORM */}
          <div className={cn("lg:col-span-3 transition-all duration-700", isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0")}>
            <div className="rounded-[32px] border border-white/10 bg-zinc-950/70 p-8 backdrop-blur-xl lg:p-10">
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-white">Send Your Requirement</h3>
                <p className="mt-3 text-zinc-400">Fill out the form below and our team will contact you shortly.</p>
              </div>

              {isSubmitted ? (
                <div className="py-14 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle2 className="h-10 w-10 text-green-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white">Requirement Submitted</h3>
                  <p className="mt-4 text-zinc-400">Thank you for contacting VisionSecure Smart Technologies.</p>
                  <Button onClick={() => setIsSubmitted(false)} className="mt-8 rounded-full bg-blue-600 hover:bg-blue-700">
                    Submit Another Requirement
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <FieldGroup>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field>
                        <FieldLabel className="text-zinc-300">Full Name *</FieldLabel>
                        <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter full name" required className="h-12 border-white/10 bg-zinc-900 text-white placeholder:text-zinc-500 focus:border-blue-500" />
                      </Field>
                      <Field>
                        <FieldLabel className="text-zinc-300">Phone Number *</FieldLabel>
                        <Input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+91 XXXXX XXXXX" required className="h-12 border-white/10 bg-zinc-900 text-white placeholder:text-zinc-500 focus:border-blue-500" />
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel className="text-zinc-300">Email Address</FieldLabel>
                      <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="your@email.com" className="h-12 border-white/10 bg-zinc-900 text-white placeholder:text-zinc-500 focus:border-blue-500" />
                    </Field>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field>
                        <FieldLabel className="text-zinc-300">Service Required *</FieldLabel>
                        <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                          <SelectTrigger className="h-12 border-white/10 bg-zinc-900 text-white focus:border-blue-500">
                            <SelectValue placeholder="Select Service" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem key={service} value={service}>{service}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>

                      <Field>
                        <FieldLabel className="text-zinc-300">Budget Range</FieldLabel>
                        <Select value={formData.budget} onValueChange={(value) => setFormData({ ...formData, budget: value })}>
                          <SelectTrigger className="h-12 border-white/10 bg-zinc-900 text-white focus:border-blue-500">
                            <SelectValue placeholder="Select Budget" />
                          </SelectTrigger>
                          <SelectContent>
                            {budgets.map((budget) => (
                              <SelectItem key={budget} value={budget}>{budget}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel className="text-zinc-300">Your Requirement</FieldLabel>
                      <Textarea name="message" value={formData.message} onChange={handleInputChange} rows={6} placeholder="Tell us about your project requirement..." className="resize-none border-white/10 bg-zinc-900 text-white placeholder:text-zinc-500 focus:border-blue-500" />
                    </Field>
                  </FieldGroup>

                  {errorMessage && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{errorMessage}</div>
                  )}

                  <Button type="submit" disabled={isSubmitting} className="h-14 w-full rounded-full bg-blue-600 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-[1.01] hover:bg-blue-700">
                    {isSubmitting ? (
                      <span className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Submitting...</span>
                    ) : (
                      <span className="flex items-center gap-2"><Send className="h-5 w-5" /> Submit Requirement</span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* RIGHT SIDE - INFO */}
          <div className={cn("space-y-6 lg:col-span-2 transition-all duration-700", isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0")}>
            <div className="rounded-[32px] border border-blue-500/20 bg-gradient-to-br from-blue-600 to-indigo-700 p-7 text-white shadow-2xl shadow-blue-900/20">
              <h3 className="text-2xl font-bold">Need Quick Support?</h3>
              <p className="mt-3 text-sm text-blue-100">Connect instantly with our expert team.</p>
              <div className="mt-6 space-y-3">
                <Button asChild size="lg" className="h-12 w-full rounded-full bg-white text-black hover:bg-zinc-200">
                  <a href="https://wa.me/919872133840" target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp className="mr-2 h-5 w-5 text-green-600" /> WhatsApp Now
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 w-full rounded-full border-white/30 bg-transparent text-white hover:bg-white/10">
                  <a href="tel:+919872133840"><Phone className="mr-2 h-5 w-5" /> Call Us</a>
                </Button>
              </div>
            </div>

            {contactInfo.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={item.title} style={{ transitionDelay: `${index * 100}ms` }} className={cn("group rounded-[28px] border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-blue-500/40", isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0")}>
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                      <div className="mt-2 space-y-1">
                        {item.details.map((detail) => (
                          <p key={detail} className="text-sm leading-6 text-zinc-400">{detail}</p>
                        ))}
                      </div>
                      {item.action && (
                        <a href={item.action} target={item.action.startsWith("http") ? "_blank" : undefined} rel={item.action.startsWith("http") ? "noopener noreferrer" : undefined} className="mt-3 inline-flex text-sm font-medium text-blue-400 transition hover:text-blue-300">
                          {item.actionLabel} →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Benefits & Social Links components remained clean */}
            <div className="rounded-[28px] border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-xl">
              <h3 className="mb-5 text-xl font-bold text-white">Why Choose Us?</h3>
              <ul className="space-y-4">
                {benefits.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.text} className="flex items-center gap-3 text-sm text-zinc-300">
                      <Icon className="h-5 w-5 text-green-400" /> {item.text}
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-xl">
              <h3 className="mb-5 text-xl font-bold text-white">Follow Us</h3>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900 text-zinc-300 transition-all duration-300 hover:scale-110 hover:text-white ${social.hover}`}>
                      <Icon className="h-6 w-6" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className={cn("mt-20 overflow-hidden rounded-[32px] border border-white/10 transition-all duration-700", isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0")}>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.3825624477!2d80.77769936328126!3d26.848925350000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd991f32b16b%3A0x93ccba8909978be7!2sLucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1699000000000!5m2!1sen!2sin" width="100%" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="VisionSecure Location" />
        </div>
      </div>
    </section>
  )
}