"use client"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { hindi } from "@/lib/translations"

// Update text nodes in place: never replace React-owned elements or translate user input.
export function SiteLanguage() {
  const pathname = usePathname()
  useEffect(() => {
    if (pathname.startsWith("/admin")) { document.documentElement.lang = "en"; return }
    const originals = new Map<Text, { source: string; translated: string }>()
    const attributes = new Map<Element, Map<string, { source: string; translated: string }>>()
    let language = localStorage.getItem("visionsecure-language") || "en"
    let scheduled = false
    let disposed = false
    const translate = (value: string) => {
      const trimmed = value.trim().replace(/\s+/g, " ")
      return hindi[trimmed] ? value.replace(value.trim(), hindi[trimmed]) : value
    }
    const ignored = (element: Element | null) => !element || !!element.closest("script, style, code, pre, textarea, input:not([placeholder]), [data-no-translate], [contenteditable=true]")
    const apply = () => {
      if (disposed) return
      scheduled = false; observer.disconnect()
      document.documentElement.lang = language
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
      while (walker.nextNode()) {
        const node = walker.currentNode as Text
        if (ignored(node.parentElement)) continue
        const current = node.nodeValue || ""
        const saved = originals.get(node)
        const source = saved && current === saved.translated ? saved.source : current
        const translated = language === "hi" ? translate(source) : source
        if (source !== translated) originals.set(node, { source, translated })
        if (current !== translated) node.nodeValue = translated
      }
      document.querySelectorAll("[placeholder], [aria-label], [title]").forEach(element => {
        if (ignored(element)) return
        for (const key of ["placeholder", "aria-label", "title"]) {
          const current = element.getAttribute(key); if (!current) continue
          const values = attributes.get(element) || new Map<string, { source: string; translated: string }>()
          const saved = values.get(key); const source = saved && current === saved.translated ? saved.source : current
          const translated = language === "hi" ? translate(source) : source
          values.set(key, { source, translated }); attributes.set(element, values)
          if (current !== translated) element.setAttribute(key, translated)
        }
      })
      for (const node of originals.keys()) if (!node.isConnected) originals.delete(node)
      for (const element of attributes.keys()) if (!element.isConnected) attributes.delete(element)
      observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["placeholder", "aria-label", "title"] })
    }
    const observer = new MutationObserver(() => { if (!scheduled) { scheduled = true; queueMicrotask(apply) } })
    const change = (event: Event) => { language = (event as CustomEvent<string>).detail; apply() }
    apply(); window.addEventListener("visionsecure-language", change)
    return () => {
      disposed = true; observer.disconnect(); window.removeEventListener("visionsecure-language", change)
      originals.forEach((value, node) => { if (node.isConnected && node.nodeValue === value.translated) node.nodeValue = value.source })
      attributes.forEach((values, element) => values.forEach((value, key) => { if (element.isConnected && element.getAttribute(key) === value.translated) element.setAttribute(key, value.source) }))
    }
  }, [pathname])
  return null
}
