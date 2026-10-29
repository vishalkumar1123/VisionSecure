const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')
function load(file, mocks = {}) {
 const source = ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true,resolveJsonModule:true}}).outputText
 const loadedModule = {exports:{}}
 vm.runInThisContext(`(function(require,module,exports){${source}\n})`,{filename:file})(name => {
  if (Object.hasOwn(mocks,name)) return mocks[name]
  if(name.startsWith('@/')) return load(name.slice(2)+'.ts',mocks)
  return require(name)
 },loadedModule,loadedModule.exports)
 return loadedModule.exports
}
async function main(){
 let allowed=true, duplicate=false, created=[], failLog=false
 const {NextResponse}=require('next/server')
 const mocks={
 '@/lib/mongodb':{connectDB:async()=>{}},
 '@/models/Lead':{__esModule:true,default:{findOne:async()=>duplicate?{}:null,create:async value=>{created.push(value);return {...value,get:key=>value[key],_id:{toString:()=> 'mock-id'}}}}},
 '@/notification/services/notification.service':{NotificationService:{notifyNewLead:async()=>{throw Error('mock provider unavailable')}}},
 '@/notification/services/activity-log.service':{NotificationActivityLogService:{record:async()=>{if(failLog)throw Error('mock log unavailable')}}},
 '@/notification/utils/rate-limit':{allowRateLimitedRequest:()=>allowed},
 '@/lib/admin-auth':{requireAdmin:async()=>({response:NextResponse.json({error:'Unauthorized'},{status:401})})},
 '@/lib/dashboard-time':{businessDay:()=>({}),CLOSED_STATUSES:[]}
 }
 const {POST,GET}=load('app/api/leads/route.ts',mocks)
 const input={name:'Test fixture',phone:'9876543210',service:'CCTV Surveillance',address:'Fixture House, Road, Lucknow 226001'}
 const request=data=>new Request('http://localhost/api/leads',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)})
 const original=console.error;console.error=()=>{}
 let result=await POST(request(input));assert.equal(result.status,200);assert.equal((await result.json()).success,true);assert.equal(created[0].address,input.address);assert.equal(created[0].status,'New')
 failLog=true;result=await POST(request({...input,address:undefined,email:''}));assert.equal(result.status,200);assert.equal(created[1].address,'')
 for(const changes of [{phone:'1234567890'},{email:'invalid'},{address:'x'.repeat(601)},{address:'short'},{name:'x'}]) assert.equal((await POST(request({...input,...changes}))).status,400)
 duplicate=true;assert.equal((await POST(request(input))).status,409);duplicate=false
 allowed=false;assert.equal((await POST(request(input))).status,429)
 assert.equal((await GET(new Request('http://localhost/api/leads'))).status,401)
 console.error=original
 const tracking=load('lib/public-tracking.ts');let events=[]
 global.window={location:{pathname:'/contact',origin:'http://localhost',search:'?email=private'},gtag:(...args)=>events.push(args)}
 tracking.trackPublicEvent('enquiry_saved','contact');assert.equal(events.length,1);assert(!JSON.stringify(events).includes('private'))
 window.location.pathname='/admin/leads';tracking.trackPublicEvent('enquiry_saved','contact');assert.equal(events.length,1)
 window.location.pathname='/contact';window.gtag=()=>{throw Error('analytics blocked')};assert.doesNotThrow(()=>tracking.trackPublicEvent('enquiry_saved','contact'));delete global.window
 const {services}=load('lib/services.ts');const enquiry=load('lib/enquiry-services.ts',{'./services':{services}})
 for(const service of services){assert.equal(enquiry.resolveEnquiryService(service.title),service.title);assert.equal(enquiry.resolveEnquiryService(service.slug),service.title)}
 assert.equal(enquiry.resolveEnquiryService('unknown'),'');assert.equal(enquiry.resolveEnquiryService('AMC / Maintenance'),'IT Support & AMC')
 const pages=require('../lib/seo-pages.json');const blogs=load('lib/blogs.ts').blogPosts
 const sitemap=load('app/sitemap.ts',{'@/lib/seo-pages.json':{__esModule:true,default:pages},'@/lib/blogs':{blogPosts:blogs},'@/lib/seo':{SITE_ORIGIN:'https://visionsecuretech.in'}}).default()
 assert.equal(sitemap.length,pages.length+blogs.length);assert.equal(new Set(sitemap.map(x=>x.url)).size,sitemap.length);assert(sitemap.every(x=>!x.lastModified&&!/admin|api\/|profile|register/.test(x.url)))
 console.log(`PASS: saved full address, optional email, legacy default, validation, duplicate/rate limits, provider isolation, auth, tracking privacy/failure isolation, all ${services.length} service handoffs, ${sitemap.length} sitemap URLs.`)
}
main().catch(error=>{console.error(error);process.exitCode=1})
