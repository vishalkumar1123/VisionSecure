"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

import { X, Phone, ArrowRight } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const services = [
  "CCTV Surveillance",
  "Biometric Systems",
  "Access Control Systems",
  "Networking Solutions",
  "Video Door Phones",
  "Fire Alarm Systems",
  "Home Automation",
  "EPABX Systems",
  "PA Systems",
  "Video Intercom",
  "Attendance Systems",
  "Smart Locks",
]

export function LeadPopup() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
  })

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    service: "",
  })

  // Hydration Safe
  useEffect(() => {
    setMounted(true)
  }, [])

  // Popup Open
  useEffect(() => {
    if (!mounted) return

    const popupShown = sessionStorage.getItem("leadPopupShown")

    if (!popupShown) {
      const timer = setTimeout(() => {
        setIsOpen(true)

        setTimeout(() => {
          setIsVisible(true)
        }, 50)

        sessionStorage.setItem("leadPopupShown", "true")
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [mounted])

  const handleClose = () => {
    setIsVisible(false)

    setTimeout(() => {
      setIsOpen(false)
    }, 300)
  }

  // Input Change
  const handleChange = (field: string, value: string) => {
    // Mobile validation
    if (field === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10)
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear Error
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }))
  }

  // Form Validation
  const validateForm = () => {
    let valid = true

    const newErrors = {
      name: "",
      phone: "",
      service: "",
    }

    // Name
    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name"
      valid = false
    }

    // Phone
    if (!formData.phone) {
      newErrors.phone = "Please enter mobile number"
      valid = false
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "Mobile number must be 10 digits"
      valid = false
    }

    // Service
    if (!formData.service) {
      newErrors.service = "Please select service"
      valid = false
    }

    setErrors(newErrors)

    return valid
  }

  // Submit
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const message = `
Hello VisionSecure Smart Technologies,

I am interested in your services.

Name: ${formData.name}
Mobile: ${formData.phone}
Service: ${formData.service}
      `

      const whatsappUrl = `https://wa.me/919872133840?text=${encodeURIComponent(
        message
      )}`

      window.open(whatsappUrl, "_blank")

      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      )

      // Reset Form
      setFormData({
        name: "",
        phone: "",
        service: "",
      })

      handleClose()
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Prevent hydration mismatch
  if (!mounted || !isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent showCloseButton={false} className="z-[100] max-h-[90dvh] overflow-y-auto border-0 bg-transparent p-0 sm:max-w-md">
      <DialogTitle className="sr-only">Free security consultation</DialogTitle>
      <DialogDescription className="sr-only">Share your requirements with VisionSecure on WhatsApp.</DialogDescription>
      {/* Popup */}
      <div
        className={cn(
          "relative w-full max-w-md overflow-visible rounded-3xl border border-border bg-background shadow-2xl transition-all duration-300",
          isVisible
            ? "translate-y-0 scale-100"
            : "translate-y-4 scale-95"
        )}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close consultation"
          className="absolute right-4 top-4 z-20 rounded-full p-2 text-white hover:bg-white/15"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="rounded-t-3xl bg-gradient-to-br from-[#273a2c] to-[#17241b] px-6 pb-6 pt-8 text-white">
          <div className="mb-4 flex items-center gap-3">
            <Link href="/">
              <Image
                src="/images/Vision.png"
                alt="VisionSecure"
                width={50}
                height={50}
                className="h-14 w-14 rounded-xl bg-white object-contain p-1"
                priority
              />
            </Link>

            <h2 className="text-2xl font-bold leading-tight">
              VisionSecure Smart Technologies
            </h2>
          </div>

          <h3 className="text-3xl font-bold">
            Get Free Security Consultation
          </h3>

          <p className="mt-2 text-white/80">
            Share your details with our team on WhatsApp.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5 p-6"
        >
          <FieldGroup>
            {/* Name */}
            <Field>
              <FieldLabel className="text-foreground">
                Name
              </FieldLabel>

              <Input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  handleChange("name", e.target.value)
                }
                placeholder="Enter your name"
                className="h-12 border-border bg-card text-foreground"
              />

              {errors.name && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.name}
                </p>
              )}
            </Field>

            {/* Mobile */}
            <Field>
              <FieldLabel className="text-foreground">
                Mobile Number
              </FieldLabel>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) =>
                    handleChange("phone", e.target.value)
                  }
                  placeholder="Enter your mobile number"
                  className="h-12 border-border bg-card pl-10 text-foreground"
                />
              </div>

              {errors.phone && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.phone}
                </p>
              )}
            </Field>

            {/* Services */}
            <Field>
              <FieldLabel className="text-foreground">
                Select Service
              </FieldLabel>

              <Select
                value={formData.service}
                onValueChange={(value) =>
                  handleChange("service", value)
                }
              >
                <SelectTrigger className="h-12 border-border bg-card text-foreground">
                  <SelectValue placeholder="Choose Service" />
                </SelectTrigger>

                <SelectContent className="z-[9999] border border-border bg-card text-foreground">
                  {services.map((service) => (
                    <SelectItem
                      key={service}
                      value={service}
                      className="cursor-pointer"
                    >
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.service && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.service}
                </p>
              )}
            </Field>
          </FieldGroup>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-14 w-full rounded-full bg-primary text-lg font-semibold text-primary-foreground hover:bg-primary hover:text-primary-foreground"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                Continue on WhatsApp
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            We respect your privacy. No spam calls.
          </p>
        </form>
      </div>
      </DialogContent>
    </Dialog>
  )
}