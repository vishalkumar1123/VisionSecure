/** @type {import('next-sitemap').IConfig} */

const config = {
  siteUrl: "https://visionsecuretech.in",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ["/admin", "/admin/*", "/api/*", "/profile", "/register"],
}

export default config
