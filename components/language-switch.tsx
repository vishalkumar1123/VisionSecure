"use client"
import { useEffect, useState } from "react"
import { Languages, Check } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
export function LanguageSwitch() {
  const [language, setLanguage] = useState("en")
  useEffect(() => { setLanguage(localStorage.getItem("visionsecure-language") || "en") }, [])
  const select = (value: string) => { localStorage.setItem("visionsecure-language", value); setLanguage(value); window.dispatchEvent(new CustomEvent("visionsecure-language", { detail: value })) }
  return <DropdownMenu><DropdownMenuTrigger asChild><button type="button" data-no-translate aria-label="Choose language: English or Hindi" title="English / हिन्दी" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground"><Languages size={20} /></button></DropdownMenuTrigger><DropdownMenuContent data-no-translate align="end"><DropdownMenuLabel>English / हिन्दी</DropdownMenuLabel><DropdownMenuItem onSelect={() => select("en")}>English {language === "en" && <Check size={16} />}</DropdownMenuItem><DropdownMenuItem onSelect={() => select("hi")}>हिन्दी {language === "hi" && <Check size={16} />}</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
}
