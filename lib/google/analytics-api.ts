import "server-only"
import { requireAdmin } from "@/lib/admin-auth"
import { appOrigin, GoogleError } from "./security"
import { credentials, safeError } from "./oauth"
import { dateRange } from "./dates"
import { report } from "./reports"
import { indexing, publicPaths, publicUrl, speed } from "./monitoring"
import { json, rateLimit } from "./integration-api"

export async function analyticsAPI(request: Request, section: string) {
  try {
    const { user, response } = await requireAdmin()
    if (response) return response
    if (request.method === "POST" && request.headers.get("origin") !== appOrigin(request)) return json({ error: "INVALID_ORIGIN" }, 403)
    await rateLimit(`reports:${user!.id}`, 60)
    const params = new URL(request.url).searchParams
    if (section === "indexing") return json({ ...(await indexing(params.has("url") ? publicUrl(params.get("url")!) : undefined, request.method === "POST")), paths: publicPaths })
    if (section === "pagespeed") {
      const strategy = params.get("strategy") || "mobile"
      if (strategy !== "mobile" && strategy !== "desktop") throw new GoogleError("INVALID_STRATEGY", 400)
      return json(await speed(publicUrl(params.get("url") || "/"), strategy, request.method === "POST"))
    }
    if (!["overview", "traffic", "search", "keywords", "pages"].includes(section)) return json({ error: "NOT_FOUND" }, 404)
    let range
    try { range = dateRange(params.get("start"), params.get("end")) } catch { return json({ error: "INVALID_DATE_RANGE" }, 400) }
    const refresh = request.method === "POST"
    if (refresh) await rateLimit("report-refresh", 2)
    const { client, revision } = await credentials()
    return json(await report(client, revision, section, range, params.get("compare") === "true", refresh, params.has("page") ? publicUrl(params.get("page")!) : undefined))
  } catch (error) { const safe = safeError(error); return json({ error: safe.code }, safe.status) }
}
