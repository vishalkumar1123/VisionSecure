const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const vm = require("node:vm")
const ts = require("typescript")

function load(file, mocks = {}) {
  const source = ts.transpileModule(fs.readFileSync(path.resolve(file), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText
  const loadedModule = { exports: {} }
  const localRequire = (name) => {
    if (Object.hasOwn(mocks, name)) return mocks[name]
    if (name.startsWith("@/")) {
      const base = name.slice(2)
      return load(fs.existsSync(base + ".ts") ? base + ".ts" : base + "/index.ts", mocks)
    }
    return require(name)
  }
  vm.runInThisContext(`(function(require,module,exports){${source}\n})`, { filename: file })(localRequire, loadedModule, loadedModule.exports)
  return loadedModule.exports
}

async function main(){
 const {businessDay,greeting}=load("lib/dashboard-time.ts")
 assert.equal(businessDay(new Date("2026-09-17T18:29:59Z")).key,"2026-09-17")
 assert.equal(businessDay(new Date("2026-09-17T18:30:00Z")).key,"2026-09-18")
 assert.equal(businessDay(new Date("2026-12-31T18:30:00Z")).key,"2027-01-01")
 for(const [hour,label] of [[4,"Good Night"],[5,"Good Morning"],[11,"Good Morning"],[12,"Good Afternoon"],[17,"Good Evening"],[21,"Good Night"]])assert.equal(greeting(hour),label)
 const {NextResponse}=require("next/server")
 let denied=401, failUsers=false, projections=[]
 const query=(rows)=>({sort(){return this},limit(n){assert([5,20].includes(n));return this},select(fields){projections.push(fields);return this},populate(field,fields){assert.equal(fields,"name");return this},lean:async()=>rows})
 const mock={
 "@/lib/admin-auth":{requireAdmin:async()=>denied?{response:NextResponse.json({error:"denied"},{status:denied})}:{user:{name:"Test Admin"}}},
 "@/models/Lead":{__esModule:true,default:{aggregate:async pipeline=>pipeline[0].$facet?[{pipeline:[{_id:"New",total:2},{_id:"Converted",total:1}],services:[{_id:"CCTV",total:3}],today:[{total:1}],yesterday:[],due:[],overdue:[],attention:[{total:2}]}]:[],find:()=>query([])}},
 "@/models/User":{__esModule:true,default:{aggregate:async()=>{if(failUsers)throw Error("private database details");return [{_id:{role:"admin",active:true},total:2}]}}},
 "@/models/ActivityLog":{__esModule:true,default:{find:()=>query([])}},
 }
 const {GET}=load("app/api/admin/dashboard/route.ts",mock)
 const request=(range="30")=>new Request(`http://localhost/api/admin/dashboard?days=${range}`)
 assert.equal((await GET(request())).status,401);denied=403;assert.equal((await GET(request())).status,403);denied=0
 assert.equal((await GET(request("999"))).status,400)
 const response=await GET(request());const data=await response.json();assert.equal(data.metrics.total,3);assert.equal(data.metrics.converted,1);assert.equal(data.metrics.conversionRate,33.3);assert.equal(data.trend.rows.length,30);assert.equal(data.trend.change,null);assert.equal(data.users.active,2);assert.equal(response.headers.get("cache-control"),"private, no-store")
 assert(projections.every(value=>!value.includes("password")&&!value.includes("changes")&&!value.includes("errorMessage")))
 failUsers=true;const partial=await (await GET(request("7"))).json();assert.equal(partial.users,null);assert.equal(partial.metrics.total,3);assert.deepEqual(partial.errors,["users"]);assert(!JSON.stringify(partial).includes("private database"));assert.equal(partial.trend.rows.length,7)
 let captured
 const leadMock={...mock,
 "@/lib/mongodb":{connectDB:async()=>{}},
 "@/notification/services/notification.service":{NotificationService:{}},
 "@/notification/services/activity-log.service":{NotificationActivityLogService:{}},
 "@/notification/utils/rate-limit":{allowRateLimitedRequest:()=>true},
 "@/models/Lead":{__esModule:true,default:{find:(query)=>{captured=query;return {sort:async()=>[]}}}},
 }
 const leadsRoute=load("app/api/leads/route.ts",leadMock)
 await leadsRoute.GET(new Request("http://localhost/api/leads?filter=overdue&q=%2E%2A"))
 assert(captured.followUpDate.$lt instanceof Date);assert.equal(captured.followUpDate.$ne,null)
 assert(captured.status.$nin.includes("Converted"));assert.equal(captured.$or[0].name.$regex,"\\.\\*")
 await leadsRoute.GET(new Request("http://localhost/api/leads?filter=won"));assert.deepEqual(captured.status.$in,["Converted","Installed Successfully"])
 console.log("PASS dashboard authorization, projections, partial failures, totals, zero baseline, range validation, India midnight/year boundaries and greeting transitions. No database or email writes.")
}
main().catch(e=>{console.error(e);process.exitCode=1})
