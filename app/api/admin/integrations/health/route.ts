import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"
import { appOrigin } from "@/lib/google/security"
import { limitRequest, CenterError, boundedBody } from "@/lib/customer-center/security"
import { integrationSummary, providers, testIntegration } from "@/lib/integrations/health"

export const runtime = "nodejs"
export const maxDuration = 120
const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "private, no-store" } })
async function handle(request: Request) {
  try {
    const { user, response } = await requireAdmin()
    if (response) return response
    if (user!.role !== "super_admin") return json({ error: "SUPER_ADMIN_REQUIRED" }, 403)
    if (request.method === "GET") return json(await integrationSummary())
    if (request.headers.get("origin") !== appOrigin(request)) return json({ error: "INVALID_ORIGIN" }, 403)
    await limitRequest("integration-health-tests", 4)
    let body: { provider?: string }
    try { body = JSON.parse(await boundedBody(request, 1024)) } catch { return json({ error: "INVALID_INPUT" }, 400) }
    if (!body || !["all", ...providers].includes(body.provider || "")) return json({ error: "INVALID_PROVIDER" }, 400)
    const selected = body.provider === "all" ? providers : providers.filter(p => p === body.provider)
    const results = await Promise.all(selected.map(p => testIntegration(p, user!.id)))
    return json({ results })
  } catch (error) { return json({ error: error instanceof CenterError ? error.code : "INTEGRATION_HEALTH_UNAVAILABLE" }, error instanceof CenterError ? error.status : 503) }
}
export const GET = handle
export const POST = handle
