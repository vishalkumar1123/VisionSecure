import { timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"
import { processFollowUps } from "@/lib/follow-up/worker"
export const runtime = "nodejs"
export const maxDuration = 120
export async function GET(request: Request) {
 const secret = process.env.CRON_SECRET || ""
 const supplied = Buffer.from(request.headers.get("authorization") || ""), expected = Buffer.from(`Bearer ${secret}`)
 if (secret.length < 24 || supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401, headers: { "Cache-Control": "no-store" } })
 try { return NextResponse.json(await processFollowUps(), { headers: { "Cache-Control": "no-store" } }) }
 catch { return NextResponse.json({ error: "FOLLOW_UP_PROCESSING_UNAVAILABLE" }, { status: 503, headers: { "Cache-Control": "no-store" } }) }
}
