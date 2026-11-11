const {test,expect}=require('@playwright/test')
const fs=require('node:fs')
test.use({launchOptions:{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-sandbox']}})
const base=process.env.HYDRATION_TEST_BASE||'http://localhost:3000'
function hydration(message){return /hydrat|server rendered HTML|didn't match|Minified React error #(418|425)/i.test(message)}
for(const width of [390,1440])test(`navbar hydrates without injected offsets at ${width}px`,async({page})=>{
 const errors=[]
 page.on('console',message=>{if(message.type()==='error'&&hydration(message.text()))errors.push(message.text())})
 page.on('pageerror',error=>errors.push(error.message))
 await page.addInitScript(()=>sessionStorage.setItem('leadPopupShown','true'))
 await page.route('**/*',r=>new URL(r.request().url()).origin===base&&r.request().method()==='GET'?r.continue():r.abort())
 await page.setViewportSize({width,height:900})
 await page.goto(base,{waitUntil:'networkidle'})
 const header=page.locator('header').first()
 await expect(header).toBeVisible()
 await expect(header).not.toHaveAttribute('style',/top/)
 await expect(page.getByRole('button',{name:'Choose language: English or Hindi'})).toBeVisible()
 if(width===390){await page.getByRole('button',{name:'Open menu',exact:true}).click();await expect(page.getByRole('button',{name:'Close menu',exact:true})).toBeVisible();await page.keyboard.press('Escape')}
 expect(errors).toEqual([])
})
test('external pre-hydration header offset reproduces the reported warning',async({page})=>{
 const errors=[]
 page.on('console',message=>{if(message.type()==='error'&&hydration(message.text()))errors.push(message.text())})
 let release
 const scriptsHeld=new Promise(resolve=>{release=resolve})
 await page.addInitScript(()=>sessionStorage.setItem('leadPopupShown','true'))
 await page.route('**/*',async r=>{
  if(new URL(r.request().url()).origin!==base||r.request().method()!=='GET')return r.abort()
  if(r.request().resourceType()==='script')await scriptsHeld
  return r.continue()
 })
 await page.goto(base,{waitUntil:'commit'})
 const header=page.locator('header').first()
 await header.waitFor({state:'attached'})
 await header.evaluate(el=>{el.style.top='40px'})
 release()
 await page.waitForLoadState('networkidle')
 await expect.poll(()=>errors.length).toBeGreaterThan(0)
 expect(errors.join('\n')).toContain('40px')
 fs.writeFileSync('docs/seo/navbar-hydration-reproduction.json',JSON.stringify({base,controlledInjection:true,warning:errors},null,2))
})