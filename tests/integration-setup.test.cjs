const assert = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm'), ts = require('typescript')
function load(file, mocks = {}) {
  const m = { exports: {} }
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, { module:m,exports:m.exports,require:n=>n==='server-only'?{}:n in mocks?mocks[n]:require(n),process,URL,Date,Buffer,AbortSignal,console },{filename:file})
  return m.exports
}
const urls = load('lib/app-url.ts')
for (const name of ['AUTH_URL','NEXTAUTH_URL','NEXT_PUBLIC_APP_URL','NEXT_PUBLIC_SITE_URL']) delete process.env[name]
assert.throws(urls.appUrl)
process.env.AUTH_URL='http://localhost:3000'
assert.equal(urls.appUrl()+'/api/admin/integrations/google/callback','http://localhost:3000/api/admin/integrations/google/callback')
process.env.NEXT_PUBLIC_SITE_URL='https://visionsecuretech.in'
assert.deepEqual(Array.from(urls.appUrlConflicts()),['NEXT_PUBLIC_SITE_URL'])
process.env.AUTH_URL='https://visionsecuretech.in'
assert.equal(urls.appUrl()+'/api/admin/integrations/google/callback','https://visionsecuretech.in/api/admin/integrations/google/callback')
for (const url of ['https://user:pass@example.com','http://example.com','https://example.com/path','https://example.com/?redirect=evil']) { process.env.AUTH_URL=url; assert.throws(urls.appUrl) }
process.env.AUTH_URL='https://visionsecuretech.in'
const { NextResponse }=require('next/server')
class CenterError extends Error { constructor(code,status=503){super(code);this.code=code;this.status=status} }
class APIError extends Error {constructor(status,code){super('DO-NOT-EXPOSE-PROVIDER-SECRET');this.status=status;this.code=code}}
let input, failure, mode='DRAFT', calls=0, writes=[], audits=[]
const health=load('lib/integrations/health.ts',{
  mongoose:{connection:{db:{admin:()=>({ping:async()=>{}})}}},
  openai:{__esModule:true,default:{APIError}},nodemailer:{createTransport:()=>{throw new Error('unexpected')}} ,
  '@/models/IntegrationHealth':{__esModule:true,default:{updateOne:async(filter,change)=>writes.push({filter,change})}},
  '@/models/GoogleIntegration':{__esModule:true,default:{}},'@/models/EmailConfiguration':{__esModule:true,default:{}},
  '@/models/CustomerCenter':{AIAgentSettings:{updateOne:async(_f,c)=>{assert(!('mode' in c.$set));assert(!('enabled' in c.$set))}}},
  '@/lib/app-url':urls,'@/lib/google/oauth':{},'@/lib/customer-center/security':{CenterError},
  '@/lib/customer-center/agent':{aiClient:()=>({responses:{create:async body=>{calls++;input=body;if(failure)throw failure;return{status:'completed',output_text:'OK'}}}})},
  '@/lib/customer-center/events':{centerAudit:async event=>audits.push(event)},'@/lib/channels/whatsapp':{},'@/lib/email-config/transport':{},
})
async function main(){
  process.env.OPENAI_MODEL='fixture-model';process.env.OPENAI_API_KEY='fixture-only'
  const pass=await health.testIntegration('ai','admin')
  assert.equal(pass.status,'Passed');assert.equal(input.model,'fixture-model');assert.equal(input.store,false);assert.equal(input.input,'Reply with OK.');assert.equal(input.max_output_tokens,32);assert.equal(mode,'DRAFT')
  const first=health.configurationFingerprint('ai');process.env.OPENAI_MODEL='changed-model';assert.notEqual(first,health.configurationFingerprint('ai'))
  failure=new APIError(429,'credit_balance_exhausted')
  const fail=await health.testIntegration('ai','admin');assert.equal(fail.status,'Failed');assert.equal(fail.error,'OPENAI_BILLING_CREDITS_REQUIRED')
  assert(!JSON.stringify({fail,writes,audits}).includes('DO-NOT-EXPOSE'));assert(!JSON.stringify({fail,writes,audits}).includes('fixture-only'))
  failure=new CenterError('OPENAI_NOT_CONFIGURED');assert.equal((await health.testIntegration('ai','admin')).status,'Warning')
  let user=null, run=[]
  const api=load('app/api/admin/integrations/health/route.ts',{
    'next/server':{NextResponse},'@/lib/admin-auth':{requireAdmin:async()=>({user,response:user?null:NextResponse.json({error:'Unauthorized'},{status:401})})},
    '@/lib/google/security':{appOrigin:()=>urls.appUrl()},'@/lib/customer-center/security':{CenterError,limitRequest:async()=>{},boundedBody:async r=>r.text()},
    '@/lib/integrations/health':{providers:['google','ai','meta','email','database'],integrationSummary:async()=>({safe:true}),testIntegration:async p=>{run.push(p);return{status:'Passed'}}},
  })
  const request=(method='GET',origin=urls.appUrl(),body={provider:'all'})=>new Request(urls.appUrl()+'/api/admin/integrations/health',{method,headers:{origin},...(method==='POST'?{body:JSON.stringify(body)}:{})})
  assert.equal((await api.GET(request())).status,401)
  user={id:'admin',role:'admin'};assert.equal((await api.GET(request())).status,403);assert.equal((await api.POST(request('POST'))).status,403)
  user.role='super_admin';assert.equal((await api.POST(request('POST','https://evil.example'))).status,403);assert.equal(run.length,0)
  assert.equal((await api.GET(request())).status,200);assert.equal(run.length,0)
  assert.equal((await api.POST(request('POST'))).status,200);assert.deepEqual(run,['google','ai','meta','email','database'])
  assert.equal((await api.POST(request('POST',urls.appUrl(),{provider:'send'}))).status,400)
  let sends=0, conversation=null
  const outbound=load('app/api/admin/integrations/meta/test-send/route.ts',{
    'next/server':{NextResponse},'@/lib/admin-auth':{requireAdmin:async()=>({user,response:null})},
    '@/lib/google/security':{appOrigin:()=>urls.appUrl()},'@/models/CustomerCenter':{Conversation:{findOne:filter=>{assert.equal(filter.mode,'HUMAN_ACTIVE');assert.equal(filter.assignedTo,'admin');assert.equal(filter.channel,'WHATSAPP');return{lean:async()=>conversation}}}},
    '@/lib/customer-center/dispatch':{sendReply:async value=>{sends++;assert.equal(value.sender,'ADMIN');assert.equal(value.actorId,'admin');return{status:'sent'}}},
    '@/lib/customer-center/security':{CenterError,limitRequest:async()=>{},boundedBody:async r=>r.text()},'@/lib/customer-center/events':{centerAudit:async()=>{}},
  })
  const payload={recipient:'919876543210',confirmed:true,key:'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'}
  user.role='admin';assert.equal((await outbound.POST(request('POST',urls.appUrl(),payload))).status,403)
  user.role='super_admin';assert.equal((await outbound.POST(request('POST','https://evil.example',payload))).status,403)
  assert.equal((await outbound.POST(request('POST',urls.appUrl(),{...payload,confirmed:false}))).status,400)
  assert.equal((await outbound.POST(request('POST',urls.appUrl(),payload))).status,409);assert.equal(sends,0)
  conversation={_id:'test-conversation',version:3};assert.equal((await outbound.POST(request('POST',urls.appUrl(),payload))).status,200);assert.equal(sends,1)
  console.log('PASS integration setup: configured origins, URL conflicts, tiny no-customer-data AI test, sanitized billing/errors, unchanged AI mode, configuration invalidation, Super Admin RBAC, CSRF and safe test-all allowlist.')
}
main().catch(e=>{console.error(e);process.exitCode=1})
