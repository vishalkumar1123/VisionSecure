const { test, expect } = require("@playwright/test")
const { buildSync } = require("esbuild")
const fs = require("node:fs"), path = require("node:path")
test.use({ launchOptions: { executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--no-sandbox"] }, reducedMotion: "reduce" })
function bundle(file) { return buildSync({ stdin: { contents: `import React from "react";import{createRoot}from"react-dom/client";import Component from"./${file}";createRoot(document.getElementById("root")).render(<Component/>);`, loader: "tsx", resolveDir: process.cwd() }, bundle: true, write: false, platform: "browser", alias: { "next/link": path.resolve("tests/fixtures/next-link.tsx") }, define: { "process.env.NODE_ENV": '"production"' }, jsx: "automatic" }).outputFiles[0].text }
const inbox = bundle("components/admin/customer-center/inbox"), knowledge = bundle("components/admin/customer-center/knowledge"), google = bundle("components/admin/website-analytics/google-connect-card")
const id = "aaaaaaaaaaaaaaaaaaaaaaaa", actor = "bbbbbbbbbbbbbbbbbbbbbbbb"
function conversation() { return { _id: id, customerName: "SAMPLE Customer", phone: "919876543210", channel: "WHATSAPP", mode: "AI_ACTIVE", version: 1, unread: 1, lastMessage: "Office ke liye CCTV chahiye", lastMessageAt: "2026-09-20T10:00:00Z", summary: "Sample office CCTV inquiry. Installation needs human assessment.", draft: "Aapke office mein kitne entry points hain?" } }
async function mount(page, script, theme = "light", responder) {
  const c = conversation(), requests = []
  await page.route("**/*", async route => {
    const req = route.request(), url = new URL(req.url()); requests.push({ url, method: req.method(), body: req.postDataJSON() })
    if (url.pathname.startsWith("/api/")) {
      if (responder) { const response = responder(url, req); if (response) return route.fulfill(response) }
      let json = {}
      if (url.pathname.endsWith("/conversations")) json = { items: [c], total: 1 }
      else if (url.pathname.endsWith("/messages")) json = { items: [{ _id: "cccccccccccccccccccccccc", content: c.lastMessage, direction: "INBOUND", senderType: "CUSTOMER", status: "received", createdAt: c.lastMessageAt }], hasMore: false }
      else if (url.pathname.endsWith("/mode")) { Object.assign(c, req.postDataJSON()); c.assignedTo = actor; c.version++ }
      else if (url.pathname.endsWith(`/${id}`)) json = { conversation: c, actorId: actor, identity: { optedOut: false }, lead: null, requests: [], serviceWindowOpen: true }
      else if (url.pathname.endsWith("/knowledge")) json = { entries: [] }
      return route.fulfill({ json })
    }
    return route.fulfill({ contentType: "text/html", body: `<html class="${theme}"><body><div id="root" style="padding:12px;min-width:0"></div></body></html>` })
  })
  await page.goto("https://customer-center.test")
  for (const file of fs.readdirSync(".next/static/chunks").filter(f => f.endsWith(".css"))) await page.addStyleTag({ content: fs.readFileSync(path.join(".next/static/chunks", file), "utf8") })
  await page.addScriptTag({ content: script })
  return requests
}
for (const width of [320, 375, 430, 768, 1024, 1280, 1440, 1920]) for (const theme of ["light", "dark"]) test(`inbox ${width}px ${theme}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 }); const errors = []; page.on("pageerror", e => errors.push(e.message))
  await mount(page, inbox, theme)
  await page.getByRole("button", { name: /SAMPLE Customer/ }).click()
  await expect(page.getByRole("button", { name: "Take Over", exact: true })).toBeVisible()
  await expect(page.getByLabel("Reply to customer")).toBeDisabled()
  await expect(page.getByText("Office ke liye CCTV chahiye", { exact: true }).last()).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
  expect(errors).toEqual([])
  if ([375, 1440].includes(width)) await page.screenshot({ path: `docs/previews/inbox-${width}-${theme}.png`, fullPage: true })
})
test("human takeover unlocks composer; explicit send uses idempotency key", async ({ page }) => {
  const requests = await mount(page, inbox)
  await page.getByRole("button", { name: /SAMPLE Customer/ }).click()
  await page.getByRole("button", { name: "Take Over", exact: true }).click()
  await expect(page.getByLabel("Reply to customer")).toBeEnabled()
  await page.getByLabel("Reply to customer").fill("SAMPLE reply for test only")
  await page.getByRole("button", { name: "Send WhatsApp Reply" }).click()
  await expect.poll(() => requests.filter(r => r.url.pathname.endsWith("/reply")).length).toBe(1)
  expect(requests.find(r => r.url.pathname.endsWith("/reply")).body.key).toMatch(/^[a-f0-9-]{36}$/)
})
test("knowledge keywords preserve commas and save as distinct terms", async ({ page }) => {
  const requests = await mount(page, knowledge)
  await page.getByLabel("Title", { exact: true }).fill("Sample verified service")
  await page.getByLabel("Verified facts and limitations").fill("Fixture business information")
  await page.getByLabel("Search keywords (comma separated)").pressSequentially("cctv, office")
  await page.getByRole("button", { name: "Save Knowledge" }).click()
  await expect.poll(() => requests.some(r => r.method === "POST")).toBe(true)
  expect(requests.find(r => r.method === "POST").body.keywords).toEqual(["cctv", "office"])
})
test("Google setup saves app credentials then enables sign-in", async ({ page }) => {
  let configured = false
  const requests = await mount(page, google, "dark", (url, req) => {
    if (url.pathname.endsWith("/configure")) { configured = true; return { json: { saved: true } } }
    if (url.pathname.endsWith("/status")) return { json: { connected: false, analytics: "Not connected", search: "Not connected", missing: configured ? [] : ["GOOGLE_CLIENT_ID"], canConfigure: true, environment: false, propertyId: "544810814", siteUrl: "https://visionsecuretech.in/" } }
    if (req.method() === "POST") return { json: {} }
  })
  await page.getByLabel("Google OAuth Client ID", { exact: true }).fill("123-fixture.apps.googleusercontent.com")
  await page.getByLabel("Google OAuth Client Secret").fill("fixture-secret-not-real")
  await page.getByRole("button", { name: "Save Google App" }).click()
  await expect(page.getByRole("button", { name: "Sign in with Google", exact: true })).toBeEnabled()
  await expect(page.getByLabel("Google OAuth Client Secret")).toHaveValue("")
  await page.getByRole("button", { name: "Sign in with Google", exact: true }).click()
  await expect.poll(() => requests.some(r => r.url.pathname.endsWith("/connect") && r.method === "POST")).toBe(true)
})
for (const name of ["new-lead", "lead-status-change", "security-alert"]) for (const width of [320, 800]) test(`branded email ${name} ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 })
  await page.route("https://visionsecuretech.in/images/**", route => route.fulfill({ contentType: "image/png", body: fs.readFileSync("public/images/Visionsecuretech_logo.png") }))
  await page.setContent(fs.readFileSync(`docs/previews/${name}.html`, "utf8"))
  await expect(page.getByAltText("VisionSecure Smart Technologies")).toBeVisible()
  await expect.poll(() => page.getByAltText("VisionSecure Smart Technologies").evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
  await page.screenshot({ path: `docs/previews/${name}-${width}.png`, fullPage: true })
})
