import { NextResponse } from "next/server"
import { equalSecret } from "@/lib/customer-center/security"
import { processJobs } from "@/lib/customer-center/worker"
export const runtime = "nodejs"
export const maxDuration = 120
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET || ""
  if (secret.length < 24 || !equalSecret(request.headers.get("authorization") || "", `Bearer ${secret}`)) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  try { return NextResponse.json(await processJobs(2), { headers: { "Cache-Control": "no-store" } }) } catch { return NextResponse.json({ error: "PROCESSING_UNAVAILABLE" }, { status: 503 }) }
}
