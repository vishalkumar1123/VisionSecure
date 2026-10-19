/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  async redirects() {
    return [{ source: "/:path*", has: [{ type: "host", value: "www.visionsecuretech.in" }], destination: "https://visionsecuretech.in/:path*", permanent: true }]
  },

  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ]
    return [
      { source: "/:path*", headers: securityHeaders },
      ...["/admin/:path*", "/profile", "/register", "/api/:path*", "/inquiry"].map(source => ({ source, headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] })),
      { source: "/admin/:path*", headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0, must-revalidate" }] },
      { source: "/api/admin/:path*", headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0, must-revalidate" }] },
    ]
  },

  images: {
    formats: ["image/avif", "image/webp"],
  },
}

export default nextConfig
