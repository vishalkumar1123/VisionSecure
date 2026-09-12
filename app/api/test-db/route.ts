import { NextResponse } from "next/server"

export async function GET() {
  // Database diagnostics must not be exposed on the public website.
  return NextResponse.json({ error: "Not found" }, { status: 404 })
}
