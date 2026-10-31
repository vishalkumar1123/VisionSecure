const {test,expect}=require('@playwright/test')
test.use({launchOptions:{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-sandbox']}})
const base=process.env.SEO_TEST_BASE_URL||'http://localhost:3021'
test.beforeEach(async({page})=>{
 await page.addInitScript(()=>sessionStorage.setItem('leadPopupShown','true'))
 await page.route('**/*',r=>new URL(r.request().url()).origin===base&&r.request().method()==='GET'?r.continue():r.abort())
})
test('initial HTML prioritises one hero image; slide navigation and keyboard skip work',async({page,request})=>{
 const response=await request.get(base);const html=await response.text();const hero=html.match(/<section id="home"[\s\S]*?<\/section>/)[0]
 expect((hero.match(/<img /g)||[]).length).toBe(1);expect(hero).toContain('fetchPriority="high"')
 await page.goto(base);await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Skip to main content'})).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('#home')).toBeFocused()
 await page.locator('#home').getByRole('button',{name:'Go to slide 2',exact:true}).click();await expect(page.locator('#home [aria-hidden="false"] img')).toHaveAttribute('src',/Essl_Biom/)
})
for(const width of [390,1440])test(`new answers and contextual blog handoff at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900})
 await page.goto(base);await expect(page.getByRole('heading',{name:'Which service should I choose for my property?'})).toHaveCount(1)
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
 await page.goto(base+'/blog/networking-structured-cabling-and-server-setup-guide');await expect(page.getByRole('heading',{name:'What is the difference between a router and a switch?'})).toHaveCount(1)
 await page.getByRole('link',{name:'Discuss related requirements',exact:true}).click();await expect(page.locator('#contact-service')).toContainText('Networking Solutions')
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
})
test('Hindi and English restore across carousel mutations',async({page})=>{
 await page.goto(base)
 await page.getByRole('button',{name:'Choose language: English or Hindi'}).click();await page.getByRole('menuitem',{name:/[\u0900-\u097f]/}).click();await expect(page.locator('html')).toHaveAttribute('lang','hi')
 await page.locator('#home').getByRole('button',{name:'Go to slide 2',exact:true}).click();await expect(page.locator('#home h1')).toContainText(/[\u0900-\u097f]/)
 await page.getByRole('button',{name:'Choose language: English or Hindi'}).click();await page.getByRole('menuitem',{name:'English',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('lang','en');await expect(page.locator('#home h1')).toContainText('Security and networking')
})
