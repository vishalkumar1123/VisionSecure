const assert = require('node:assert/strict')
const fs = require('node:fs'), vm = require('node:vm'), ts = require('typescript'), mongoose = require('mongoose')
function load(file, mocks = {}) {
 const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText
 const loadedModule = {exports:{}}
 vm.runInThisContext(`(function(require,module,exports){${source}\n})`, {filename:file})(name => {
  if (Object.hasOwn(mocks,name)) return mocks[name]
  if (name.startsWith('@/')) return load(name.slice(2)+'.ts',mocks)
  return require(name)
 },loadedModule,loadedModule.exports)
 return loadedModule.exports
}
async function main() {
 const cached = mongoose.model('Lead', new mongoose.Schema({name:String,phone:String,status:String,assignedTo:mongoose.Schema.Types.ObjectId,locality:String,budget:String,followUpDate:Date,notes:[{text:String}],timeline:[{action:String}]}))
 const doc = new cached({name:'Fixture Customer',phone:'9876543210',status:'Follow-Up',locality:'Legacy area',budget:'Legacy range',followUpDate:new Date('2027-01-01T04:30:00Z')})
 doc.set('address','House 8, Fixture Road, Lucknow')
 assert.equal(doc.get('address'),undefined, 'Reproduce the old cached strict-schema data loss')
 const Lead = load('models/Lead.ts').default
 assert.equal(Lead,cached, 'Keep existing model references')
 assert(Lead.schema.path('address')); assert(Lead.schema.path('followUpReminderFor'))
 let stored = doc.toObject(), denied = false, saves = 0
 doc.save = async () => { await doc.validate(); stored=doc.toObject(); saves++; return doc }
 const {NextResponse} = require('next/server')
 const query = {then:resolve=>Promise.resolve(doc).then(resolve),lean:async()=>({...stored})}
 const route = load('app/api/leads/[id]/route.ts', {
  '@/lib/admin-auth':{requireAdmin:async()=>denied?{response:NextResponse.json({error:'denied'},{status:401})}:{user:{id:'fixture-admin',name:'Fixture'}}},
  '@/models/User':{__esModule:true,default:{exists:async q=>q._id==='bbbbbbbbbbbbbbbbbbbbbbbb'&&q.role==='technician'&&q.isActive===true}},
  '@/lib/mongodb':{connectDB:async()=>{}}, '@/models/Lead':{__esModule:true,default:{findById:()=>query}},
  '@/services/activity-log-service':{ActivityLogService:{log:async()=>{}}}
 })
 const context={params:Promise.resolve({id:String(doc._id)})}
 const request=body=>new Request('https://fixture.test/api/leads/'+doc._id,{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify(body)})
 const result=await route.PATCH(request({address:'  House 8, Fixture Road, Lucknow  '}),context)
 assert.equal(result.status,200);assert.equal((await result.json()).lead.address,'House 8, Fixture Road, Lucknow')
 const fresh=await route.GET(new Request('https://fixture.test/api/leads/'+doc._id),context)
 assert.equal(fresh.headers.get('cache-control'),'private, no-store')
 assert.equal((await fresh.json()).lead.address,'House 8, Fixture Road, Lucknow')
 assert.equal(stored.locality,'Legacy area');assert.equal(stored.budget,'Legacy range');assert.equal(stored.status,'Follow-Up');assert.equal(stored.followUpDate.toISOString(),'2027-01-01T04:30:00.000Z')
 for(const address of ['short','x'.repeat(601),null,42])assert.equal((await route.PATCH(request({address}),context)).status,400)
 assert.equal(saves,1);denied=true;assert.equal((await route.PATCH(request({address:'House 20, Fixture Road, Lucknow'}),context)).status,401);assert.equal(saves,1)
 denied=false;assert.equal((await route.PATCH(request({assignedTo:'invalid'}),context)).status,400);assert.equal((await route.PATCH(request({assignedTo:'cccccccccccccccccccccccc'}),context)).status,400);assert.equal((await route.PATCH(request({assignedTo:'bbbbbbbbbbbbbbbbbbbbbbbb'}),context)).status,200);assert.equal(String(stored.assignedTo),'bbbbbbbbbbbbbbbbbbbbbbbb');assert.equal(stored.address,'House 8, Fixture Road, Lucknow');
 assert.equal(load('models/Lead.ts').default,Lead,'Repeated reload remains safe')
 mongoose.deleteModel('Lead')
 console.log('PASS cached-model address regression, trimmed save, fresh readback, validation, administrator authorization and legacy/status/date preservation; no database connection.')
}
main().catch(error=>{console.error(error);process.exitCode=1})
