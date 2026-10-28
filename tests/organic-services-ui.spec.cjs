const {test,expect}=require('@playwright/test')
test.use({launchOptions:{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-sandbox']}})
const base='http://localhost:3013'
test.beforeEach(async({page})=>{
 await page.addInitScript(()=>sessionStorage.setItem('leadPopupShown','true'))
 await page.route('**/*',route=>new URL(route.request().url()).origin===base&&route.request().method()==='GET'?route.continue():route.abort())
})
test('desktop service FAQs expand and existing Contact handoff remains intact without submitting',async({page})=>{
 for(const [slug,title] of [['access-control-system','Access Control System'],['wifi-mesh-networking','WiFi & Mesh Networking'],['emergency-alarm-system','Emergency Alarm System']]){
  await page.goto(base+'/services/'+slug);await expect(page.getByRole('heading',{level:1})).toHaveCount(1)
  const faq=page.locator('details').first();await faq.scrollIntoViewIfNeeded();await faq.locator('summary').click();await expect(faq.locator('p')).toBeVisible()
  await page.locator('a[href^="/contact?service="]').first().click();await expect(page.locator('#contact-service')).toContainText(title)
  await expect(page.locator('#contact-email')).not.toHaveAttribute('required','');await expect(page.locator('#contact-locality')).toBeAttached()
 }
})
test('mobile PA FAQ has clear safety scope and no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:375,height:812});await page.goto(base+'/services/speaker-solutions')
 const faq=page.locator('details').filter({hasText:'compliant emergency voice system'});await faq.scrollIntoViewIfNeeded();await faq.locator('summary').click();await expect(faq.locator('p')).toContainText('must not be assumed')
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(375)
 await page.screenshot({path:'test-results/organic-pa-mobile.png',animations:'disabled'})
 await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/services/server-networking-infrastructure');await page.locator('details').first().scrollIntoViewIfNeeded();await page.screenshot({path:'test-results/organic-server-desktop.png',animations:'disabled'})
})
