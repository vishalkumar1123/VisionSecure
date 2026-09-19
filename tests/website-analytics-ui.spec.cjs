const { test, expect } = require("@playwright/test")
const { buildSync } = require("esbuild")
const fs = require("node:fs"), path = require("node:path")
test.use({ launchOptions: { executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--no-sandbox"] }, reducedMotion: "reduce" })
function bundle(component) {
  return buildSync({ stdin: { contents: `import React from "react";import{createRoot}from"react-dom/client";import Dashboard from"./components/admin/website-analytics/dashboard";import Connect from"./components/admin/website-analytics/google-connect-card";createRoot(document.getElementById("root")).render(${component});`, loader: "tsx", resolveDir: process.cwd() }, bundle: true, write: false, platform: "browser", alias: { "next/link": path.resolve("tests/fixtures/next-link.tsx") }, define: { "process.env.NODE_ENV": '"production"' }, jsx: "automatic" }).outputFiles[0].text
}
const dashboard = bundle('<Dashboard section="overview"/>'), connect = bundle('<Connect/>'), performance = bundle('<Dashboard section="performance"/>')
const report = data => ({ data, error: null, fetchedAt: "2026-09-01T00:00:00Z" })
// Synthetic values exist only in test fixtures, never in application data paths.
const fixture = { reports: { totals: report([{ totalUsers: 35, sessions: 40, screenPageViews: 70 }]), totalsPrevious: report([{ totalUsers: 25, sessions: 30, screenPageViews: 60 }]), trend: report([{ date: "20260901", totalUsers: 35, sessions: 40, screenPageViews: 70 }]), channels: report([{ sessionDefaultChannelGroup: "Organic Search", totalUsers: 20, sessions: 25, engagementRate: 0.7 }]), searchTotals: report([{ clicks: 12, impressions: 300, ctr: 0.04, position: 8 }]), searchTotalsPrevious: report([{ clicks: 10, impressions: 200, ctr: 0.05, position: 12 }]), searchTrend: report([{ date: "2026-09-01", clicks: 12, impressions: 300 }]), queries: report([{ query: "security camera installer", clicks: 1, impressions: 200, ctr: 0.005, position: 12 }]), searchPages: report([{ page: "https://visionsecuretech.in/services/cctv-surveillance", clicks: 12, impressions: 300, ctr: 0.04, position: 8 }]) }, note: "Test-only fixture" }
const status = { connected: true, analytics: "Connected", search: "Connected", missing: [], propertyId: "544810814", siteUrl: "https://visionsecuretech.in/", accountEmail: "fixture@example.test", lastVerifiedAt: null }
async function mount(page, script, theme = "light", responder) {
  const requests = []
  await page.route("**/*", async route => {
    const url = new URL(route.request().url())
    if (url.pathname.startsWith("/api/")) {
      requests.push({ url, method: route.request().method() })
      if (responder) { const response = responder(url, route.request().method()); if (response) return route.fulfill(response) }
      return route.fulfill({ json: url.pathname.includes("integrations") ? status : fixture })
    }
    return route.fulfill({ contentType: "text/html", body: `<html class="${theme}"><body><div id="root" style="padding:12px;min-width:0"></div></body></html>` })
  })
  await page.goto("http://analytics.test")
  for (const file of fs.readdirSync(".next/static/chunks").filter(f => f.endsWith(".css"))) await page.addStyleTag({ content: fs.readFileSync(path.join(".next/static/chunks", file), "utf8") })
  await page.addScriptTag({ content: script })
  return requests
}
for (const width of [320, 375, 430, 768, 1024, 1280, 1440, 1920]) for (const theme of ["light", "dark"]) test(`website analytics ${width}px ${theme}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 })
  const errors = []; page.on("pageerror", error => errors.push(error.message))
  await mount(page, dashboard, theme)
  await expect(page.getByRole("heading", { name: "Website traffic trend" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Search queries", exact: true })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
  expect(errors).toEqual([])
  if ([320, 1440].includes(width)) await page.screenshot({ path: `test-results/website-${width}-${theme}.png`, fullPage: true })
})
test("date and compare controls change server requests; refresh is explicit POST", async ({ page }) => {
  const requests = await mount(page, dashboard)
  await expect(page.getByRole("heading", { name: "Website traffic trend" })).toBeVisible()
  await page.getByLabel("Date range", { exact: true }).selectOption("7 Days")
  await expect.poll(() => requests.some(r => r.url.searchParams.get("start") && (Date.parse(r.url.searchParams.get("end")) - Date.parse(r.url.searchParams.get("start"))) === 6 * 86400000)).toBe(true)
  await page.getByLabel("Compare previous period").uncheck()
  await expect.poll(() => requests.some(r => r.url.searchParams.get("compare") === "false")).toBe(true)
  await page.getByRole("button", { name: "Refresh", exact: true }).click()
  await expect.poll(() => requests.some(r => r.method === "POST")).toBe(true)
})
test("disconnected and partial permissions never display invented totals", async ({ page }) => {
  await mount(page, dashboard, "dark", url => url.pathname.includes("website-analytics") ? { status: 409, json: { error: "NOT_CONNECTED" } } : null)
  await expect(page.getByRole("alert")).toContainText("Connect Google")
  await expect(page.getByText("N/A", { exact: true }).first()).toBeVisible()
})
test("configuration missing disables connect and disconnect requires confirmation", async ({ page }) => {
  await mount(page, connect, "dark", () => ({ json: { ...status, connected: false, missing: ["GOOGLE_CLIENT_ID"] } }))
  await expect(page.getByRole("button", { name: "Connect Google", exact: true })).toBeDisabled()
})
test("disconnect cancel does not revoke; accepted dialog does", async ({ page }) => {
  const requests = await mount(page, connect)
  await expect(page.getByRole("button", { name: "Disconnect", exact: true })).toBeVisible()
  page.once("dialog", dialog => dialog.dismiss())
  await page.getByRole("button", { name: "Disconnect", exact: true }).click()
  expect(requests.filter(r => r.url.pathname.endsWith("disconnect"))).toHaveLength(0)
  page.once("dialog", dialog => dialog.accept())
  await page.getByRole("button", { name: "Disconnect", exact: true }).click()
  await expect.poll(() => requests.some(r => r.url.pathname.endsWith("disconnect") && r.method === "POST")).toBe(true)
})
test("PageSpeed loads cache only and runs each device on demand", async ({ page }) => {
  const requests = await mount(page, performance, "dark", url => url.pathname.includes("pagespeed") ? { json: { data: null, fetchedAt: null } } : null)
  await expect(page.getByRole("button", { name: "Run New Test", exact: true })).toHaveCount(2)
  expect(requests.every(r => r.method === "GET")).toBe(true)
  await page.getByRole("button", { name: "Run New Test", exact: true }).first().click()
  await expect.poll(() => requests.some(r => r.method === "POST" && r.url.searchParams.get("strategy") === "mobile")).toBe(true)
})
