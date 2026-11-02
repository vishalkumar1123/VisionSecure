export type ArticleBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][]; caption: string }
  | { type: "rule" }

const bullet = /^(?:[-*\u2022\u2714\u2713])\s+/
const ordered = /^\d+[.)]\s+/
const cells = (line: string) => line.trim().replace(/^\|/, "").replace(/\|$/, "").split(/(?<!\\)\|/).map(cell => cell.trim().replace(/\\\|/g, "|"))
const divider = (line: string) => line.includes("|") && cells(line).every(cell => /^:?-{3,}:?$/.test(cell))

// A deliberately small document format, not arbitrary HTML or executable Markdown.
// A cursor consumes each source line once; labels never swallow the next paragraph.
export function parseArticle(content: string): ArticleBlock[] {
  const lines = content.replace(/\r\n?/g, "\n").split("\n").map(line => line.trim())
  const blocks: ArticleBlock[] = []
  let index = 0
  let heading = "Article comparison"
  const startsBlock = (at: number) => /^(#{2,3})\s+/.test(lines[at]) || lines[at] === "---" || bullet.test(lines[at]) || ordered.test(lines[at]) || (lines[at].includes("|") && divider(lines[at + 1] || ""))
  while (index < lines.length) {
    const line = lines[index]
    if (!line) { index++; continue }
    const title = /^(#{2,3})\s+(.+)$/.exec(line)
    if (title) { heading = title[2]; blocks.push({ type: "heading", level: title[1].length as 2 | 3, text: heading }); index++; continue }
    if (line === "---") { blocks.push({ type: "rule" }); index++; continue }
    if (line.includes("|") && divider(lines[index + 1] || "")) {
      const headers = cells(line)
      const rows: string[][] = []
      index += 2
      while (index < lines.length && lines[index].includes("|") && cells(lines[index]).length === headers.length) rows.push(cells(lines[index++]))
      blocks.push({ type: "table", headers, rows, caption: heading }); continue
    }
    if (bullet.test(line) || ordered.test(line)) {
      const isOrdered = ordered.test(line)
      const pattern = isOrdered ? ordered : bullet
      const items: string[] = []
      while (index < lines.length && pattern.test(lines[index])) items.push(lines[index++].replace(pattern, ""))
      blocks.push({ type: "list", ordered: isOrdered, items }); continue
    }
    const paragraph = [line]
    index++
    while (index < lines.length && lines[index] && !startsBlock(index)) paragraph.push(lines[index++])
    blocks.push({ type: "paragraph", text: paragraph.join(" ") })
  }
  return blocks
}

export function safeArticleHref(value: string): string | null {
  if (/[\u0000-\u0020\u007f\\]/.test(value)) return null
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return value
  if (/^#[a-z0-9-]+$/i.test(value)) return value
  try { const url = new URL(value); return url.protocol === "https:" ? url.href : null } catch { return null }
}
