import type { Service } from "@/lib/services"
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
