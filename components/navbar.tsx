"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  // { href: "/projects", label: "Projects" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Route चेंज होने पर मोबाइल मेनू बंद करें
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-white/98 backdrop-blur-md border-b border-slate-200 shadow-md shadow-slate-200/50"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/images/Visionsecuretech_logo.png"
              alt="VisionSecure Smart Technologies"
              width={300}
              height={80}
              className="h-12 lg:h-14 w-auto transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg",
                    isScrolled
                      ? isActive
                        ? "text-green-600"
                        : "text-slate-800 hover:text-green-600"
                      : isActive
                        ? "text-white"
                        : "text-white/90 hover:text-green-300"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className={cn(
                      "absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full",
                      isScrolled ? "bg-green-600" : "bg-white"
                    )} />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "p-0 hover:bg-transparent transition-colors",
                isScrolled
                  ? "text-slate-800 hover:text-green-600"
                  : "text-white hover:text-green-300"
              )}
              asChild
            >
              <a href="tel:+919872133840" className="flex items-center gap-2 whitespace-nowrap font-medium">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+91 98721 33840</span>
              </a>
            </Button>
            
            <Button
              size="sm"
              className="rounded-full px-6 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 hover:scale-105 transition-all duration-300"
              asChild
            >
              <Link href="/contact">Get Free Quote</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "lg:hidden relative p-2 rounded-md transition-colors",
              isScrolled ? "text-slate-800" : "text-white"
            )}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <Menu
                className={cn(
                  "absolute inset-0 transition-all duration-300",
                  isMobileMenuOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                )}
              />
              <X
                className={cn(
                  "absolute inset-0 transition-all duration-300",
                  isMobileMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                )}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-500 ease-out bg-white rounded-b-xl shadow-xl",
            isMobileMenuOpen ? "max-h-[500px] opacity-100 border-t border-slate-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="py-4 space-y-1 px-2">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block px-4 py-3 text-base font-medium rounded-lg transition-all duration-300",
                    isActive
                      ? "bg-green-50 text-green-600 font-semibold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-green-600"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link.label}
                </Link>
              )
            })}
            
            <div className="pt-4 px-4 space-y-4 border-t border-slate-100 mt-2">
              <a
                href="tel:+919872133840"
                className="flex items-center gap-2 text-slate-700 hover:text-green-600 transition-colors font-medium whitespace-nowrap"
              >
                <Phone className="h-4 w-4 text-green-600 shrink-0" />
                <span>+91 98721 33840</span>
              </a>
              
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full shadow-md shadow-green-600/10 py-5"
                asChild
              >
                <Link href="/contact">Get Free Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}