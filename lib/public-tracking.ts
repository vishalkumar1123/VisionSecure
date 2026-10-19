type PublicEvent = "enquiry_saved" | "call_click" | "whatsapp_click"
export function trackPublicEvent(event: PublicEvent, form: "home" | "contact" | "popup" | "public_link") {
  try {
    if (typeof window === "undefined" || /^\/(admin|profile|register)(\/|$)/.test(window.location.pathname)) return
    const analytics = window as unknown as { gtag?: (...args: unknown[]) => void }
    analytics.gtag?.("event", event, { form, page_location: window.location.origin + window.location.pathname, page_referrer: "" })
  } catch { /* Analytics must never block a saved enquiry or navigation. */ }
}
