const { test, expect } = require("@playwright/test")
const { buildSync } = require("esbuild")
const fs = require("node:fs")
const path = require("node:path")
test.use({ launchOptions: { executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--no-sandbox"] } })
const bundle = buildSync({ stdin: { contents: 'import React from "react"; import {createRoot} from "react-dom/client"; import DashboardPage from "./app/admin/dashboard/page"; createRoot(document.getElementById("root")).render(<DashboardPage />)', loader:"tsx", resolveDir:process.cwd() }, bundle:true, write:false, platform:"browser", alias:{"next/link":path.join(process.cwd(),"tests/fixtures/next-link.tsx")}, define:{ "process.env.NODE_ENV":'"production"' }, jsx:"automatic" }).outputFiles[0].text

const fixture={totalLeads:12,activeLeads:8,newLeads:3,discussionLeads:1,followUpLeads:2,quotationLeads:1,installationLeads:1,convertedLeads:3,closedLeads:1,todayLeads:2,conversionRate:25,current30Days:8,previous30Days:4,leadTrendPercentage:100,dailyTrend:[{date:"2026-09-17",label:"17 Sep",total:8}],latestLeads:Array.from({length:5},(_,i)=>({_id:String(i),name:`Customer ${i+1}`,phone:"9999999999",service:"CCTV",status:"New",createdAt:"2026-09-17T10:00:00Z"})),userSummary:{total:4,active:3,inactive:1,roles:[{_id:"admin",total:1},{_id:"sales_executive",total:3}]},recentActivity:[{_id:"activity1",action:"LEAD_CREATED",status:"success",resourceType:"Lead",createdAt:"2026-09-17T10:00:00Z",userId:{name:"Test Admin"}}],serviceStats:[{_id:"CCTV",total:12}]}
async function mount(page,data){
 await page.route("**/*",route=>route.fulfill(new URL(route.request().url()).pathname==="/api/analytics"?{json:data}:{contentType:"text/html",body:'<html><body><div id="root"></div></body></html>'}))
 await page.goto("http://dashboard.test")
 const cssRoot=path.join(process.cwd(),".next/static/chunks")
 for(const file of fs.readdirSync(cssRoot).filter(name=>name.endsWith(".css"))) await page.addStyleTag({content:fs.readFileSync(path.join(cssRoot,file),"utf8")})
 await page.addScriptTag({content:bundle})
 await expect(page.getByRole("heading",{name:"Admin dashboard",exact:true})).toBeVisible()
}
for(const width of [1440,390]) test(`dashboard shows live-data sections at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:1000})
 const errors=[];page.on("pageerror",e=>errors.push(e.message))
 await mount(page,fixture)
 await expect(page.locator("tbody tr")).toHaveCount(5)
 await expect(page.getByRole("heading",{name:"Recent activity",exact:true})).toBeVisible()
 await expect(page.getByText("Test Admin",{exact:false})).toBeVisible()
 await expect(page.getByRole("heading",{name:"User management",exact:true})).toBeVisible()
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
 await page.screenshot({path:`test-results/dashboard-${width}.png`,fullPage:true})
 expect(errors).toEqual([])
})
test("dashboard empty states are helpful",async({page})=>{
 await mount(page,{...fixture,latestLeads:[],recentActivity:[],serviceStats:[]})
 await expect(page.getByText("No leads yet.",{exact:false})).toBeVisible()
 await expect(page.getByText("No activity recorded yet.")).toBeVisible()
})
