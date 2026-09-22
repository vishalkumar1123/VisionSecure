const fs = require("node:fs"), vm = require("node:vm"), ts = require("typescript"), assert = require("node:assert/strict")
const mod = { exports: {} }
vm.runInNewContext(ts.transpileModule(fs.readFileSync("lib/follow-up-time.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: mod.exports, module: mod, Date })
const { followUpISO, istFields } = mod.exports
assert.equal(followUpISO("2030-09-21", "15:30"), "2030-09-21T10:00:00.000Z")
assert.equal(followUpISO("2030-09-21", "00:15"), "2030-09-20T18:45:00.000Z")
assert.equal(istFields("2030-09-20T18:45:00.000Z").date, "2030-09-21")
assert.equal(istFields("2030-09-20T18:45:00.000Z").time, "00:15")
for (const [d, t] of [["2030-02-30", "10:00"], ["2030-09-21", "24:00"], ["2030-09-21", ""], ["", "09:00"]]) assert.throws(() => followUpISO(d,t))
console.log("PASS IST scheduling: UTC conversion, midnight boundary, date validation and required time")
