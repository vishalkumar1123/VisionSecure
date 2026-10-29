const {test,expect}=require('@playwright/test')
test.use({launchOptions:{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-sandbox']}})
const base='http://localhost:3013'
test.beforeEach(async({page})=>{
 await page.addInitScript(()=>sessionStorage.setItem('leadPopupShown','true'))
 await page.route('**/*',route=>new URL(route.request().url()).origin===base&&route.request().method()==='GET'?route.continue():route.abort())
})
for(const width of [390,1440])test(`buyer guidance and links remain readable at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900})
 for(const [path,text] of [['/','Plan security and networking around your Lucknow property'],['/services/video-door-phone','doorbell installation is not automatically included'],['/services/speaker-solutions','not a certified emergency voice alarm'],['/services/glass-break-alarm-system','not interchangeable']]){
  await page.goto(base+path)
  const block=page.getByText(text,{exact:false}).last();await block.scrollIntoViewIfNeeded();await expect(block).toBeVisible()
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
  await expect.poll(()=>block.evaluate(el=>{let opacity=1;for(let n=el;n;n=n.parentElement)opacity*=Number(getComputedStyle(n).opacity);return opacity})).toBe(1)
  await page.screenshot({animations:"disabled",path:`test-results/customer-keyword-${width}-${path.split('/').pop()||'home'}.png`})
 }
 await page.goto(base+'/services/home-automation');await page.locator('a[href^="/contact?service="]').first().click();await expect(page.locator('#contact-service')).toContainText('Home Automation')
})
