import type { BlogPost } from "@/lib/blogs"
﻿import type { Service } from "@/lib/services"
import { SITE_ORIGIN } from "@/lib/seo"

// Identity shared by the site graph and each real service's provider reference.
export const BUSINESS_ID = `${SITE_ORIGIN}/#business`

// Address/contact details agree on Home and Contact; hours were confirmed by
// the owner in this session. Unconfirmed social identities/coverage are omitted.
export const localBusinessSchema = {
  "@type": "LocalBusiness",
  "@id": BUSINESS_ID,
  name: "VisionSecure Smart Technologies",
  url: SITE_ORIGIN,
  logo: `${SITE_ORIGIN}/images/Vision.png`,
  image: `${SITE_ORIGIN}/images/Vision.png`,
  telephone: "+919872133840",
  email: "info@visionsecuretech.in",
  address: {
    "@type": "PostalAddress",
    streetAddress: "153, Pili Market, Near Ram Lal Marriage Lawn, Narouna, Kakori Mod, Mohan Road",
    addressLocality: "Lucknow",
    addressRegion: "Uttar Pradesh",
    postalCode: "227107",
    addressCountry: "IN",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(day => `https://schema.org/${day}`),
      opens: "09:00",
      closes: "20:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["https://schema.org/Sunday"],
      opens: "10:00",
      closes: "16:00",
    },
  ],
}

export const websiteSchema = {
  "@type": "WebSite",
  "@id": `${SITE_ORIGIN}/#website`,
  name: "VisionSecure Smart Technologies",
  url: SITE_ORIGIN,
  publisher: { "@id": BUSINESS_ID },
}

export const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [localBusinessSchema, websiteSchema],
}

export function serviceSchema(service: Service) {
  const url = `${SITE_ORIGIN}/services/${service.slug}`
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.title,
    serviceType: service.title,
    description: service.summary,
    category: service.category,
    url,
    image: `${SITE_ORIGIN}${service.image}`,
    mainEntityOfPage: url,
    provider: { "@id": BUSINESS_ID },
  }
}

// Never interpolate raw JSON into a script element: HTML parses </script>
// before JSON. Escaping preserves JSON values while preventing script breakout.
export function serializeJsonLd(value: unknown): string {
  const json = JSON.stringify(value)
  if (json === undefined) throw new TypeError("JSON-LD must be serializable")
  const escapes: Record<string, string> = { "<": "\\u003c", ">": "\\u003e", "&": "\\u0026", "\u2028": "\\u2028", "\u2029": "\\u2029" }
  return json.replace(/[<>&\u2028\u2029]/g, character => escapes[character])
}

// Only fields supported by the visible article are emitted. Historic display
// dates/team labels are not converted into newly verified authorship or review dates.
export function articleSchema(article: BlogPost) {
  const url = `${SITE_ORIGIN}/blog/${article.slug}`
  return {
    "@context": "https://schema.org", "@type": "BlogPosting", "@id": `${url}#article`,
    url, headline: article.title, description: article.excerpt,
    image: `${SITE_ORIGIN}${article.image}`, mainEntityOfPage: { "@id": url },
    publisher: { "@id": BUSINESS_ID }, isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
  }
}

export function breadcrumbSchema(path: string, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList", "@id": `${SITE_ORIGIN}${path}#breadcrumb`,
    itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: `${SITE_ORIGIN}${item.path}` })),
  }
}
