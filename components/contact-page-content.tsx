"use client"

import { useState } from "react"
import { FaWhatsapp } from "react-icons/fa"
import { motion, Variants } from "framer-motion"
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
  Wrench,
} from "lucide-react"
import { OfficeMap } from "@/components/office-map"

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
      "153, Pili Market, Near Ram Lal Marriage Lawn",
      "Narouna, Kakori Mod, Mohan Road",
      "Lucknow, Uttar Pradesh - 227107",
    ],
    // Official Google Maps Place link using exact CID key
    action: "https://maps.google.com/?cid=5167156942475472384",
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
    hover: "hover:bg-destructive hover:border-destructive",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/visionsecure_tech/",
    label: "Instagram",
    hover: "hover:bg-gradient-to-br hover:from-status-pink hover:to-status-purple hover:border-status-pink",
  },
  {
    icon: Facebook,
    href: "https://www.facebook.com/profile.php?id=61584897029759",
    label: "Facebook",
    hover: "hover:bg-primary hover:text-primary-foreground hover:border-primary",
  },
  {
    icon: FaWhatsapp,
    href: "https://wa.me/919872133840",
    label: "WhatsApp",
    hover: "hover:bg-accent hover:border-accent",
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
    icon: Wrench,
    text: "Same-Day Technical Support Available",
  },
]

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  },
}

export function ContactPageContent() {
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
        setErrorMessage(data.error || "Failed to submit form")
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
    } catch (error) {
      console.error("Unexpected Error:", error)
      setErrorMessage("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact-section" className="relative overflow-hidden bg-background py-24 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(6,182,212,0.18),transparent_50%),radial-gradient(circle_at_0%_100%,rgba(59,130,246,0.1),transparent_40%)] pointer-events-none" />

      <div className="relative container mx-auto px-4 lg:px-8">
        
        {/* Heading Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-highlight/30 bg-highlight/10 px-5 py-2 text-xs sm:text-sm font-semibold text-highlight-ink backdrop-blur-md shadow-inner shadow-cyan-500/5">
            <ShieldCheck className="h-4 w-4 animate-pulse" />
            Contact VisionSecure Smart Technologies
          </span>
          <h2 className="mt-6 text-4xl font-black tracking-tight text-foreground lg:text-6xl">
            Let's Secure Your Space
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            Professional CCTV, biometric, networking, automation, and smart security solutions custom-tailored for your absolute peace of mind.
          </p>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid gap-10 lg:grid-cols-5 items-start">
          
          {/* Left Side - Requirement Form Card */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="lg:col-span-3"
          >
            <div className="rounded-[32px] border border-border bg-card p-6 sm:p-8 backdrop-blur-xl lg:p-10 shadow-2xl shadow-black/10 hover:border-highlight/20 transition-all duration-500">
              <div className="mb-8">
                <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Send Your Requirement</h3>
                <p className="mt-2 text-sm text-muted-foreground">Fill out the form below and our engineering team will get in touch shortly.</p>
              </div>

              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-14 text-center"
                >
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 border border-accent/20 shadow-inner">
                    <CheckCircle2 className="h-10 w-10 text-brand-green animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Requirement Submitted Successfully!</h3>
                  <p className="mt-3 text-sm text-muted-foreground max-w-sm mx-auto">Thank you for reaching out to VisionSecure Smart Technologies. We will review your project needs immediately.</p>
                  <Button onClick={() => setIsSubmitted(false)} className="mt-8 rounded-full bg-accent text-accent-foreground font-bold hover:bg-brand-hover transition-all">
                    Submit Another Requirement
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <FieldGroup className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field>
                        <FieldLabel className="text-muted-foreground font-medium mb-1.5 block text-sm">Full Name *</FieldLabel>
                        <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter full name" required className="h-12 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-highlight transition-colors rounded-xl" />
                      </Field>
                      <Field>
                        <FieldLabel className="text-muted-foreground font-medium mb-1.5 block text-sm">Phone Number *</FieldLabel>
                        <Input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+91 XXXXX XXXXX" required className="h-12 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-highlight transition-colors rounded-xl" />
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel className="text-muted-foreground font-medium mb-1.5 block text-sm">Email Address</FieldLabel>
                      <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="your@email.com" className="h-12 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-highlight transition-colors rounded-xl" />
                    </Field>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field>
                        <FieldLabel className="text-muted-foreground font-medium mb-1.5 block text-sm">Service Required *</FieldLabel>
                        <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                          <SelectTrigger className="h-12 border-border bg-background text-foreground focus:border-highlight rounded-xl">
                            <SelectValue placeholder="Select Service" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border text-foreground">
                            {services.map((service) => (
                              <SelectItem key={service} value={service} className="focus:bg-accent focus:text-accent-foreground cursor-pointer">{service}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>

                      <Field>
                        <FieldLabel className="text-muted-foreground font-medium mb-1.5 block text-sm">Budget Range</FieldLabel>
                        <Select value={formData.budget} onValueChange={(value) => setFormData({ ...formData, budget: value })}>
                          <SelectTrigger className="h-12 border-border bg-background text-foreground focus:border-highlight rounded-xl">
                            <SelectValue placeholder="Select Budget" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border text-foreground">
                            {budgets.map((budget) => (
                              <SelectItem key={budget} value={budget} className="focus:bg-accent focus:text-accent-foreground cursor-pointer">{budget}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel className="text-muted-foreground font-medium mb-1.5 block text-sm">Your Requirement</FieldLabel>
                      <Textarea name="message" value={formData.message} onChange={handleInputChange} rows={5} placeholder="Tell us more about your installation or maintenance project..." className="resize-none border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-highlight transition-colors rounded-xl" />
                    </Field>
                  </FieldGroup>

                  {errorMessage && (
                    <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{errorMessage}</div>
                  )}

                  <Button type="submit" disabled={isSubmitting} className="h-14 w-full rounded-full bg-primary text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 cursor-pointer">
                    {isSubmitting ? (
                      <span className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Submitting...</span>
                    ) : (
                      <span className="flex items-center gap-2"><Send className="h-5 w-5" /> Submit Requirement</span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Right Side - Info Blocks & Social Links */}
          <div className="space-y-6 lg:col-span-2">
            
            {/* Quick Support Banner */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="rounded-[32px] border border-highlight/20 bg-gradient-to-br from-accent/10 to-card p-7 text-foreground shadow-2xl"
            >
              <h3 className="text-2xl font-black tracking-tight">Need Quick Support?</h3>
              <p className="mt-2 text-sm text-muted-foreground">Connect instantly with our executive expert team.</p>
              <div className="mt-6 space-y-3">
                <Button asChild size="lg" className="h-12 w-full rounded-full bg-accent text-accent-foreground font-bold hover:bg-brand-hover shadow-md">
                  <a href="https://wa.me/919872133840" target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp className="mr-2 h-5 w-5" /> WhatsApp Now
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 w-full rounded-full border-border bg-card/5 text-foreground hover:bg-card/10 hover:border-border backdrop-blur-md">
                  <a href="tel:+919872133840"><Phone className="mr-2 h-5 w-5" /> Call Us Directly</a>
                </Button>
              </div>
            </motion.div>

            {/* Contact Information Cards Loop */}
            {contactInfo.map((item) => {
              const Icon = item.icon
              return (
                <motion.div 
                  key={item.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeInUp}
                  className="group rounded-[28px] border border-border bg-card p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-highlight/30 shadow-lg shadow-black/5"
                >
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-highlight/10 text-highlight-ink group-hover:bg-highlight group-hover:text-foreground transition-all duration-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-foreground tracking-tight">{item.title}</h4>
                      <div className="mt-2 space-y-0.5">
                        {item.details.map((detail) => (
                          <p key={detail} className="text-sm leading-6 text-muted-foreground font-medium group-hover:text-muted-foreground transition-colors">{detail}</p>
                        ))}
                      </div>
                      {item.action && (
                        <a 
                          href={item.action} 
                          target={item.action.startsWith("http") ? "_blank" : undefined} 
                          rel={item.action.startsWith("http") ? "noopener noreferrer" : undefined} 
                          className="mt-3 inline-flex items-center text-sm font-bold text-highlight-ink transition hover:text-highlight-ink"
                        >
                          {item.actionLabel} <span className="ml-1 transform group-hover:translate-x-1 transition-transform">→</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {/* Value Benefits Section */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="rounded-[28px] border border-border bg-card p-6 backdrop-blur-xl"
            >
              <h3 className="mb-5 text-xl font-bold text-foreground tracking-tight">Why Choose Us?</h3>
              <ul className="space-y-4">
                {benefits.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.text} className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                      <div className="p-1 rounded-full bg-accent/10 text-brand-green">
                        <Icon className="h-4 w-4" /> 
                      </div>
                      {item.text}
                    </li>
                  )
                })}
              </ul>
            </motion.div>

            {/* Social Media Links Card */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="rounded-[28px] border border-border bg-card p-6 backdrop-blur-xl"
            >
              <h3 className="mb-5 text-xl font-bold text-foreground tracking-tight">Follow Our Updates</h3>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a 
                      key={social.label} 
                      href={social.href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      aria-label={social.label} 
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background text-muted-foreground transition-all duration-300 hover:scale-110 hover:text-foreground ${social.hover}`}
                    >
                      <Icon className="h-6 w-6" />
                    </a>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Live Google Maps Embedded Block targeting exact Place ID */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="mt-20"
        >
          <OfficeMap />
        </motion.div>
      </div>
    </section>
  )
}
