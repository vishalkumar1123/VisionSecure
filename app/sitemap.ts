import type { MetadataRoute } from "next"
import pages from "@/lib/seo-pages.json"
import { blogPosts } from "@/lib/blogs"
import { SITE_ORIGIN } from "@/lib/seo"
export default function sitemap(): MetadataRoute.Sitemap {
  return [...pages.map(page => ({ url: SITE_ORIGIN + page.path })), ...blogPosts.map(post => ({ url: `${SITE_ORIGIN}/blog/${post.slug}` }))]
}
