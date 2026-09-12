// app/api/debug-users/route.ts

import { NextResponse } from "next/server"

export async function GET() {
  // Diagnostic endpoint intentionally disabled: it previously exposed passwords.
  return NextResponse.json({ error: "Not found" }, { status: 404 })
}
