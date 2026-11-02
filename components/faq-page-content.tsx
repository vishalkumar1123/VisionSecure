"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  ChevronDown,
  HelpCircle,
  Phone,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { FaWhatsapp } from "react-icons/fa";
const faqCategories = [
  {
    id: "general",
    title: "General Questions",
    faqs: [
      {"question": "What should I share to get a quotation?", "answer": "Share the full site address, property type, areas to cover, approximate device or point count and any existing equipment. Describe the problem you want to solve. Keep passwords, recordings and employee records out of the enquiry."},

      {
        question: "What types of security systems do you install?",
        answer: "Our existing service pages cover CCTV, biometric attendance, access control, video door phones, smart locks, networking, automation and general alarm solutions. Describe your required function so equipment compatibility and the exact work can be confirmed; a related enquiry option is not a promise that every specialist system is included."
      },
      {
        question: "Which areas do you serve?",
        answer: "Lucknow is our primary market. For a site outside Lucknow, share the city and full address so installation availability, travel and ongoing support can be confirmed before arranging a visit. Do not assume a local office or regular coverage in another city."
      },
      {
        question: "Do you provide free site visits?",
        answer: "Confirm appointment availability, any assessment or travel charges and what the visit includes before booking. Site conditions and location can affect the arrangements; the written quotation should identify any agreed charges."
      },
      {
        question: "How long does installation typically take?",
        answer: "Timing depends on device count, cable routes, access, existing equipment and the agreed configuration/testing. Discuss the work sequence and any expected outage before confirming a schedule; a fixed one-day completion should not be assumed for every property."
      },
    ]
  },
  {
    id: "cctv",
    title: "CCTV & Surveillance",
    faqs: [
      {"question": "Will CCTV record without internet?", "answer": "Many DVR and NVR systems can record locally without internet while power is available. Remote mobile viewing needs an internet connection. Cloud-only cameras may behave differently."},
      {"question": "What happens during a power cut?", "answer": "Cameras and the recorder need power. A suitable UPS can keep the system running for a limited time; backup duration depends on the equipment and battery size."},
      {"question": "How many cameras will my home need?", "answer": "Start with entrances, parking and important shared areas. The number depends on the layout and blind spots, so a site assessment is more useful than choosing a fixed package."},

      {
        question: "What is the difference between analog and IP cameras?",
        answer: "Analog and IP systems use different video and recording arrangements. Compare the actual cameras, recorder, cabling and required image detail before choosing or upgrading. Features, resolution and cost depend on the selected models, not only the system label."
      },
      {
        question: "Can I view my cameras on my mobile phone?",
        answer: "Remote viewing can be configured where the selected cameras or recorder, app and connection support it. Agree account ownership, user permissions and any recurring charges. Keep passwords out of the enquiry and check supported live/playback functions at handover."
      },
      {
        question: "How much storage do I need for CCTV recordings?",
        answer: "Specify the camera count, recording schedule and retention period. Resolution, bitrate, frame rate, compression and scene activity affect storage. Request an estimate for the selected settings and test playback/export; one drive size does not guarantee the same retention for all systems."
      },
      {
        question: "Do cameras work at night?",
        answer: "Night performance depends on the selected camera, lens, scene and lighting. Infrared and colour modes have different requirements. Check a representative night view and the required detail at the actual distance rather than assuming a fixed range or clear identification in all darkness."
      },
    ]
  },
  {
    id: "biometric",
    title: "Biometric Systems",
    faqs: [
      {
        question: "Which is better - fingerprint or face recognition?",
        answer: "Compare staff workflow, lighting, placement, supported enrolment and data handling. Recognition methods differ by device and environment, so test suitability instead of assuming one method is always faster or more accurate. Attendance reporting and door-entry control are separate requirements."
      },
      {
        question: "Can biometric systems integrate with payroll software?",
        answer: "Confirm the device/software versions, licences and required export formats before ordering. Use test data to review a sample export with the payroll process. A device collecting attendance does not automatically establish direct compatibility with every HR or payroll platform."
      },
      {
        question: "What happens if the biometric device fails?",
        answer: "Offline recording, backup credentials and data recovery depend on the selected device and fault. Agree an alternative attendance process, backup responsibilities and support contact arrangements before use. Maintenance response commitments must be part of the written support scope."
      },
    ]
  },
  {
    id: "pricing",
    title: "Pricing & Payment",
    faqs: [
      {
        question: "How much does a basic CCTV system cost?",
        answer: "A quotation depends on coverage, selected cameras/recorder, storage, cable routes, power, access and configuration. Share your site requirements for an itemised scope. Equipment, installation and any subscriptions or extra work should be identified separately; no fixed package price is assumed."
      },
      {
        question: "Do you offer EMI options?",
        answer: "Ask which payment methods and schedules are available before accepting a quotation. Any financing eligibility, fees and provider terms should be confirmed in writing; an EMI option is not part of every order."
      },
      {
        question: "Is installation included in the price?",
        answer: "Check the itemised quotation for installation, cable lengths, mounting, power work, configuration, testing and handover. Existing routes and access can affect labour and materials. Agree additional work before it proceeds rather than assuming a standard cable allowance or inclusion."
      },
    ]
  },
  {
    id: "warranty",
    title: "Warranty & AMC",
    faqs: [
      {
        question: "What warranty do you provide?",
        answer: "Warranty depends on the selected product and written terms. Confirm duration, the claim process, exclusions and any labour or travel charges before ordering. Manufacturer warranty and an AMC are different arrangements; neither automatically covers every fault or replacement."
      },
      {
        question: "What is included in your AMC plans?",
        answer: "Agree the supported asset list, existing faults, preventive tasks, visit arrangements, fault-reporting process and exclusions. Confirm labour, spares, consumables, licences and third-party responsibilities in writing. Quarterly visits, unlimited support or discounted parts should not be assumed unless agreed."
      },
      {
        question: "How quickly do you respond to service calls?",
        answer: "Agree the reporting channel, issue priority and any response commitment in the written support terms. Timing depends on the applicable arrangement, location and access; there is no universal response-time guarantee stated here."
      },
    ]
  },
  {
    id: "support",
    title: "Support & Service",
    faqs: [
      {"question": "My mobile app shows the camera offline. What should I check?", "answer": "Check power to the camera and recorder, then check your router and internet connection. Avoid a factory reset. If it stays offline, share the device model and error screenshot with our team."},
      {"question": "How do I keep my camera account secure?", "answer": "Use a strong, unique password, enable two-step verification if supported and share access only with trusted people. Never share your password or OTP in chat."},
      {"question": "Can I get help learning to use the system?", "answer": "Ask our team to walk you through live view, playback and saving a recording. Tell us your device model so we can guide you through the correct steps."},

      {
        question: "Do you provide remote support?",
        answer: "Remote troubleshooting may be suitable for supported equipment and software issues when authorised access and connectivity are available. Agree permissions and access ownership first. Physical faults or cabling problems may require a separately arranged onsite assessment."
      },
      {
        question: "What happens if a camera stops working?",
        answer: "Report the equipment and symptoms without passwords or private footage. Diagnosis helps distinguish power, cabling, recorder, connection and camera faults. Confirm warranty/AMC applicability and any repair, replacement, labour or travel charges before approving work."
      },
      {
        question: "Can you upgrade my existing security system?",
        answer: "An assessment can identify which equipment may be retained and which changes are practical. Share the camera/recorder models, current cabling and desired functions. Compatibility, migration and recording interruptions need explicit checks before adding devices or changing systems."
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
                <HelpCircle className="h-8 w-8 text-brand-green mb-3" />
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
                    className="w-full rounded-full border-accent/50 text-brand-green hover:bg-accent/10"
                    asChild
                  >
                    <a href="https://wa.me/919872133840" target="_blank" rel="noopener noreferrer">
                      <FaWhatsapp className="mr-2 h-4 w-4" />
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
                      aria-expanded={isOpen}
                      aria-controls={`answer-${questionId}`}
                      className="w-full flex items-center justify-between p-6 text-left"
                    >
                      <span className="font-medium text-foreground pr-4">{faq.question}</span>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-300",
                          isOpen && "rotate-180 text-brand-green"
                        )}
                      />
                    </button>
                    <div
                      id={`answer-${questionId}`}
                      aria-hidden={!isOpen}
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
