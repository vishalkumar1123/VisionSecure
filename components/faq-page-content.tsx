"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  ChevronDown,
  HelpCircle,
  Phone,
  MessageCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

const faqCategories = [
  {
    id: "general",
    title: "General Questions",
    faqs: [
      {
        question: "What types of security systems do you install?",
        answer: "We install a comprehensive range of security systems including CCTV cameras (analog, IP, PTZ), biometric attendance systems, access control systems (RFID, smart locks, boom barriers), video door phones, fire alarm systems, and complete home automation solutions."
      },
      {
        question: "Which areas do you serve?",
        answer: "We primarily serve Lucknow and surrounding areas in Uttar Pradesh. However, we also take up projects across North India for larger installations. Contact us to check if we cover your location."
      },
      {
        question: "Do you provide free site visits?",
        answer: "Yes, we offer completely free site visits and consultations. Our technical team will assess your property, understand your requirements, and provide a detailed quotation without any obligation."
      },
      {
        question: "How long does installation typically take?",
        answer: "Installation time varies based on the project size. A typical home CCTV system with 4-8 cameras can be installed in 1 day. Larger commercial projects may take 3-7 days depending on the number of cameras and systems involved."
      },
    ]
  },
  {
    id: "cctv",
    title: "CCTV & Surveillance",
    faqs: [
      {
        question: "What is the difference between analog and IP cameras?",
        answer: "Analog cameras transmit video over coaxial cables and require a DVR, while IP cameras transmit digital video over network cables and use an NVR. IP cameras typically offer higher resolution (4K), better image quality, and advanced features like AI analytics, but cost more than analog systems."
      },
      {
        question: "Can I view my cameras on my mobile phone?",
        answer: "Yes, all our CCTV installations come with free mobile app setup. You can view live footage, playback recordings, and receive motion alerts on your smartphone from anywhere in the world with an internet connection."
      },
      {
        question: "How much storage do I need for CCTV recordings?",
        answer: "Storage depends on the number of cameras, resolution, and how many days of recording you want to keep. For example, 8 cameras recording at 2MP resolution for 15 days typically need a 2TB hard drive. We recommend 30-day storage for most installations."
      },
      {
        question: "Do cameras work at night?",
        answer: "Yes, all our cameras feature infrared (IR) night vision that can see clearly in complete darkness up to 30-50 meters depending on the model. We also offer color night vision cameras for areas with some ambient light."
      },
    ]
  },
  {
    id: "biometric",
    title: "Biometric Systems",
    faqs: [
      {
        question: "Which is better - fingerprint or face recognition?",
        answer: "Both have their advantages. Fingerprint is more accurate and cost-effective, ideal for indoor use. Face recognition is contactless, faster for high-traffic areas, and works better in environments where fingers might be dirty or wet. Many organizations use a combination of both."
      },
      {
        question: "Can biometric systems integrate with payroll software?",
        answer: "Yes, our biometric attendance systems can integrate with popular payroll and HR software. They support various export formats (Excel, text files) and can directly integrate with software like Tally, SAP, and other HRMS platforms."
      },
      {
        question: "What happens if the biometric device fails?",
        answer: "All our biometric devices store data locally, so even during network issues, attendance continues to be recorded. We also provide backup options like card or PIN access. Our AMC includes quick response for any device failures."
      },
    ]
  },
  {
    id: "pricing",
    title: "Pricing & Payment",
    faqs: [
      {
        question: "How much does a basic CCTV system cost?",
        answer: "A basic 4-camera CCTV system for home starts from around Rs. 15,000-25,000 including installation. Prices vary based on camera resolution, brand, and features. We offer solutions for every budget and can customize packages accordingly."
      },
      {
        question: "Do you offer EMI options?",
        answer: "Yes, we offer easy EMI options through various banks and financing partners for installations above Rs. 30,000. You can spread payments over 3-12 months with minimal documentation."
      },
      {
        question: "Is installation included in the price?",
        answer: "Yes, our quoted prices include professional installation, basic wiring (up to 15m per camera), configuration, and training on how to use the system. Additional wiring or complex installations may have extra charges which will be clearly mentioned in the quote."
      },
    ]
  },
  {
    id: "warranty",
    title: "Warranty & AMC",
    faqs: [
      {
        question: "What warranty do you provide?",
        answer: "All our products come with a minimum 1-year manufacturer warranty. Premium brands offer up to 3-year warranty. We handle all warranty claims on behalf of our customers, making the process hassle-free."
      },
      {
        question: "What is included in your AMC plans?",
        answer: "Our Annual Maintenance Contract includes quarterly preventive maintenance visits, unlimited breakdown support, free labor charges for repairs, software updates, camera cleaning, and priority response time. Spare parts are charged at discounted rates."
      },
      {
        question: "How quickly do you respond to service calls?",
        answer: "For AMC customers, we guarantee response within 4 hours for critical issues and 24 hours for general maintenance. Non-AMC customers typically receive service within 24-48 hours based on availability."
      },
    ]
  },
  {
    id: "support",
    title: "Support & Service",
    faqs: [
      {
        question: "Do you provide remote support?",
        answer: "Yes, many issues can be resolved remotely. Our technical team can access your system (with your permission) to troubleshoot software issues, adjust settings, and guide you through the mobile app. This saves time and provides quick resolutions."
      },
      {
        question: "What happens if a camera stops working?",
        answer: "Contact our support team immediately. If under warranty or AMC, we will either repair or replace the camera at no extra cost (excluding physical damage). For non-warranty repairs, we provide transparent pricing before proceeding."
      },
      {
        question: "Can you upgrade my existing security system?",
        answer: "Absolutely! We can upgrade your existing system by adding more cameras, replacing old cameras with higher resolution ones, adding mobile viewing capability, or integrating additional systems like biometrics. We assess your current setup and recommend the most cost-effective upgrade path."
      },
    ]
  },
]

export function FAQPageContent() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeCategory, setActiveCategory] = useState("general")
  const [openQuestions, setOpenQuestions] = useState<string[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

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

  const toggleQuestion = (questionId: string) => {
    setOpenQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    )
  }

  const currentCategory = faqCategories.find(c => c.id === activeCategory)

  return (
    <section ref={sectionRef} className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className={cn(
            "lg:col-span-1 transition-all duration-700",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          )}>
            <div className="sticky top-24 space-y-2">
              <h3 className="font-semibold text-foreground mb-4">Categories</h3>
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-300",
                    activeCategory === category.id
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {category.title}
                </button>
              ))}
              
              {/* Quick Contact */}
              <div className="mt-8 p-4 rounded-xl bg-card border border-border/50">
                <HelpCircle className="h-8 w-8 text-accent mb-3" />
                <h4 className="font-semibold text-foreground mb-2">Still have questions?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Our team is here to help you.
                </p>
                <div className="space-y-2">
                  <Button
                    size="sm"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full"
                    asChild
                  >
                    <a href="tel:+919872133840">
                      <Phone className="mr-2 h-4 w-4" />
                      Call Us
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full rounded-full border-green-500/50 text-green-500 hover:bg-green-500/10"
                    asChild
                  >
                    <a href="https://wa.me/919872133840" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className={cn(
            "lg:col-span-3 transition-all duration-700",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          )}>
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-8">
              {currentCategory?.title}
            </h2>
            
            <div className="space-y-4">
              {currentCategory?.faqs.map((faq, index) => {
                const questionId = `${activeCategory}-${index}`
                const isOpen = openQuestions.includes(questionId)
                
                return (
                  <div
                    key={questionId}
                    className={cn(
                      "rounded-2xl bg-card border border-border/50 overflow-hidden transition-all duration-300",
                      isOpen && "border-accent/50"
                    )}
                  >
                    <button
                      onClick={() => toggleQuestion(questionId)}
                      className="w-full flex items-center justify-between p-6 text-left"
                    >
                      <span className="font-medium text-foreground pr-4">{faq.question}</span>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-300",
                          isOpen && "rotate-180 text-accent"
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-300",
                        isOpen ? "max-h-96" : "max-h-0"
                      )}
                    >
                      <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className={cn(
          "mt-20 p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 border border-border/50 text-center transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
            Ready to Secure Your Property?
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Get a free consultation and customized security solution for your home or business.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 shadow-lg shadow-accent/25"
              asChild
            >
              <Link href="/contact">Contact Us Now</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8"
              asChild
            >
              <Link href="/services">View Our Services</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
