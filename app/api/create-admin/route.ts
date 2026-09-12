import { NextResponse } from "next/server"

// Admin accounts must be provisioned through a controlled deployment process.
// This endpoint previously created a publicly-known administrator credential.
export async function GET() {
  return NextResponse.json({ error: "Not found" }, { status: 404 })
}
