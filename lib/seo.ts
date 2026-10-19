import type { Metadata } from "next"
import pages from "./seo-pages.json"
export const SITE_ORIGIN = "https://visionsecuretech.in"
export function pageMetadata(path: string): Metadata {
  const page = pages.find(page => page.path === path)
  if (!page) return {}
  return { title: page.title, description: page.description, alternates: { canonical: SITE_ORIGIN + path }, robots: { index: true, follow: true }, openGraph: { title: page.title, description: page.description, url: SITE_ORIGIN + path, type: "website", siteName: "VisionSecure Smart Technologies", images: ["/images/Vision.png"] } }
}
