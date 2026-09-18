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
 const {NextResponse}=require("next/server");let denied=401,broken=false,facet
 const {businessDay}=load("lib/dashboard-time.ts");const key=businessDay().key
 const query={sort(){return this},limit(){return this},select(fields){assert(!fields.includes("password"));return this},populate(){return this},lean:async()=>[]}
 const mocks={"@/lib/admin-auth":{requireAdmin:async()=>denied?{response:NextResponse.json({error:"denied"},{status:denied})}:{}},"@/models/Lead":{__esModule:true,default:{find:()=>query,aggregate:async pipeline=>{if(broken)throw Error("private database error");facet=pipeline[0].$facet;return [{status:[{_id:"Converted",total:1},{_id:"New",total:3}],services:[],sources:[],daily:[{_id:key,total:2}],monthly:[{_id:key.slice(0,7),total:2}]}]}}}}
 const {GET}=load("app/api/analytics/route.ts",mocks)
 assert.equal((await GET()).status,401);denied=403;assert.equal((await GET()).status,403);denied=0
 const response=await GET(),data=await response.json();assert.equal(data.totalLeads,4);assert.equal(data.conversionRate,25);assert.equal(data.todayLeads,2);assert.equal(data.monthlyLeads.length,12);assert.equal(new Set(data.monthlyLeads.map(row=>row.date)).size,12);assert(data.monthlyLeads.every(row=>row.month&&row._id.year));assert.equal(data.monthlyLeads[11].date,key.slice(0,7));assert.equal(data.growthPercentage,null);assert.equal(data.leadTrendPercentage,null);assert.equal(data.dailyTrend.length,30);assert.equal(facet.monthly[1].$group._id.$dateToString.timezone,"Asia/Kolkata");assert.equal(response.headers.get("cache-control"),"private, no-store")
 broken=true;const failure=await GET();assert.equal(failure.status,500);assert(!(await failure.text()).includes("private database"))
 console.log("PASS analytics authorization, monthly year labels, zero baseline, timezone, conversion, sanitized errors and no-store response.")
}
main().catch(e=>{console.error(e);process.exitCode=1})
