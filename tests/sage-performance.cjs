const {chromium}=require('@playwright/test')
const fs=require('node:fs')
const before=process.argv[2]||'http://localhost:3020',after=process.argv[3]||'http://localhost:3021'
if(![before,after].every(u=>/^http:\/\/localhost:\d+$/.test(u)))throw Error('Local isolated origins only')
;(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-sandbox']})
 const results=[]
 for(const device of ['mobile','desktop'])for(let run=1;run<=3;run++)for(const [stage,base] of [['before',before],['after',after]]){
  const mobile=device==='mobile'
  const context=await browser.newContext({viewport:{width:mobile?390:1440,height:mobile?844:900},deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile,locale:'en-IN'})
  const page=await context.newPage()
  await page.route('**/*',r=>new URL(r.request().url()).origin===base&&r.request().method()==='GET'?r.continue():r.abort())
  const cdp=await context.newCDPSession(page);await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true})
  await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:mobile?150:40,downloadThroughput:(mobile?1.6:10)*1024*1024/8,uploadThroughput:750*1024/8})
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:mobile?4:1})
  await page.addInitScript(()=>{window.__lab={lcp:[],shifts:[],longTasks:[]};for(const [type,key] of [['largest-contentful-paint','lcp'],['layout-shift','shifts'],['longtask','longTasks']])new PerformanceObserver(list=>{for(const e of list.getEntries())window.__lab[key].push({time:e.startTime,duration:e.duration,value:e.value||0,recentInput:e.hadRecentInput||false,element:e.element?.tagName||'',id:e.element?.id||''})}).observe({type,buffered:true})})
  await page.goto(base,{waitUntil:'load',timeout:90000});await page.waitForTimeout(5500)
  const metrics=await page.evaluate(()=>{const lab=window.__lab;const r=performance.getEntriesByType('resource');const fcp=performance.getEntriesByName('first-contentful-paint')[0];return {fcpMs:fcp?.startTime??null,lcpMs:lab.lcp.at(-1)?.time??null,lcpCandidates:lab.lcp,cls:lab.shifts.filter(s=>!s.recentInput).reduce((a,e)=>a+e.value,0),observedLongTaskBlockingMs:lab.longTasks.reduce((a,e)=>a+Math.max(0,e.duration-50),0),observedUntilMs:performance.now(),resourceTransferBytes:r.reduce((a,e)=>a+e.transferSize,0),imageRequests:r.filter(e=>e.initiatorType==='img').length,overflow:document.documentElement.scrollWidth>innerWidth,popupVisible:!!document.querySelector('[role="dialog"]')}})
  results.push({stage,device,run,...metrics});console.log(stage,device,run,JSON.stringify(metrics))
  if(run===1)await page.screenshot({path:`docs/seo/screenshots/sage-${stage}-${device}.png`})
  await context.close()
 }
 await browser.close()
 const median=v=>v.slice().sort((a,b)=>a-b)[Math.floor(v.length/2)]
 const summary=[];for(const device of ['mobile','desktop'])for(const stage of ['before','after']){const rows=results.filter(r=>r.device===device&&r.stage===stage);summary.push({stage,device,...Object.fromEntries(['fcpMs','lcpMs','cls','observedLongTaskBlockingMs','resourceTransferBytes','imageRequests'].map(k=>[k,median(rows.map(r=>r[k]))]))})}
 fs.writeFileSync('docs/seo/sage-performance-comparison.json',JSON.stringify({method:'Local Chromium lab, 3 fresh contexts per variant/device, interleaved before/after, external requests and non-GETs blocked, same webpack compiler and dummy configuration. Not Lighthouse scores, not field data.',popup:'Normal original 4-second popup; no leadPopupShown suppression',network:{mobile:{latencyMs:150,mbps:1.6,cpu:4},desktop:{latencyMs:40,mbps:10,cpu:1}},summary,results},null,2))
})().catch(e=>{console.error(e);process.exitCode=1})
