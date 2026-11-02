import { Fragment } from "react"
import { parseArticle, safeArticleHref } from "@/lib/article-content"

function Inline({ text }: { text: string }) {
  return text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g).map((part, index) => {
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part)
    if (link) {
      const href = safeArticleHref(link[2])
      return href ? <a key={index} href={href} className="font-medium underline underline-offset-4">{link[1]}</a> : <Fragment key={index}>{part}</Fragment>
    }
    return part.startsWith("**") && part.endsWith("**") ? <strong key={index}>{part.slice(2, -2)}</strong> : <Fragment key={index}>{part}</Fragment>
  })
}

export function ArticleContent({ content }: { content: string }) {
  return parseArticle(content).map((block, index) => {
    if (block.type === "rule") return <hr key={index} className="my-8 border-border" />
    if (block.type === "heading") {
      const Heading = block.level === 2 ? "h2" : "h3"
      return <Heading key={index} id={`article-section-${index}`} className={block.level === 2 ? "mb-5 mt-10 text-2xl font-bold text-foreground md:text-3xl" : "mb-4 mt-7 text-xl font-semibold text-foreground"}>{block.text}</Heading>
    }
    if (block.type === "list") {
      const List = block.ordered ? "ol" : "ul"
      return <List key={index} className={`my-5 space-y-3 pl-6 text-muted-foreground ${block.ordered ? "list-decimal" : "list-disc"}`}>{block.items.map((item, itemIndex) => <li key={itemIndex} className="leading-7"><Inline text={item} /></li>)}</List>
    }
    if (block.type === "table") return <div key={index} className="my-6"><p className="mb-2 text-sm text-muted-foreground sm:hidden">Scroll horizontally to compare all columns.</p><div role="region" aria-label={block.caption} tabIndex={0} className="max-w-full overflow-x-auto rounded-xl border border-border focus-visible:outline-2 focus-visible:outline-offset-2"><table className="w-full min-w-[32rem] border-collapse text-left text-sm"><caption className="sr-only">{block.caption}</caption><thead className="bg-muted"><tr>{block.headers.map((cell, column) => <th key={column} scope="col" className="border-b border-border p-4 font-semibold"><Inline text={cell} /></th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, column) => column === 0 ? <th key={column} scope="row" className="border-b border-border p-4 font-medium"><Inline text={cell} /></th> : <td key={column} className="border-b border-border p-4 leading-6 text-muted-foreground"><Inline text={cell} /></td>)}</tr>)}</tbody></table></div></div>
    return <p key={index} className="mb-5 text-base leading-8 text-muted-foreground"><Inline text={block.text} /></p>
  })
}
