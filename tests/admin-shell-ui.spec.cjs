const {test,expect}=require('@playwright/test'),{buildSync}=require('esbuild'),fs=require('node:fs'),path=require('node:path');
test.use({launchOptions:{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-sandbox']},reducedMotion:'reduce'});
const aliases={'next/link':'next-link.tsx','next/navigation':'dashboard-navigation.ts','next-auth/react':'dashboard-session.ts','next/image':'dashboard-image.tsx'};
function script(kind){
 const component=kind==='Leads'?'components/admin/leads-grid':kind==='Settings'?'app/admin/settings/page':'components/admin/customer-center/inbox';
 const props=kind==='Leads'?'<Component leads={[]} refreshLeads={()=>{}}/>':kind==='Settings'?'await Component()':'<Component/>';
 return buildSync({stdin:{contents:`import React from 'react';import{createRoot}from'react-dom/client';import Layout from './app/admin/layout';import{ThemeProvider}from'./components/theme-provider';import Component from './${component}';async function mount(){const content=${props};createRoot(document.getElementById('root')).render(<ThemeProvider attribute="class" defaultTheme="light" storageKey="visionsecure-theme"><Layout>{content}</Layout></ThemeProvider>)}mount();`,loader:'tsx',resolveDir:process.cwd()},bundle:true,write:false,loader:{'.css':'empty'},platform:'browser',alias:{...Object.fromEntries(Object.entries(aliases).map(([k,v])=>[k,path.resolve('tests/fixtures',v)])),'next-auth':path.resolve('tests/fixtures/admin-server-session.ts'),'@/lib/auth':path.resolve('tests/fixtures/admin-auth-options.ts')},define:{'process.env.NODE_ENV':'"production"'},jsx:'automatic'}).outputFiles[0].text;
}
for(const kind of ['Leads','Settings','Customer Center'])for(const theme of ['light','dark'])for(const width of [390,768,1440])test(`${kind} shared shell ${width} ${theme}`,async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewportSize({width,height:1000});
 await page.route('**/*',r=>{const u=new URL(r.request().url());if(u.pathname.startsWith('/api/'))return r.fulfill({json:u.pathname.includes('notifications')?{items:[],unreadCount:0}:{items:[],total:0}});if(u.pathname.startsWith('/images/'))return r.fulfill({body:fs.readFileSync('public'+u.pathname),contentType:'image/png'});return r.fulfill({contentType:'text/html',body:'<html><body><div id="root"></div></body></html>'})});
 await page.goto('https://admin.test');await page.evaluate(t=>localStorage.setItem('visionsecure-theme',t),theme);
 const dir=process.env.ADMIN_TEST_CSS_DIR||'.next/static/chunks';for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.css')))await page.addStyleTag({content:fs.readFileSync(path.join(dir,f),'utf8')});await page.addStyleTag({content:fs.readFileSync('app/admin/admin-glass.css','utf8')});await page.addScriptTag({content:script(kind)});await expect(page.locator('.admin-shell')).toBeVisible();
 if(kind==='Settings')await expect(page.getByRole('heading',{name:'Admin Profile'})).toBeVisible();
 if(kind==='Leads')await expect(page.locator('.ag-root-wrapper')).toBeVisible();
 if(kind==='Customer Center')await expect(page.getByText('No conversations yet.',{exact:false})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);expect(errors).toEqual([]);
});


