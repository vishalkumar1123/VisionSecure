import { JsonLd } from "@/components/json-ld"
import { articleSchema, breadcrumbSchema } from "@/lib/schema"
import { ArticleContent } from "@/components/article-content"
import type { Metadata } from "next"
import { SITE_ORIGIN } from "@/lib/seo"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { blogPosts } from "@/lib/blogs"
import { serviceBySlug } from "@/lib/services"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  Tag, 
  ShieldCheck,
  PhoneCall,
} from "lucide-react"

interface Props {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() { return blogPosts.map(({ slug }) => ({ slug })) }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug
  const article = blogPosts.find(post => post.slug === slug)
  if (!article) return {}
  const title = `${article.title} | VisionSecure`
  const url = `${SITE_ORIGIN}/blog/${article.slug}`
  return { title, description: article.excerpt, alternates: { canonical: url }, robots: { index: true, follow: true }, openGraph: { title, description: article.excerpt, url, type: "article", images: [article.image] }, twitter: { card: "summary_large_image", title, description: article.excerpt, images: [article.image] } }
}

export default async function BlogDetail({ params }: Props) {
  const { slug } = await params
  const blog = blogPosts.find((x) => x.slug === slug)

  if (!blog) {
    notFound()
  }

  const serviceSlugs: Record<string, string> = {
    "how-to-choose-the-right-cctv-camera": "cctv-surveillance",
    "understanding-ip-vs-analog-cctv": "cctv-surveillance",
    "biometric-attendance-vs-manual-attendance": "biometric-attendance",
    "top-5-home-automation-features": "home-automation",
    "benefits-of-access-control-systems": "access-control-system",
    "fire-safety-tips-commercial-buildings": "emergency-alarm-system",
    "networking-structured-cabling-and-server-setup-guide": "networking-solutions",
  }
  const relatedService = serviceBySlug(serviceSlugs[slug])


  return (
    <main className="min-h-screen bg-background selection:bg-accent/30">
      
      <JsonLd data={articleSchema(blog)} />
      <JsonLd data={breadcrumbSchema(`/blog/${slug}`, [{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: blog.title, path: `/blog/${slug}` }])} />
      {/* Article Header */}
      <Navbar />
      <header className="bg-gradient-to-b from-muted/60 via-muted/10 to-transparent pt-28 pb-6">
        <div className="container mx-auto px-4 max-w-4xl">
          
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground"><ol className="flex flex-wrap gap-2"><li><Link href="/">Home</Link></li><li aria-hidden="true">/</li><li><Link href="/blog">Blog</Link></li><li aria-hidden="true">/</li><li aria-current="page" className="text-foreground">{blog.title}</li></ol></nav>

          <div className="mb-4">
            <span className="bg-accent/10 text-brand-green text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-md border border-accent/20">
              {blog.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight mb-6 leading-[1.15] font-display">
            {blog.title}
          </h1>

          {/* Meta Info Bar */}
          <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-muted-foreground pt-4 border-t border-border/40">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-accent/10 text-brand-green flex items-center justify-center font-bold text-xs">
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
          <div className="min-w-0 lg:col-span-8">
            <article className="prose min-w-0 dark:prose-invert max-w-none">
              <ArticleContent content={blog.content} />
              {slug === "networking-structured-cabling-and-server-setup-guide" && <section className="mt-10" aria-labelledby="router-switch-heading"><h2 id="router-switch-heading" className="text-2xl font-bold">What is the difference between a router and a switch?</h2><p className="mt-4 leading-7 text-muted-foreground">A switch connects devices within a local network; a router connects networks. Some products combine functions. Count wired devices, uplinks and powered equipment, then check port capacity, PoE limits and administration requirements for the selected models.</p></section>}
            </article>

            {/* Bottom Conversion Lead Card */}
            <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-accent/[0.08] via-card to-muted border border-accent/20 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none select-none">
                <ShieldCheck className="h-40 w-40 text-brand-green" />
              </div>
              <ShieldCheck className="h-12 w-12 text-brand-green mb-4" />
              <h3 className="text-2xl font-extrabold tracking-tight text-foreground mb-2 font-display">
                Secure Your Premises Today
              </h3>
              <p className="text-muted-foreground text-sm md:text-base mb-6 leading-relaxed">
                Share your property, existing equipment and what you need the system to do. Discuss compatible options and the quotation scope before ordering.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground px-6 shadow-sm font-medium" asChild>
                  <Link href={relatedService ? `/contact?service=${encodeURIComponent(relatedService.title)}` : "/contact"}>Discuss related requirements</Link>
                </Button>
                <Button variant="outline" className="rounded-full px-6 gap-2 font-medium" asChild>
                  <a href="tel:+91 9872133840">
                    <PhoneCall className="h-4 w-4" /> Call VisionSecure
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar (Takes 4 blocks) */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-xs lg:sticky lg:top-28">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <Tag className="h-4 w-4 text-brand-green" /> Related Keywords
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
                  <ShieldCheck className="h-4 w-4 text-brand-green" />
                  <span>Planning notes</span>
                </div>
                Use this guide to prepare questions for your site assessment. Confirm selected equipment and any specialist safety requirements before work.
              </div>
            </div>
          </aside>

        </div>
      </div>
      {blog.slug === "networking-structured-cabling-and-server-setup-guide" && (
        <section className="page-container py-10" aria-labelledby="cabling-enquiry-heading">
          <h2 id="cabling-enquiry-heading" className="text-2xl font-bold">Planning server room cabling in Lucknow?</h2>
          <p className="mt-3 leading-7 text-muted-foreground">Turn this guide into a site-specific plan: list network points, rack space, cable routes and existing equipment. Explore our <Link className="font-semibold text-brand-green underline underline-offset-4" href="/services/networking-solutions">LAN networking and structured cabling service</Link> for wired connectivity, or <Link className="font-semibold text-brand-green underline underline-offset-4" href="/services/server-networking-infrastructure">server and network infrastructure setup</Link> for rack and server requirements.</p>
          <p className="mt-3 leading-7 text-muted-foreground">For an itemised scope, <Link className="font-semibold text-brand-green underline underline-offset-4" href="/contact?service=Networking%20Solutions">send your networking requirements</Link> with your Lucknow locality or PIN. Confirm testing, migration, backup responsibilities and any downtime before approving work.</p>
        </section>
      )}
      <section className="page-container py-10"><h2 className="text-2xl font-bold">Planning an installation?</h2><p className="mt-3">Explore <Link className="underline" href="/services">security and networking services</Link> or <Link className="underline" href="/contact">discuss your requirements</Link>.</p></section>
      <Footer />
    </main>
  )
}
