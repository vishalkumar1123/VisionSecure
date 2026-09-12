import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"
import { isSessionTokenActive } from "@/lib/session-security"

const ADMIN_ROLES = new Set(["admin", "super_admin"])

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // `/admin` is the explicit re-authentication entry requested for the
  // back office. Even an existing admin session must pass through the login
  // screen when starting from this URL; protected child routes still honour
  // a valid session after successful sign-in.
  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  // Keep the credential screen reachable so `/admin` cannot bounce between
  // the login route and the dashboard when an older session cookie exists.
  if (pathname === "/admin/login") return NextResponse.next()

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const hasValidAdminToken = Boolean(isSessionTokenActive(token) && ADMIN_ROLES.has(String(token?.role)))

  if (!hasValidAdminToken) {
    const loginUrl = new URL("/admin/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
