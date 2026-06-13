import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
})

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/leads/:path*",
    "/admin/users/:path*",
    "/admin/analytics/:path*",
    "/admin/settings/:path*",
  ],
}