"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Tag,
  Youtube
} from "lucide-react"
import { cn } from "@/lib/utils"

const blogPosts = [
  {
    id: 1,
    title: "How to Choose the Right CCTV Camera for Your Home",
    excerpt: "A comprehensive guide to selecting the perfect CCTV system based on your home size, budget, and security needs.",
    image: "/images/service-cctv.jpg",
    category: "CCTV",
    date: "March 15, 2024",
    readTime: "5 min read",
    featured: true
  },
  {
    id: 2,
    title: "Biometric Attendance vs Manual Attendance: Which is Better?",
    excerpt: "Compare the pros and cons of biometric and manual attendance systems for your office or school.",
    image: "/images/service-biometric.jpg",
    category: "Biometric",
    date: "March 10, 2024",
    readTime: "4 min read",
    featured: false
  },
  {
    id: 3,
    title: "Top 5 Home Automation Features You Need in 2024",
    excerpt: "Discover the must-have smart home features that can improve your lifestyle and save energy.",
    image: "/images/service-automation.jpg",
    category: "Automation",
    date: "March 5, 2024",
    readTime: "6 min read",
    featured: false
  },
  {
    id: 4,
    title: "Understanding IP vs Analog CCTV Systems",
    excerpt: "Learn the key differences between IP and analog cameras to make an informed decision for your security setup.",
    image: "/images/project-1.jpg",
    category: "CCTV",
    date: "February 28, 2024",
    readTime: "7 min read",
    featured: false
  },
  {
    id: 5,
    title: "Fire Safety Tips for Commercial Buildings",
    excerpt: "Essential fire safety measures and equipment every commercial building should have installed.",
    image: "/images/project-2.jpg",
    category: "Fire Safety",
    date: "February 20, 2024",
    readTime: "5 min read",
    featured: false
  },
  {
    id: 6,
    title: "Benefits of Access Control Systems for Offices",
    excerpt: "Why modern offices are switching from traditional locks to electronic access control systems.",
    image: "/images/service-access.jpg",
    category: "Access Control",
    date: "February 15, 2024",
    readTime: "4 min read",
    featured: false
  },
]

const categories = ["All", "CCTV", "Biometric", "Automation", "Access Control", "Fire Safety", "Networking"]

export function BlogPageContent() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
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

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredPost = blogPosts.find(post => post.featured)
  const regularPosts = filteredPosts.filter(post => !post.featured)

  return (
    <section ref={sectionRef} className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Search and Filter */}
        <div className={cn(
          "flex flex-col md:flex-row gap-4 justify-between items-center mb-12 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border/50"
            />
          </div>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  activeCategory === category
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && activeCategory === "All" && !searchQuery && (
          <div className={cn(
            "mb-16 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <div className="grid lg:grid-cols-2 gap-8 bg-card rounded-3xl border border-border/50 overflow-hidden">
              <div className="relative aspect-[4/3] lg:aspect-auto">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                  Featured
                </div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    {featuredPost.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {featuredPost.readTime}
                  </span>
                </div>
                <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <Button
                  className="w-fit bg-accent hover:bg-accent/90 text-accent-foreground rounded-full"
                  asChild
                >
                  <Link href={`/blog/${featuredPost.id}`}>
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post, index) => (
            <article
              key={post.id}
              className={cn(
                "group bg-card rounded-2xl border border-border/50 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-accent/10",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm text-xs font-medium">
                  {post.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>
                
                <h3 className="font-display text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {post.excerpt}
                </p>
                
                <Link
                  href={`/blog/${post.id}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                >
                  Read More
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No articles found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setActiveCategory("All")
                setSearchQuery("")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* YouTube CTA */}
        <div className={cn(
          "mt-20 p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-red-500/10 via-red-600/5 to-red-500/10 border border-red-500/20 text-center transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <Youtube className="h-12 w-12 text-red-500 mx-auto mb-6" />
          <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
            Watch Our Video Tutorials
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Subscribe to our YouTube channel for installation guides, product reviews, and security tips.
          </p>
          <Button
            size="lg"
            className="bg-red-500 hover:bg-red-600 text-white rounded-full px-8"
            asChild
          >
            <a href="https://www.youtube.com/@vishalkumar9004" target="_blank" rel="noopener noreferrer">
              <Youtube className="mr-2 h-5 w-5" />
              Subscribe on YouTube
            </a>
          </Button>
        </div>

        {/* Newsletter */}
        <div className={cn(
          "mt-12 p-8 lg:p-12 rounded-3xl bg-card border border-border/50 text-center transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h3 className="font-display text-2xl font-bold text-foreground mb-4">
            Stay Updated
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Get the latest security tips and industry news delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-background border-border/50"
            />
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
