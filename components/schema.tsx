import { JsonLd } from "@/components/json-ld"
import { siteSchema } from "@/lib/schema"

export default function Schema() {
  return <JsonLd data={siteSchema} />
}
