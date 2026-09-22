import "server-only"
import { AIKnowledgeEntry } from "@/models/CustomerCenter"
import { services } from "@/lib/services"
export async function searchKnowledgeBase(text: string) {
  const words = [...new Set(text.toLowerCase().match(/[\p{L}\p{N}]{3,}/gu) || [])].slice(0, 20)
  if (!words.length) return []
  const entries = await AIKnowledgeEntry.find({ state: "PUBLISHED" }).select("title category content keywords replyEnglish replyHinglish revision").limit(300).lean()
  return entries.map(entry => ({ ...entry, score: words.reduce((n, word) => n + (`${entry.title} ${(entry.keywords || []).join(" ")} ${entry.content}`.toLowerCase().includes(word) ? 1 : 0), 0) })).filter(entry => entry.score > 0).sort((a, b) => b.score - a.score).slice(0, 5)
}
export async function seedKnowledgeDrafts() {
  const drafts = [
    { title: "Company introduction", category: "SERVICES", content: "VisionSecure Smart Technologies provides security, networking and smart technology solutions including CCTV, biometric/access control, smart door locks, networking/Wi-Fi, video door phones, home automation and IT/AMC support.", keywords: ["visionsecure", "services", "company"] },
    { title: "Service areas", category: "SERVICE_AREAS", content: "Known service markets: Lucknow, Hardoi, Rae Bareli and Varanasi. The team must confirm availability for other locations.", keywords: ["location", "area", "lucknow", "hardoi", "varanasi"] },
    ...services.map(s => ({ title: s.title, category: "SERVICES", content: `${s.summary}\nSolutions: ${s.solutions.join(", ")}.\n${s.faqs.map(f => `${f.question} ${f.answer}`).join("\n")}`, keywords: [s.slug, ...s.title.toLowerCase().split(" ")] })),
  ]
  for (const draft of drafts) await AIKnowledgeEntry.updateOne({ source: "website-import", title: draft.title }, { $setOnInsert: { ...draft, state: "DRAFT", source: "website-import", replyEnglish: "", replyHinglish: "" } }, { upsert: true })
  return drafts.length
}
