import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { blogPosts } from "@/lib/blogs"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  Tag, 
  ShieldCheck,
  Zap,
  PhoneCall,
  Check
} from "lucide-react"

interface Props {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogDetail({ params }: Props) {
  const { slug } = await params
  const blog = blogPosts.find((x) => x.slug === slug)

  if (!blog) {
    notFound()
  }

  // Pure Server-side Text Parser to transform raw lines into Luxury HTML Elements
  const parseBlogContent = (contentString: string) => {
    const lines = contentString.split("\n")
    
    return lines.map((line, index) => {
      const trimmed = line.trim()
      if (!trimmed) return null

      // Section Headings (## Section)
      if (trimmed.startsWith("## ")) {
        return (
          <h2 key={index} className="text-2xl md:text-3xl font-bold text-foreground mt-12 mb-6 border-b border-border pb-3 tracking-tight flex items-center gap-3 font-display">
            <span className="h-6 w-1.5 bg-accent rounded-full inline-block" />
            {trimmed.replace("## ", "")}
          </h2>
        )
      }

      // Sub Headings (### Element)
      if (trimmed.startsWith("### ")) {
        return (
          <h3 key={index} className="text-xl md:text-2xl font-semibold text-foreground mt-8 mb-4 tracking-tight font-display">
            {trimmed.replace("### ", "")}
          </h3>
        )
      }

      // Horizontal Lines (---)
      if (trimmed === "---") {
        return <hr key={index} className="my-10 border-border/60" />
      }

      // Status Checkmarks (✔ Feature Item)
      if (trimmed.startsWith("✔ ")) {
        return (
          <div key={index} className="flex items-center gap-3 my-3 bg-emerald-500/5 text-muted-foreground p-4 rounded-xl border border-emerald-500/10 shadow-xs">
            <div className="h-5 w-5 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
              <Check className="h-3 w-3 text-emerald-500 stroke-[3]" />
            </div>
            <span className="text-sm md:text-base font-medium text-foreground/90">{trimmed.replace("✔ ", "")}</span>
          </div>
        )
      }

      // Actionable Bullet Points (• or -)
      if (trimmed.startsWith("• ") || trimmed.startsWith("- ")) {
        return (
          <div key={index} className="flex items-start gap-3 my-3 pl-1">
            <Zap className="h-4 w-4 text-accent mt-1 shrink-0" />
            <span className="text-muted-foreground leading-relaxed text-[15px] md:text-[16px]">
              {trimmed.substring(2)}
            </span>
          </div>
        )
      }

      // Smart Recommendation Display for (BHK / Villa / Office / Warehouse setups)
      const isSpecifier = trimmed.includes("BHK") || 
                          trimmed.toLowerCase() === "villa" || 
                          trimmed.toLowerCase() === "office" || 
                          trimmed.toLowerCase() === "warehouse"
      
      if (isSpecifier) {
        const nextLine = lines[lines.indexOf(line) + 1]?.trim() || ""
        if (nextLine && !nextLine.startsWith("#") && !nextLine.startsWith("-") && !nextLine.startsWith("✔")) {
          return (
            <div key={index} className="flex justify-between items-center bg-muted/60 border border-border/60 p-4 rounded-xl my-3 shadow-xs">
              <span className="text-base font-bold text-foreground">{trimmed} Property</span>
              <span className="text-xs font-extrabold bg-accent text-accent-foreground px-3 py-1 rounded-full uppercase tracking-wider">
                {nextLine} Setup
              </span>
            </div>
          )
        }
      }

      // Skip rendering plain counter line if handled by the layout block above
      if (index > 0 && (lines[index - 1].includes("BHK") || lines[index - 1].toLowerCase() === "villa" || lines[index - 1].toLowerCase() === "office" || lines[index - 1].toLowerCase() === "warehouse")) {
        return null
      }

      // Standard Paragraph Text
      return (
        <p key={index} className="text-muted-foreground leading-relaxed mb-5 text-[16px] md:text-[17px]">
          {trimmed}
        </p>
      )
    })
  }

  return (
    <main className="min-h-screen bg-background pb-24 selection:bg-accent/30">
      
      {/* Article Header */}
      <header className="bg-gradient-to-b from-muted/60 via-muted/10 to-transparent pt-28 pb-6">
        <div className="container mx-auto px-4 max-w-4xl">
          
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-accent transition-colors mb-6 bg-card border border-border/40 px-4 py-2 rounded-full w-fit shadow-xs group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Tech Insights
          </Link>

          <div className="mb-4">
            <span className="bg-accent/10 text-accent text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-md border border-accent/20">
              {blog.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight mb-6 leading-[1.15] font-display">
            {blog.title}
          </h1>

          {/* Meta Info Bar */}
          <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-muted-foreground pt-4 border-t border-border/40">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-xs">
                <User className="h-4 w-4" />
              </div>
              <span className="font-semibold text-foreground">{blog.author}</span>
            </div>
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {blog.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {blog.readTime}</span>
          </div>
        </div>
      </header>

      {/* Main Content Sections Container */}
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* BIG HERO IMAGE: Placed outside the split column to take full elegant layout width */}
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-2xl border border-border/40 mb-12 bg-muted">
          <Image 
            src={blog.image || "/placeholder.svg"} 
            alt={blog.title} 
            fill 
            priority
            sizes="(max-width: 960px) 100vw, 960px"
            className="object-cover transition-transform duration-500 hover:scale-[1.01]" 
          />
        </div>

        {/* Split Grid for Content and Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Article Body (Takes 8 blocks) */}
          <div className="lg:col-span-8">
            <article className="prose dark:prose-invert max-w-none">
              {parseBlogContent(blog.content)}
            </article>

            {/* Bottom Conversion Lead Card */}
            <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-accent/[0.08] via-card to-muted border border-accent/20 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none select-none">
                <ShieldCheck className="h-40 w-40 text-accent" />
              </div>
              <ShieldCheck className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-2xl font-extrabold tracking-tight text-foreground mb-2 font-display">
                Secure Your Premises Today
              </h3>
              <p className="text-muted-foreground text-sm md:text-base mb-6 leading-relaxed">
                Aapki safety hamari priority hai. Get a commercial-grade customized security blueprint mapped entirely for your space by VisionSecure experts.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground px-6 shadow-sm font-medium" asChild>
                  <Link href="/contact">Book Free Site Survey</Link>
                </Button>
                <Button variant="outline" className="rounded-full px-6 gap-2 font-medium" asChild>
                  <a href="tel:+91 9872133840">
                    <PhoneCall className="h-4 w-4" /> Free Consultation
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar (Takes 4 blocks) */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-xs lg:sticky lg:top-28">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <Tag className="h-4 w-4 text-accent" /> Related Keywords
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {blog.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="text-xs bg-secondary hover:bg-accent/10 border border-transparent hover:border-accent/20 font-medium text-secondary-foreground px-2.5 py-1.5 rounded-lg transition-all"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Extra Security Trust Badge inside sidebar */}
              <div className="mt-8 pt-6 border-t border-border/60 text-xs text-muted-foreground flex flex-col gap-2">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Verified Security Guide</span>
                </div>
                Aapke residential aur commercial assets ki security automation technology ke liye absolute professional advice.
              </div>
            </div>
          </aside>

        </div>
      </div>
    </main>
  )
}