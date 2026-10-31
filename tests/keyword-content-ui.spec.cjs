const {test,expect}=require('@playwright/test')
test.use({launchOptions:{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-sandbox']}})
const base=process.env.SEO_TEST_BASE_URL||'http://localhost:3013'
test.beforeEach(async({page})=>{
 await page.addInitScript(()=>sessionStorage.setItem('leadPopupShown','true'))
 await page.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort())
})
test('four visible buyer guides retain contextual service handoff',async({page})=>{
 for(const [slug,title] of [['cctv-surveillance','CCTV Surveillance'],['biometric-attendance','Biometric Attendance'],['networking-solutions','Networking Solutions'],['it-support-amc','IT Support & AMC']]){
  await page.goto(base+'/services/'+slug)
  const guide=page.locator('section[aria-labelledby="buyer-guide-heading"]')
  await guide.scrollIntoViewIfNeeded();await expect(guide.getByRole('heading',{level:3})).toHaveCount(3)
  await expect(guide).toBeVisible();await guide.getByRole('link').click()
  await expect(page.locator('#contact-service')).toContainText(title)
 }
})
test('mobile informational cabling article exposes service links and networking enquiry',async({page})=>{
 await page.setViewportSize({width:375,height:812})
 await page.goto(base+'/blog/networking-structured-cabling-and-server-setup-guide')
 const section=page.locator('section[aria-labelledby="cabling-enquiry-heading"]')
 await section.scrollIntoViewIfNeeded();await expect(section.getByRole('heading',{level:2})).toBeVisible()
 await expect(section.locator('a[href="/services/networking-solutions"]')).toBeVisible()
 await expect(section.locator('a[href="/services/server-networking-infrastructure"]')).toBeVisible()
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(375)
 await section.locator('a[href^="/contact?service="]').click();await expect(page.locator('#contact-service')).toContainText('Networking Solutions')
})
