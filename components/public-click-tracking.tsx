"use client"
import { useEffect } from "react"
import { trackPublicEvent } from "@/lib/public-tracking"
export function PublicClickTracking() {
  useEffect(() => {
    const click = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a") : null
      const href = link?.getAttribute("href") || ""
      if (href.startsWith("tel:")) trackPublicEvent("call_click", "public_link")
      else if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) trackPublicEvent("whatsapp_click", "public_link")
    }
    document.addEventListener("click", click)
    return () => document.removeEventListener("click", click)
  }, [])
  return null
}
