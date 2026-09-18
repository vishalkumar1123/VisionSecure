const {test,expect}=require("@playwright/test")
const {buildSync}=require("esbuild"),fs=require("node:fs"),path=require("node:path")
test.use({launchOptions:{executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",args:["--no-sandbox"]},reducedMotion:"reduce"})
const bundle=buildSync({stdin:{contents:'import React from "react";import{createRoot}from"react-dom/client";import AnalyticsPage from"./app/admin/analytics/page";createRoot(document.getElementById("root")).render(<AnalyticsPage/>);',loader:"tsx",resolveDir:process.cwd()},bundle:true,write:false,platform:"browser",alias:{"next/link":path.resolve("tests/fixtures/next-link.tsx")},define:{"process.env.NODE_ENV":'"production"'},jsx:"automatic"}).outputFiles[0].text
const fixture={success:true,totalLeads:4,todayLeads:1,activeLeads:3,convertedLeads:1,closedLeads:0,conversionRate:25,thisMonthLeads:4,lastMonthLeads:0,growthPercentage:null,latestLeads:[],monthlyLeads:[{date:"2026-09",month:"Sep 26",total:4}],serviceStats:[{_id:"CCTV",total:4}],sourceStats:[{_id:"Website",total:4}],statusStats:[{name:"New",total:3},{name:"Won / installed",total:1}],dailyTrend:[{date:"2026-09-18",label:"18 Sep",total:4}],current30Days:4,previous30Days:0,leadTrendPercentage:null,updatedAt:"2026-09-18T12:00:00Z"}
async function mount(page,handler,theme="light"){
 await page.route("**/*",route=>new URL(route.request().url()).pathname==="/api/analytics"?handler(route):route.fulfill({contentType:"text/html",body:`<html class="${theme}"><body><div id="root" style="padding:12px"></div></body></html>`}))
 await page.goto("http://analytics.test")
 for(const name of fs.readdirSync(".next/static/chunks").filter(x=>x.endsWith(".css")))await page.addStyleTag({content:fs.readFileSync(path.join(".next/static/chunks",name),"utf8")})
 await page.addScriptTag({content:bundle})
}
for(const [width,theme] of [[375,"light"],[375,"dark"],[1440,"light"],[1440,"dark"]])test(`analytics ${width} ${theme}`,async({page})=>{
 await page.setViewportSize({width,height:950});await mount(page,route=>route.fulfill({json:fixture}),theme)
 await expect(page.getByRole("heading",{name:"Analytics Dashboard"})).toBeVisible();await expect(page.getByRole("heading",{name:"Monthly lead growth"})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
 await page.screenshot({path:`test-results/analytics-${width}-${theme}.png`,fullPage:true})
})
test("centered loader and failed request offer recovery",async({page})=>{
 let release;const held=new Promise(resolve=>release=resolve);let first=true
 await mount(page,async route=>{if(first){first=false;await held;return route.fulfill({status:500,json:{error:"failed"}})}return route.fulfill({json:fixture})})
 const loader=page.getByRole("status");await expect(loader).toBeVisible();await expect(page.getByRole("heading",{name:"Loading Analytics"})).toBeVisible();const box=await page.getByRole("heading",{name:"Loading Analytics"}).boundingBox();expect(Math.abs(box.x+box.width/2-page.viewportSize().width/2)).toBeLessThan(20)
 release();await expect(page.getByRole("alert")).toBeVisible();await page.getByRole("button",{name:"Retry analytics"}).click();await expect(page.getByRole("heading",{name:"Monthly lead growth"})).toBeVisible()
})
