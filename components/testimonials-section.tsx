"use client"

import { useEffect, useRef, useState } from "react"
import { Star, Quote } from "lucide-react"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    name: "Naman Kumar",
    role: "Home Owner",
    company: "Lucknow",
    content: "VisionSecure Smart Technologies changed our home security in a way. They put in a good CCTV system. This system is very good. It makes my family feel safe all the time. We feel safe because of the CCTV system, from VisionSecure Smart Technologies.",
    rating: 5,
    avatar: "NK"
  },
  {
    name: "Abhishek Kumar",
    role: "Home owner",
    company: "Lucknow",
    content: "I got good service from the people who came to my house. They helped me pick out a lock. Then they put it in. The biometric smart lock, on our door is really great. It works perfectly. Our home is a lot safer now and we do not need to use keys. The biometric smart lock is very convenient.",
    rating: 5,
    avatar: "AK"
  },
  {
    name: "Ankit Sharma",
    role: "IT Manager",
    company: "Ware Works",
    content: "We were looking for a security system, for our new logistics warehouse. VisionSecure Smart Technologies did a job. They gave us a security system that includes cameras and a way to control who gets in. This keeps our stock and our company safe. VisionSecure Smart Technologies really helped us out with their security system.",
    rating: 5,
    avatar: "AS"
  },
  {
    name: "Sunita Agarwal",
    role: "School Principal",
    company: "",
    content: "The safety of our students is very important. VisionSecure Smart Technologies gave us a security system for the whole campus. It has 32 cameras and a special attendance system that uses fingerprints, for staff.",
    rating: 5,
    avatar: "SA"
  },
  {
    name: "Vikram Singh",
    role: "Retail Manager",
    company: "",
    content: "Quick installation was a plus for us.The pricing is very competitive. Their, after-sales support has been excellent far. Their advanced surveillance system has really helped us secure our store.We are now fully secured and feel safe.",
    rating: 5,
    avatar: "VS"
  },
  {
    name: "Neha Gupta",
    role: "Homeowner",
    company: "",
    content: "I really like my home automation setup. It is so cool that I can use my phone to control everything. The people from VisionSecure Smart Technologies team were very nice. They took the time to explain all the features of my home automation setup to me. They were very patient, with me when I was learning about the home automation setup.",
    rating: 5,
    avatar: "NG"
  },
]

export function TestimonialsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

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

  return (
    <section id="testimonials" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={cn(
          "max-w-3xl mx-auto text-center mb-16 lg:mb-20 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            What Our Clients Say About VisionSecure Smart Technologies.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by homeowners, businesses, schools, and retail stores across Lucknow and India for reliable security solutions, professional installation, and dependable support.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div 
          ref={scrollRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className={cn(
                "group relative p-6 lg:p-8 rounded-2xl bg-card border border-border/50 hover:border-accent/50 transition-all duration-500 hover:-translate-y-2",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-accent/20 group-hover:text-accent/40 transition-colors">
                <Quote className="h-8 w-8" />
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              {/* Content */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                &quot;{testimonial.content}&quot;
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  <div className="text-xs text-accent">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
