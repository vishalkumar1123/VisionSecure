const { test, expect } = require("@playwright/test")
const { buildSync } = require("esbuild")
const fs = require("node:fs"), path = require("node:path")
test.use({ launchOptions: { executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--no-sandbox"] }, timezoneId:"Asia/Kolkata", reducedMotion:"reduce" })
const bundle=buildSync({stdin:{contents:'import React from "react";import {createRoot} from "react-dom/client";import DashboardPage from "./app/admin/dashboard/page";import Layout from "./app/admin/layout";import {ThemeProvider} from "./components/theme-provider";createRoot(document.getElementById("root")).render(<ThemeProvider attribute="class" defaultTheme="light" storageKey="visionsecure-theme"><Layout><DashboardPage/></Layout></ThemeProvider>);',loader:"tsx",resolveDir:process.cwd()},bundle:true,write:false,platform:"browser",alias:{"next/link":path.resolve("tests/fixtures/next-link.tsx"),"next/navigation":path.resolve("tests/fixtures/dashboard-navigation.ts"),"next-auth/react":path.resolve("tests/fixtures/dashboard-session.ts"),"next/image":path.resolve("tests/fixtures/dashboard-image.tsx")},define:{"process.env.NODE_ENV":'"production"'},jsx:"automatic"}).outputFiles[0].text
const lead={_id:"aabbcc",name:"Fixture Customer",phone:"9999999999",service:"CCTV",source:"Website",status:"New",createdAt:"2026-09-17T10:00:00Z",followUpDate:"2026-09-18T10:00:00Z",assignedTo:{name:"Fixture Sales"}}
const fixture={displayName:"Test Admin",updatedAt:"2026-09-18T05:00:00Z",timezone:"Asia/Kolkata",days:30,errors:[],metrics:{total:12,converted:3,active:8,today:2,yesterday:0,due:1,overdue:2,attention:5,new:3,quotations:1,installations:1,conversionRate:25,pipeline:[{_id:"New",total:3}],services:[{_id:"CCTV",total:12}]},leads:Array.from({length:5},(_,i)=>({...lead,_id:String(i),name:`Customer ${i+1}`})),schedule:[lead],trend:{rows:[{date:"2026-09-18",label:"18 Sep",total:8}],current:8,previous:0,change:null},users:{total:4,active:3,roles:[{role:"admin",total:1},{role:"sales_executive",total:3}]},activity:[{_id:"a1",action:"LEAD_CREATED",status:"success",resourceType:"Lead",resourceId:"aabbcc",createdAt:"2026-09-18T05:00:00Z",userId:{name:"Fixture Actor"}}]}
async function mount(page,data=fixture,theme="light"){
 await page.route("**/*",route=>{const url=new URL(route.request().url());if(url.pathname==="/api/admin/dashboard")return route.fulfill({json:data});if(url.pathname==="/api/admin/notifications")return route.fulfill({json:{items:[],unreadCount:0}});if(["/images/Visionsecuretech_logo.png","/images/logo.png"].includes(url.pathname))return route.fulfill({contentType:"image/png",body:fs.readFileSync("public"+url.pathname)});return route.fulfill({contentType:"text/html",body:'<html><body><div id="root"></div></body></html>'})})
 await page.goto("http://dashboard.test");await page.evaluate(value=>localStorage.setItem("visionsecure-theme",value),theme)
 for(const file of fs.readdirSync(".next/static/chunks").filter(name=>name.endsWith(".css")))await page.addStyleTag({content:fs.readFileSync(path.join(".next/static/chunks",file),"utf8")})
 await page.addScriptTag({content:bundle});await expect(page.getByRole("heading",{name:/Test Admin/})).toBeVisible()
 for(const title of ["Lead pipeline","5 recent leads","Recent activity"]){
  const section=page.locator("details").filter({has:page.getByRole("heading",{name:title,exact:true})})
  await expect(section).not.toHaveAttribute("open","")
  await section.locator("summary").click()
  await expect(section).toHaveAttribute("open","")
 }
 await expect(page.getByRole("button",{name:"Refresh dashboard",exact:true})).toHaveText("")
 await expect(page.getByRole("link",{name:"Add New Lead",exact:true})).toHaveText("")
}
for(const width of [320,375,430,768,1024,1280,1440,1920])for(const theme of ["light","dark"])test(`${theme} dashboard at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:1000});const errors=[];page.on("pageerror",e=>errors.push(e.message));await mount(page,fixture,theme)
 await expect(page.locator("html")).toHaveClass(new RegExp(theme));await expect(page.getByRole("heading",{name:"5 recent leads"})).toBeVisible();await expect(page.getByRole("heading",{name:"Recent activity"})).toBeVisible();await expect(page.getByText("Fixture Actor",{exact:false})).toBeVisible()
 await expect(page.locator("tbody tr")).toHaveCount(5);expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
 await page.getByRole("button",{name:"Notifications",exact:true}).click();await expect(page.getByRole("dialog",{name:"Notifications",exact:true})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);await page.getByRole("button",{name:"Close notifications"}).click();
 if(width<1024){await page.getByRole("button",{name:"Open admin navigation"}).click();await expect(page.getByRole("dialog",{name:"Admin navigation"})).toBeVisible();await page.keyboard.press("Escape");await expect(page.getByRole("dialog",{name:"Admin navigation"})).not.toBeVisible()}
 await page.evaluate(()=>window.scrollTo(0,0));
 if(width===1440||width===375)await page.screenshot({path:`test-results/dashboard-${width}-${theme}.png`,fullPage:true})
 await page.getByRole("button",{name:`Switch to ${theme==="light"?"dark":"light"} mode`}).click();expect(await page.evaluate(()=>localStorage.getItem("visionsecure-theme"))).toBe(theme==="light"?"dark":"light")
 expect(errors).toEqual([])
})
test("clock crosses greeting boundary and midnight without refresh",async({page})=>{
 await page.clock.install({time:new Date("2026-09-18T11:59:50+05:30")});await page.clock.pauseAt(new Date("2026-09-18T11:59:59+05:30"));await mount(page);await expect(page.getByRole("heading",{name:"Good Morning, Test Admin"})).toBeVisible();await page.clock.fastForward(2000);await expect(page.getByRole("heading",{name:"Good Afternoon, Test Admin"})).toBeVisible();await page.clock.setSystemTime(new Date("2026-09-18T23:59:59+05:30"));await page.clock.fastForward(2000);await expect(page.getByRole("heading",{name:"Good Night, Test Admin"})).toBeVisible();await expect(page.getByText(/Sat.*19.*Sep.*2026/)).toBeVisible()
})
test("partial failure preserves healthy widgets; empty states and filters",async({page})=>{
 await mount(page,{...fixture,trend:null,leads:[],schedule:[],activity:[],errors:["trend"]});await expect(page.getByText("Unable to load lead trend.",{exact:false})).toBeVisible();await expect(page.getByText("No leads yet.",{exact:false})).toBeVisible();await expect(page.getByText("No activity recorded yet.")).toBeVisible();await expect(page.getByRole("link",{name:/Overdue follow-ups/})).toHaveAttribute("href","/admin/leads?filter=overdue");await page.keyboard.press("Control+k");await expect(page.getByRole("textbox",{name:"Search leads"})).toBeFocused();await page.getByRole("textbox",{name:"Search leads"}).fill("CCTV");await page.getByRole("button",{name:"Submit lead search"}).click();expect(page.url()).toContain("/admin/leads?q=CCTV")
})

test("compact clock uses shield, foreground hands and 24-hour time", async ({page})=>{
 await page.emulateMedia({reducedMotion:"no-preference"})
 await page.clock.install({time:new Date("2026-09-18T19:35:00+05:30")})
 await mount(page)
 const clock=page.getByTestId("dashboard-clock")
 await expect(clock.getByRole("img")).toHaveAttribute("aria-label",/19:35:/)
 await expect(clock.locator("image")).toHaveAttribute("href","/images/logo.png")
 expect(await page.getByTestId("clock-second-hand").evaluate(node=>node.getAnimations().length)).toBeGreaterThan(0)
 await clock.screenshot({path:"test-results/clock-refined.png"})
})
