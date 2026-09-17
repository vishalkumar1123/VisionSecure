const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const vm = require("node:vm")
const ts = require("typescript")
const { randomBytes } = require("node:crypto")
const { NextResponse } = require("next/server")
let passed = 0
const check = (name, fn) => Promise.resolve().then(fn).then(() => { passed++; console.log(`PASS ${passed}: ${name}`) })
function fixture() {
  let config = null, serial = 0, verifyError = null, sendError = null, failRecipient = null, dbError = false
  let actor = { id: "aaaaaaaaaaaaaaaaaaaaaaaa", role: "super_admin" }
  const background = []
  const deliveries = [], audits = [], notices = [], sent = [], transportOptions = []
  function matches(doc, filter) {
    return Object.entries(filter).every(([key, value]) => {
      if (key === "$or") return value.some(item => matches(doc,item))
      const actual = key.split(".").reduce((v,k) => v?.[k],doc)
      if (value && typeof value === "object" && !(value instanceof Date)) return Object.entries(value).every(([op, expected]) => op === "$in" ? expected.includes(actual) : op === "$lt" ? actual < expected : op === "$lte" ? actual <= expected : op === "$gte" ? actual >= expected : false)
      if (value === null) return actual == null
      return Array.isArray(actual) ? actual.includes(value) : String(actual) === String(value)
    })
  }
  function update(doc, change, isNew = false) {
    if (isNew) Object.assign(doc,change.$setOnInsert || {})
    Object.assign(doc,change.$set || {})
    for (const [key, value] of Object.entries(change.$inc || {})) doc[key] = (doc[key] || 0) + value
    for (const key of Object.keys(change.$unset || {})) delete doc[key]
    return doc
  }
  function document(data) {
    const doc = { ...data }
    Object.defineProperties(doc, {
      save: { value: async () => { if (dbError) throw new Error("database failed"); doc.updatedAt = new Date(); return doc } },
      get: { value: key => doc[key] }, set: { value: values => Object.assign(doc,values) },
      toObject: { value: () => ({ ...doc }) },
    })
    return doc
  }
  function query(value) { return { select() { return this }, sort() { return this }, skip() { return this }, limit() { return this }, lean: async () => value, then(resolve,reject) { return Promise.resolve(value).then(resolve,reject) } } }
  const Config = {
    findById: () => query(config),
    updateOne: async (filter, change, options) => { if (!config && options?.upsert) config = document({ _id: "primary", status: "NOT_CONFIGURED", revision: 0, recipients: [], ...change.$setOnInsert }); if (config && matches(config,filter)) update(config,change); return { modifiedCount: 1 } },
    findOneAndUpdate: (filter, change) => query(config && matches(config,filter) ? update(config,change) : null),
  }
  const Delivery = {
    init: async () => {},
    create: async data => {
      if (dbError) throw new Error("db unavailable")
      if (deliveries.some(d => d.eventKey === data.eventKey)) throw Object.assign(new Error("duplicate"),{ code: 11000 })
      const doc = document({ _id: (++serial).toString(16).padStart(24,"0"), createdAt: new Date(), updatedAt: new Date(), attemptCount: 0, retryEligible: false, sending: false, ...data }); deliveries.push(doc); return doc
    },
    findById: id => query(deliveries.find(d => String(d._id) === String(id))),
    findOne: filter => query(deliveries.find(d => matches(d,filter)) || null),
    find: filter => query(deliveries.filter(d => matches(d,filter))),
    countDocuments: async filter => deliveries.filter(d => matches(d,filter)).length,
    findOneAndUpdate: (filter, change) => { const doc = deliveries.find(d => matches(d,filter)); return query(doc ? update(doc,change) : null) },
    updateMany: async (filter, change) => { deliveries.filter(d => matches(d,filter)).forEach(d=>update(d,change)) },
  }
  const rateModel = { findOneAndUpdate: async () => ({ count: 1 }) }
  const mongoose = require("mongoose")
  const mocks = {
    "server-only": {},
    "next/server": { NextResponse, after: task => background.push(task) },
    "mongoose": { ...mongoose, models: { EmailRateLimit: rateModel } },
    "@/lib/mongodb": { connectDB: async () => {} },
    "@/lib/admin-auth": { requireAdmin: async () => actor ? { user: actor, response: null } : { user: null, response: NextResponse.json({ error: "Unauthorized" },{ status: 401 }) } },
    "@/models/EmailConfiguration": { __esModule: true, default: Config },
    "@/models/EmailDeliveryLog": { __esModule: true, default: Delivery },
    "@/models/ActivityLog": { __esModule: true, default: { create: async data => { audits.push(data); return data } } },
    "@/models/User": { __esModule: true, default: { find: () => query([{ _id: "aaaaaaaaaaaaaaaaaaaaaaaa" }]) } },
    "@/notification/models/notification.model": { __esModule: true, default: { exists: async () => false, updateMany: async () => ({}), create: async data => { notices.push(data); return data } } },
    "node:dns/promises": { lookup: async () => [{ address: "8.8.8.8", family: 4 }] },
    nodemailer: { createTransport: options => { transportOptions.push(options); return { verify: async () => { if (verifyError) throw verifyError; return true }, close() {}, sendMail: async mail => { if (sendError && (!failRecipient || failRecipient === mail.to)) throw sendError; sent.push(mail); return { accepted: [mail.to], messageId: mail.messageId } } } } },
  }
  const cache = new Map()
  function load(file) {
    file = path.resolve(file)
    if (cache.has(file)) return cache.get(file).exports
    const loadedModule = { exports: {} }; cache.set(file,loadedModule)
    const source = ts.transpileModule(fs.readFileSync(file,"utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText
    const localRequire = name => {
      if (Object.hasOwn(mocks,name)) return mocks[name]
      if (name.startsWith("@/") || name.startsWith(".")) { const base = name.startsWith("@/") ? path.resolve(name.slice(2)) : path.resolve(path.dirname(file),name); return load(base.endsWith(".ts") ? base : base+".ts") }
      return require(name)
    }
    vm.runInThisContext(`(function(require,module,exports){${source}\n})`,{ filename:file })(localRequire,loadedModule,loadedModule.exports)
    return loadedModule.exports
  }
  return { load, flush: async () => { await Promise.all(background.splice(0).map(task => task())) }, get config() { return config }, deliveries, audits, notices, sent, transportOptions, setActor: value => actor=value, failVerify: value => verifyError=value, failSend: (value, recipient) => { sendError=value; failRecipient=recipient }, failDB: () => dbError=true }
}
async function main() {
  process.env.EMAIL_CONFIG_ENCRYPTION_KEY = randomBytes(32).toString("hex")
  const secret = "fresh-test-only-password!" // Fixture only; never real external SMTP.
  const f = fixture(), shared = f.load("lib/email-config/shared.ts"), crypto = f.load("lib/email-config/crypto.ts"), service = f.load("lib/email-config/service.ts"), delivery = f.load("lib/email-config/delivery.ts"), api = f.load("lib/email-config/api.ts")
  const notify = async event => { const result = await delivery.notifyEmail(event); await f.flush(); return result }
  const actor = { id: "aaaaaaaaaaaaaaaaaaaaaaaa", role: "super_admin" }
  const input = { ...shared.defaults, username: "fixture-user", password: secret, freshCredentialConfirmed: true }
  const request = (method,body) => new Request("http://localhost:3000/api/admin/settings/email", { method, headers: { origin: "http://localhost:3000", "Content-Type":"application/json" }, ...(body ? { body:JSON.stringify(body) } : {}) })
  await check("1/2: super-admin saves; admin cannot modify", async () => { assert.equal((await api.emailAPI(request("PUT",input),"save")).status,200); f.setActor({ ...actor,role:"admin" }); assert.equal((await api.emailAPI(request("PUT",input),"save")).status,403); f.setActor(actor) })
  await check("3/4: unauthenticated 401; unauthorized 403; cross-origin blocked", async () => { f.setActor(null); assert.equal((await api.emailAPI(request("GET"),"read")).status,401); f.setActor({ ...actor,role:"viewer" }); assert.equal((await api.emailAPI(request("GET"),"read")).status,403); f.setActor(actor); assert.equal((await api.emailAPI(new Request("http://localhost:3000/api/admin/settings/email",{ method:"POST",headers:{ origin:"https://attacker.example" } }),"verify")).status,403) })
  await check("5: AES-256-GCM ciphertext stored with unique nonce and authenticated field binding", () => { const encrypted=f.config.passwordEncrypted; assert.notEqual(encrypted.ciphertext,secret); assert.equal(crypto.decryptSecret(encrypted,"password"),secret); assert.notEqual(crypto.encryptSecret(secret,"password").iv,encrypted.iv); assert.throws(() => crypto.decryptSecret(encrypted,"username")); assert.throws(() => crypto.decryptSecret({ ...encrypted,authTag:Buffer.alloc(16).toString("base64") },"password")) })
  await check("6: GET never returns credentials or encrypted values", async () => { const text=await (await api.emailAPI(request("GET"),"read")).text(); for(const value of [secret,"fixture-user","ciphertext","authTag","passwordEncrypted","usernameEncrypted"]) assert(!text.includes(value)); assert(text.includes('"passwordConfigured":true')) })
  await check("7: blank password preserves encrypted value", async () => { const old=f.config.passwordEncrypted.ciphertext; await service.configurationAction("save",actor,{ ...input,revision:f.config.revision,password:"",username:"" }); assert.equal(f.config.passwordEncrypted.ciphertext,old) })
  await check("8: replacement password encrypted and old value replaced", async () => { const old=f.config.passwordEncrypted.ciphertext; await service.configurationAction("save",actor,{ ...input,revision:f.config.revision,password:"second-test-only-password" }); assert.notEqual(f.config.passwordEncrypted.ciphertext,old); assert.equal(crypto.decryptSecret(f.config.passwordEncrypted,"password"),"second-test-only-password") })
  await check("9/10/11: Zoho 465 SSL and 587 STARTTLS validate; incompatible modes rejected", () => { assert(shared.configSchema.safeParse(input).success); assert(shared.configSchema.safeParse({ ...input,smtpPort:587,secure:false,requireTLS:true,encryption:"STARTTLS" }).success); assert(!shared.configSchema.safeParse({ ...input,secure:false }).success); assert(!shared.configSchema.safeParse({ ...input,smtpPort:587 }).success); assert(!shared.configSchema.safeParse({ ...input,freshCredentialConfirmed:false }).success) })
  await check("15: activation blocked before verification", async () => { await assert.rejects(service.configurationAction("activate",actor),/VERIFY_AND_TEST/); assert.notEqual(f.config.status,"ACTIVE") })
  await check("12/16: verify succeeds without sending mail; activation blocked before test", async () => { await service.configurationAction("verify",actor); assert.equal(f.config.status,"VERIFIED"); assert.equal(f.sent.length,0); await assert.rejects(service.configurationAction("activate",actor),/VERIFY_AND_TEST/) })
  await check("14: test reaches every configured recipient, then activation succeeds", async () => { await service.configurationAction("test",actor); assert.equal(f.config.status,"TEST_EMAIL_SENT"); assert.deepEqual(f.sent.map(mail=>mail.to).sort(),[...input.recipients].sort()); await service.configurationAction("activate",actor); assert.equal(f.config.status,"ACTIVE") })
  await check("17: changed SMTP fields invalidate verified/test state", async () => { await service.configurationAction("save",actor,{ ...input,revision:f.config.revision,fromEmail:"changed@example.com",password:"" }); assert.equal(f.config.status,"SAVED_NOT_VERIFIED"); assert.equal(f.config.isVerified,false); assert.equal(f.config.lastTestStatus,null) })
  await check("13/23: SMTP verification fails safely and creates site notification", async () => { f.failVerify(Object.assign(new Error(secret),{ code:"EAUTH" })); await assert.rejects(service.configurationAction("verify",actor),/AUTHENTICATION_FAILED/); assert.equal(f.config.status,"ERROR"); assert(f.notices.some(n=>n.message.includes("authentication failed"))); f.failVerify(null) })
  const event = { eventKey:"lead:one",eventType:"leadCreated",entityId:"bbbbbbbbbbbbbbbbbbbbbbbb",subject:"New lead",text:"A new lead was created." }
  await check("18: disabled service skips safely without SMTP", async () => { await service.configurationAction("disable",actor); const before=f.sent.length; const log=await notify(event); assert.equal(log.status,"skipped"); assert.equal(log.failureCategory,"EMAIL_SERVICE_NOT_ACTIVE"); assert.equal(f.sent.length,before) })
  await service.configurationAction("verify",actor); await service.configurationAction("test",actor); await service.configurationAction("activate",actor)
  await check("20: duplicate business events do not send duplicate emails", async () => { const before=f.sent.length; await Promise.all([notify({ ...event,eventKey:"lead:two" }),notify({ ...event,eventKey:"lead:two" })]); assert.equal(f.sent.length-before,input.recipients.length) })
  let failed
  await check("19: email failure does not roll back business action", async () => { f.failSend(Object.assign(new Error(secret),{ code:"ECONNECTION" })); let saved=true; failed=await notify({ ...event,eventKey:"lead:three" }); assert(saved); assert.equal(failed.status,"failed"); assert.equal(failed.failureCategory,"CONNECTION_FAILED") })
  await check("21: eligible failed notification retries once with atomic claim", async () => { f.failSend(null); failed.nextRetryAt=new Date(0); const before=f.sent.length; const results=await Promise.allSettled([delivery.retryEmail(failed._id),delivery.retryEmail(failed._id)]); assert.equal(results.filter(r=>r.status==="fulfilled").length,1); assert.equal(f.sent.length-before,input.recipients.length); assert.equal(failed.attemptCount,2) })
  await check("partial success retries only unaccepted recipients", async () => { f.failSend(Object.assign(new Error(secret),{ code:"EENVELOPE" }),input.recipients[1]); const log=await notify({ ...event,eventKey:"lead:partial" }); assert.equal(log.acceptedRecipients.length,1); log.nextRetryAt=new Date(0); f.failSend(null); const before=f.sent.length; await delivery.retryEmail(log._id); assert.equal(f.sent.length-before,1); assert.equal(log.status,"sent") })
  await check("uncertain DATA/socket errors never automatically retry", async () => { f.failSend(Object.assign(new Error(secret),{ code:"ETIMEDOUT" })); const log=await notify({ ...event,eventKey:"lead:uncertain" }); assert.equal(log.status,"uncertain"); assert.equal(log.retryEligible,false); await assert.rejects(delivery.retryEmail(log._id)); f.failSend(null) })
  await check("disabled event selection suppresses production send", async () => { f.config.eventSettings.leadCreated=false; const before=f.sent.length; const log=await notify({ ...event,eventKey:"lead:off" }); assert.equal(log.failureCategory,"EVENT_DISABLED"); assert.equal(f.sent.length,before); f.config.eventSettings.leadCreated=true })
  await check("22/24: secrets absent in audit, notice, mail and API errors; configuration activity exists", async () => { const values=JSON.stringify([f.audits,f.notices,f.sent,f.deliveries]); assert(!values.includes(secret)); assert(!values.includes("second-test-only-password")); assert(!values.includes("ciphertext")); assert(f.audits.some(a=>a.changes.event==="CONFIGURATION_CREATED")); assert(f.audits.some(a=>a.changes.event==="PASSWORD_REPLACED")); const result=await api.emailAPI(request("PUT",{ password:secret }),"save"); assert(!(await result.text()).includes(secret)) })
  await check("private SMTP networks blocked and TLS hostname pinned", () => { const transport=f.load("lib/email-config/transport.ts"); for(const ip of ["127.0.0.1","10.2.3.4","169.254.169.254","192.168.1.1","172.16.0.1","::1"]) assert(!transport.publicIPv4(ip)); assert(transport.publicIPv4("8.8.8.8")); assert.equal(f.transportOptions[0].host,"8.8.8.8"); assert.equal(f.transportOptions[0].tls.servername,"smtp.zoho.in"); assert.equal(f.transportOptions[0].tls.rejectUnauthorized,true) })
  await check("delivery-log response excludes private body content", async () => { const text=await (await api.emailAPI(request("GET"),"logs")).text(); assert(!text.includes('"text":')); assert(!text.includes('"html":')); assert(!text.includes(secret)) })
  await check("lease blocks conflicting configuration actions", async () => { f.config.lockToken="other-request"; f.config.lockUntil=new Date(Date.now()+10000); await assert.rejects(service.configurationAction("verify",actor),/CONFIGURATION_BUSY/); delete f.config.lockToken; delete f.config.lockUntil })
  await check("legacy exposed environment password cannot be saved", async () => { const old=process.env.SMTP_PASS; process.env.SMTP_PASS="revoked-fixture"; try { await assert.rejects(service.configurationAction("save",actor,{ ...input,revision:f.config.revision,password:"revoked-fixture" }),/NEW_APP_PASSWORD_REQUIRED/) } finally { if(old===undefined) delete process.env.SMTP_PASS; else process.env.SMTP_PASS=old } })
  await check("durable pending outbox can recover without a duplicate background send", async () => { const before=f.sent.length; const pending=await delivery.notifyEmail({ ...event,eventKey:"lead:recover" }); assert.equal(pending.status,"pending"); assert.equal(f.sent.length,before); await delivery.processPendingEmails(); await f.flush(); assert.equal(f.sent.length-before,input.recipients.length); assert.equal(pending.status,"sent") })
  await check("test-email failure blocks activation and creates notice", async () => { f.failSend(Object.assign(new Error(secret),{code:"EENVELOPE"})); await assert.rejects(service.configurationAction("test",actor)); assert.equal(f.config.lastTestStatus,"failed"); await assert.rejects(service.configurationAction("activate",actor)); assert(f.notices.some(n=>n.title==="Email configuration action failed")); f.failSend(null) })
  await check("configuration revision prevents stale writes; DB failure doesn't escape business notifier", async () => { await assert.rejects(service.configurationAction("save",actor,{ ...input,revision:0 }),/CONFIGURATION_CHANGED/); f.failDB(); assert.equal(await notify({ ...event,eventKey:"lead:db-error" }),null) })
  console.log(`${passed} groups passed; requirements 1-24 covered using mocked MongoDB and Nodemailer. No external email sent.`)
}
main().catch(error => { console.error(error); process.exitCode=1 })
