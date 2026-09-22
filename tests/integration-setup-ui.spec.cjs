const { test, expect } = require('@playwright/test')
const { buildSync } = require('esbuild')
const fs = require('node:fs'), path = require('node:path')
test.use({ launchOptions: { executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--no-sandbox'] } })
const script = buildSync({ stdin: { contents: 'import React from "react";import{createRoot}from"react-dom/client";import Component from"./components/admin/integration-setup-center";createRoot(document.getElementById("root")).render(<Component/>);', loader: 'tsx', resolveDir: process.cwd() }, bundle: true, write: false, platform: 'browser', alias: { 'next/link': path.resolve('tests/fixtures/next-link.tsx') }, define: { 'process.env.NODE_ENV': '"production"' }, jsx: 'automatic' }).outputFiles[0].text
const fixture = { checklist: [{ name: 'OpenAI API Key', configured: false }, { name: 'META_GRAPH_VERSION', configured: false }], checks: {}, progress: ['Google OAuth','Analytics','Search Console','OpenAI','WhatsApp','Instagram','Facebook'].map(name => ({ name, ready: false })), appUrl: 'http://localhost:3000', urlConflicts: [], model: 'gpt-4o-mini', ai: { missing: ['OPENAI_API_KEY'], configured: false, mode: 'DRAFT' }, google: { status: 'Missing' }, meta: { missing: ['META_GRAPH_VERSION'], status: 'Partial', webhook: 'Waiting' }, email: { configured: false, active: false }, webhookUrl: null }
async function mount(page, theme, forbidden = false) {
  const posts = []
  await page.route('**/*', async route => {
    const req = route.request(), url = new URL(req.url())
    if (req.method() === 'POST') { posts.push(req.postDataJSON()); return route.fulfill({ json: { results: [{ provider: 'ai', status: 'Warning', error: 'OPENAI_NOT_CONFIGURED' }] } }) }
    if (url.pathname.endsWith('/health')) return route.fulfill({ status: forbidden ? 403 : 200, json: forbidden ? { error: 'SUPER_ADMIN_REQUIRED' } : fixture })
    if (url.pathname.endsWith('/status')) return route.fulfill({ json: { connected: false, analytics: 'Not connected', search: 'Not connected', missing: ['GOOGLE_TOKEN_ENCRYPTION_KEY','GOOGLE_CLIENT_ID'], canConfigure: true, environment: false, propertyId: 'fixture', siteUrl: 'https://visionsecuretech.in/', redirectUri: fixture.appUrl + '/api/admin/integrations/google/callback' } })
    return route.fulfill({ contentType: 'text/html', body: `<html class="${theme}"><body><div id="root" style="padding:16px"></div></body></html>` })
  })
  await page.goto('https://integration.test')
  for (const file of fs.readdirSync('.next/static/chunks').filter(f => f.endsWith('.css'))) await page.addStyleTag({ content: fs.readFileSync(path.join('.next/static/chunks',file),'utf8') })
  await page.addScriptTag({ content: script })
  return posts
}
for (const width of [375,430,768,1024,1280,1440]) for (const theme of ['light','dark']) test(`setup ${width} ${theme}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 })
  const errors = []; page.on('pageerror',e => errors.push(e.message))
  await mount(page, theme)
  await expect(page.getByRole('heading',{name:'Security Setup Checklist'})).toBeVisible()
  await expect(page.getByRole('button',{name:'Sign in with Google',exact:true})).toBeDisabled()
  await page.getByText('How to connect Google',{exact:true}).click()
  await page.getByText('Setup WhatsApp',{exact:true}).click()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
  expect(errors).toEqual([])
  if ([375,1440].includes(width)) await page.screenshot({ path: `docs/previews/integrations-${width}-${theme}.png`, fullPage: true })
})
test('test all requires click; no provider sends; restricted users see no diagnostics', async ({ page }) => {
  const posts = await mount(page,'light')
  await expect(page.getByRole('button',{name:'Test All Integrations'})).toBeVisible()
  expect(posts).toEqual([])
  await page.getByRole('button',{name:'Test All Integrations'}).click()
  await expect(page.getByText('OPENAI_NOT_CONFIGURED',{exact:true})).toBeVisible()
  expect(posts).toEqual([{provider:'all'}])
  await page.unroute('**/*'); await mount(page,'light',true)
  await expect(page.getByRole('alert')).toContainText('Only a Super Admin')
  await expect(page.getByRole('button',{name:'Test All Integrations'})).toHaveCount(0)
})
test('WhatsApp test needs an entered recipient, checkbox and confirmation dialog', async ({ page }) => {
  const posts=await mount(page,'light')
  await page.getByText('WhatsApp Diagnostics',{exact:true}).click()
  const send=page.getByRole('button',{name:'Send Confirmed Test Message'})
  await expect(send).toBeDisabled()
  await page.getByLabel('Test recipient (country code and digits)').fill('919876543210')
  await page.getByRole('checkbox').check()
  page.once('dialog',dialog=>dialog.dismiss())
  await send.click();expect(posts).toEqual([])
  page.once('dialog',dialog=>dialog.accept())
  await send.click();await expect.poll(()=>posts.length).toBe(1)
  expect(posts[0].recipient).toBe('919876543210');expect(posts[0].confirmed).toBe(true)
})
