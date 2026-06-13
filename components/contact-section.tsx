"use client"

import { useEffect, useRef, useState } from "react"

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
  MessageCircle,
  Youtube,
  Instagram,
  Facebook,
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
  "Other",
]

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: [
      "Nearby Budheshwar",
      "Lucknow, Uttar Pradesh - 226017",
    ],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+91 98721 33840"],
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["info@visionsecuretech.in"],
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: [
      "Mon - Sat: 9:00 AM - 7:00 PM",
      "Sunday: By Appointment",
    ],
  },
]

const socialLinks = [
  {
    icon: Youtube,
    href: "https://www.youtube.com/@vishalkumar9004",
    label: "YouTube",
    color: "bg-red-500 hover:bg-red-600",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/visionsecure_tech/",
    label: "Instagram",
    color:
      "bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
  },
  {
    icon: Facebook,
    href: "https://www.facebook.com/profile.php?id=61584897029759",
    label: "Facebook",
    color: "bg-blue-600 hover:bg-blue-700",
  },
]

export function ContactSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const sectionRef = useRef<HTMLDivElement>(null)

  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  })

  // Error State
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  })

  // Animation Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Handle Change
  const handleChange = (
    field: string,
    value: string
  ) => {
    // Phone only numbers
    if (field === "phone") {
      value = value
        .replace(/\D/g, "")
        .slice(0, 10)
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Remove error while typing
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }))
  }

  // Validation
  const validateForm = () => {
    let valid = true

    const newErrors = {
      name: "",
      phone: "",
      email: "",
      service: "",
      message: "",
    }

    // Name
    if (!formData.name.trim()) {
      newErrors.name =
        "Please enter your full name"
      valid = false
    }

    // Phone
    if (!formData.phone) {
      newErrors.phone =
        "Please enter mobile number"
      valid = false
    } else if (formData.phone.length !== 10) {
      newErrors.phone =
        "Mobile number must be 10 digits"
      valid = false
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email =
        "Please enter email address"
      valid = false
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Please enter valid email address"
      valid = false
    }

    // Service
    if (!formData.service) {
      newErrors.service =
        "Please select a service"
      valid = false
    }

    // Message
    if (!formData.message.trim()) {
      newErrors.message =
        "Please enter your requirements"
      valid = false
    }

    setErrors(newErrors)

    return valid
  }

  // Submit Form
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const message = `
Hello VisionSecure,

New Contact Inquiry

Name: ${formData.name}
Mobile: ${formData.phone}
Email: ${formData.email}
Service: ${formData.service}

Message:
${formData.message}
      `

      const whatsappUrl = `https://wa.me/919872133840?text=${encodeURIComponent(
        message
      )}`

      window.open(whatsappUrl, "_blank")

      await new Promise((resolve) =>
        setTimeout(resolve, 1500)
      )

      alert(
        "Thank you! We will contact you soon."
      )

      // Reset Form
      setFormData({
        name: "",
        phone: "",
        email: "",
        service: "",
        message: "",
      })
    } catch (error) {
      console.log(error)
      alert("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden py-24 lg:py-32"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

      <div className="container relative z-10 mx-auto px-4 lg:px-8">

        {/* Header */}
        <div
          className={cn(
            "mx-auto mb-16 max-w-3xl text-center transition-all duration-700",
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          )}
        >
          <span className="mb-4 inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            Get In Touch
          </span>

          <h2 className="mb-6 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Let’s Secure Your Home & Business Together
          </h2>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Connect with VisionSecure Smart Technologies
            for expert guidance on CCTV surveillance,
            biometric systems, access control,
            networking, and smart security solutions.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Contact Form */}
          <div
            className={cn(
              "transition-all duration-700",
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-8 opacity-0"
            )}
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              noValidate
            >
              <FieldGroup>

                {/* Name + Phone */}
                <div className="grid gap-4 sm:grid-cols-2">

                  {/* Name */}
                  <Field>
                    <FieldLabel>
                      Full Name
                    </FieldLabel>

                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleChange(
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="Your name..."
                      className="h-12 bg-card border-border/50 focus:border-accent"
                    />

                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.name}
                      </p>
                    )}
                  </Field>

                  {/* Phone */}
                  <Field>
                    <FieldLabel>
                      Phone Number
                    </FieldLabel>

                    <Input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) =>
                        handleChange(
                          "phone",
                          e.target.value
                        )
                      }
                      placeholder="Enter your phone number..."
                      className="h-12 bg-card border-border/50 focus:border-accent"
                    />

                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.phone}
                      </p>
                    )}
                  </Field>
                </div>

                {/* Email */}
                <Field>
                  <FieldLabel>
                    Email Address
                  </FieldLabel>

                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      handleChange(
                        "email",
                        e.target.value
                      )
                    }
                    placeholder="Enter your email address..."
                    className="h-12 bg-card border-border/50 focus:border-accent"
                  />

                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email}
                    </p>
                  )}
                </Field>

                {/* Service */}
                <Field>
                  <FieldLabel>
                    Service Required
                  </FieldLabel>

                  <Select
                    value={formData.service}
                    onValueChange={(value) =>
                      handleChange(
                        "service",
                        value
                      )
                    }
                  >
                    <SelectTrigger className="h-12 bg-card border-border/50 focus:border-accent">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>

                    <SelectContent className="z-[9999]">
                      {services.map((service) => (
                        <SelectItem
                          key={service}
                          value={service}
                        >
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {errors.service && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.service}
                    </p>
                  )}
                </Field>

                {/* Message */}
                <Field>
                  <FieldLabel>
                    Message
                  </FieldLabel>

                  <Textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      handleChange(
                        "message",
                        e.target.value
                      )
                    }
                    placeholder="Tell us about your requirements..."
                    className="resize-none bg-card border-border/50 focus:border-accent"
                  />

                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.message}
                    </p>
                  )}
                </Field>

              </FieldGroup>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="h-14 w-full rounded-full bg-accent text-base font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all duration-300 hover:bg-accent/90 hover:shadow-accent/40"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Send Message
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info) => {
              const Icon = info.icon

              return (
                <div
                  key={info.title}
                  className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-6"
                >
                  <div className="rounded-xl bg-accent/10 p-3 text-accent">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="mb-1 font-semibold">
                      {info.title}
                    </h3>

                    {info.details.map((detail) => (
                      <p
                        key={detail}
                        className="text-sm text-muted-foreground"
                      >
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Social */}
            <div className="flex items-center gap-3 pt-4">
              {socialLinks.map((social) => {
                const Icon = social.icon

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`rounded-lg p-3 text-white transition-all duration-300 ${social.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>

            {/* WhatsApp */}
            <Button
              variant="outline"
              className="w-full rounded-full border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
              asChild
            >
              <a
                href="https://wa.me/919872133840"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat on WhatsApp
              </a>
            </Button>
          </div>

        </div>
      </div>
    </section>
  )
}