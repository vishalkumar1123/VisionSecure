const { test, expect } = require("@playwright/test")
const { buildSync } = require("esbuild")
const fs = require("node:fs")
const path = require("node:path")
test.use({ launchOptions: { executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--no-sandbox"] } })
const bundle = buildSync({ stdin: { contents: 'import React from "react"; import {createRoot} from "react-dom/client"; import {EmailConfigurationPanel} from "./components/admin/email-configuration"; createRoot(document.getElementById("root")).render(<EmailConfigurationPanel />)', loader:"tsx", resolveDir:process.cwd() }, bundle:true, write:false, platform:"browser", alias:{"next/link":path.join(process.cwd(),"tests/fixtures/next-link.tsx")}, define:{ "process.env.NODE_ENV":'"production"' }, jsx:"automatic" }).outputFiles[0].text
async function mount(page, canManage=true, encryptionKeyConfigured=true) {
  let config=null, saved=null
  const health={ sentToday:0,pending:0,failed:0,failed24h:0,lastSuccessfulDelivery:null,lastFailedDelivery:null,encryptionKeyConfigured }
  await page.route("**/*", async route => {
    const url=new URL(route.request().url())
    if(url.pathname==="/api/admin/settings/email") {
      if(route.request().method()==="PUT") {
        saved=route.request().postDataJSON()
        const { username, password, freshCredentialConfirmed, ...normal }=saved
        config={ ...normal,revision:1,usernameConfigured:!!username,passwordConfigured:!!password,status:"SAVED_NOT_VERIFIED",isVerified:false }
        return route.fulfill({json:{config,health}})
      }
      return route.fulfill({json:{config,health,canManage}})
    }
    if(url.pathname.startsWith("/api/admin/settings/email/logs")) return route.fulfill({json:{items:[],pages:1}})
    if(url.pathname==="/") return route.fulfill({contentType:"text/html",body:'<!DOCTYPE html><html><head></head><body><div id="root"></div></body></html>'})
    return route.fulfill({status:404,body:""})
  })
  await page.goto("http://email-ui.test/")
  const cssRoot=path.join(process.cwd(),".next/static/chunks")
  if(fs.existsSync(cssRoot)) for(const file of fs.readdirSync(cssRoot).filter(name=>name.endsWith(".css"))) await page.addStyleTag({content:fs.readFileSync(path.join(cssRoot,file),"utf8")})
  await page.addScriptTag({content:bundle})
  await expect(page.getByRole("heading",{name:"Email Configuration",exact:true})).toBeVisible()
  return {getSaved:()=>saved}
}
test("super-admin can fill and save settings with visible confirmation and next step", async ({page})=>{
  const errors=[];page.on("pageerror",e=>errors.push(e.message))
  const fixture=await mount(page)
  await expect(page.getByRole("button",{name:"Save Configuration",exact:true})).toBeVisible()
  await expect(page.getByRole("button",{name:"Activate Notifications",exact:true})).toBeDisabled()
  await page.getByLabel("SMTP username",{exact:true}).fill("fixture-user")
  await page.getByLabel(/^New SMTP password/).fill("new-test-only-password")
  await page.getByRole("checkbox",{name:/I have changed/}).check()
  await page.getByRole("button",{name:"Save Configuration",exact:true}).click()
  await page.getByRole("button",{name:"Continue",exact:true}).click()
  await expect(page.getByText("Configuration saved securely as a draft.",{exact:false})).toBeVisible()
  await page.getByRole("button",{name:"OK",exact:true}).click()
  expect(fixture.getSaved().recipients).toEqual(["info@visionsecuretech.in","vishalkumar8303763@gmail.com"])
  await expect(page.getByLabel(/^New SMTP password/)).toHaveValue("")
  await expect(page.getByLabel("SMTP username",{exact:true})).toHaveValue("")
  await expect(page.getByRole("button",{name:"Test Connection",exact:true})).toBeEnabled()
  await expect(page.getByRole("button",{name:"Activate Notifications",exact:true})).toBeDisabled()
  await page.evaluate(()=>window.scrollTo(0,0))
  await page.screenshot({path:"test-results/email-settings-desktop.png",fullPage:false})
  expect(errors).toEqual([])
})
test("admin is read-only and mobile configuration fits the viewport",async({page})=>{
  await page.setViewportSize({width:390,height:844});await mount(page,false)
  await expect(page.getByRole("button",{name:"Save Configuration",exact:true})).toBeDisabled()
  await expect(page.getByLabel("SMTP username",{exact:true})).toBeDisabled()
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
  await page.screenshot({path:"test-results/email-settings-mobile.png",fullPage:false})
})

for (const width of [1280, 390]) test(`SMTP card has a working inline save at ${width}px`, async ({page}) => {
  await page.setViewportSize({width,height:844})
  const fixture=await mount(page)
  await expect(page.getByLabel("SMTP username",{exact:true})).toHaveValue("info@visionsecuretech.in")
  await page.getByLabel("Encryption mode").selectOption("STARTTLS")
  await page.getByLabel(/^New SMTP password/).fill("rotated-test-only-password")
  await page.getByRole("checkbox",{name:/I have changed/}).check()
  const save=page.getByRole("button",{name:"Save SMTP Configuration",exact:true})
  await save.scrollIntoViewIfNeeded()
  await expect(save).toBeInViewport()
  await expect(save).toBeEnabled()
  await page.screenshot({path:`test-results/email-smtp-save-${width}.png`})
  await save.click()
  await page.getByRole("button",{name:"Continue",exact:true}).click()
  await page.getByRole("button",{name:"OK",exact:true}).click()
  expect(fixture.getSaved()).toMatchObject({username:"info@visionsecuretech.in",fromEmail:"info@visionsecuretech.in",smtpPort:587,secure:false,requireTLS:true})
  await expect(page.getByLabel(/^New SMTP password/)).toHaveValue("")
})
test("inline save stays visible and explains missing server encryption setup", async ({page}) => {
  await mount(page,true,false)
  const save=page.getByRole("button",{name:"Save SMTP Configuration",exact:true})
  await save.scrollIntoViewIfNeeded()
  await expect(save).toBeInViewport()
  await expect(save).toBeDisabled()
  await expect(page.getByText("Saving is unavailable until the server operator configures EMAIL_CONFIG_ENCRYPTION_KEY.")).toBeVisible()
})
