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

async function main() {
  const { changePasswordSchema } = load("lib/validation-auth.ts")
  const body = { currentPassword: "Current!123", newPassword: "Updated!123", confirmPassword: "Updated!123" }
  assert(changePasswordSchema.safeParse(body).success)
  assert(!changePasswordSchema.safeParse({ ...body, confirmPassword: "Other!123" }).success)
  assert(!changePasswordSchema.safeParse({ ...body, newPassword: body.currentPassword, confirmPassword: body.currentPassword }).success)
  assert(!changePasswordSchema.safeParse({ ...body, newPassword: "weak", confirmPassword: "weak" }).success)
  const long = "A!1" + "x".repeat(70)
  assert(!changePasswordSchema.safeParse({ ...body, newPassword: long, confirmPassword: long }).success)
  let token = { sub: "123456789012345678901234", role: "admin" }
  let valid = true, allowed = true, writes = 0, logs = 0, active = true, queried
  const mocks = {
    "next-auth/jwt": { getToken: async () => token },
    "@/lib/session-security": { isSessionTokenActive: (value) => !!value },
    "@/lib/mongodb": { connectDB: async () => {} },
    "@/models/User": { default: { findById: () => ({ select: async () => ({ password: "mock-hash", isActive: active }) }) }, __esModule: true },
    "@/services/auth-service": { AuthService: { validatePassword: async () => valid } },
    "@/services/user-service": { UserService: { resetUserPassword: async () => { writes++ } } },
    "@/services/activity-log-service": { ActivityLogService: { log: async (event) => { assert(!JSON.stringify(event).includes(body.newPassword)); logs++ }, getLogs: async (filters) => { queried = filters; return { data: [], total: 0, page: filters.page, pages: 0 } } } },
    "@/middleware/rbac": { getUserInfoFromRequest: () => ({}) },
    "@/notification/utils/rate-limit": { allowRateLimitedRequest: () => allowed },
  }
  const { POST } = load("app/api/auth/change-password/route.ts", mocks)
  const request = (value = body, origin = "http://localhost:3000") => ({ headers: new Headers({ origin }), nextUrl: new URL("http://localhost:3000/api/auth/change-password"), json: async () => value })
  let response = await POST(request())
  assert.equal(response.status, 200); assert.equal(writes, 1); assert.equal(logs, 1)
  valid = false; response = await POST(request()); assert.equal(response.status, 400); assert((await response.json()).errors.currentPassword)
  token = null; response = await POST(request()); assert.equal(response.status, 401); assert((await response.json()).error)
  token = { sub: "123456789012345678901234", role: "admin" }
  assert.equal((await POST(request(body, "https://other.invalid"))).status, 403)
  allowed = false; assert.equal((await POST(request())).status, 429); allowed = true
  assert.equal((await POST(request({}))).status, 400)
  active = false; assert.equal((await POST(request())).status, 403)
  assert.equal(writes, 1); assert.equal(logs, 1)
  const { GET } = load("app/api/activity-logs/route.ts", mocks)
  const query = (suffix = "") => ({ nextUrl: new URL("http://localhost:3000/api/activity-logs" + suffix) })
  assert.equal((await GET(query("?limit=999"))).status, 400)
  assert.equal((await GET(query("?page=-1"))).status, 400)
  assert.equal((await GET(query("?startDate=invalid"))).status, 400)
  assert.equal((await GET(query("?startDate=2026-09-17&endDate=2026-09-16"))).status, 400)
  assert.equal((await GET(query())).status, 200); assert.equal(queried.userId, undefined)
  token.role = "viewer"; assert.equal((await GET(query("?userId=aaaaaaaaaaaaaaaaaaaaaaaa"))).status, 200); assert.equal(queried.userId, token.sub)
  token.role = "technician"; assert.equal((await GET(query())).status, 403)
  token = null; assert.equal((await GET(query())).status, 401)
  const { adminResetPasswordSchema } = load("lib/validation-auth.ts")
  const resetBody = { newPassword: "Reset!1234", confirmPassword: "Reset!1234" }
  assert(adminResetPasswordSchema.safeParse(resetBody).success)
  assert(!adminResetPasswordSchema.safeParse({ ...resetBody, confirmPassword: "mismatch" }).success)
  let actor = { id: "bbbbbbbbbbbbbbbbbbbbbbbb", role: "admin" }, denied = null
  let target = { _id: "aaaaaaaaaaaaaaaaaaaaaaaa", role: "viewer" }, resetCall = null, audit = null
  const resetMocks = { ...mocks,
    "@/lib/admin-auth": { requireAdmin: async () => ({ user: actor, response: denied }) },
    "@/models/User": { __esModule: true, default: { findById: () => ({ select: async () => target }) } },
    "@/services/user-service": { UserService: { resetUserPassword: async (userId, password) => { resetCall = { userId, password }; return { password: "must-not-be-returned" } } } },
    "@/services/activity-log-service": { ActivityLogService: { log: async event => { audit = event } } },
  }
  const reset = load("app/api/users/[id]/reset-password/route.ts", resetMocks).POST
  const context = { params: Promise.resolve({ id: "aaaaaaaaaaaaaaaaaaaaaaaa" }) }
  response = await reset(request(resetBody), context)
  assert.equal(response.status, 200)
  assert.equal(resetCall.userId, "aaaaaaaaaaaaaaaaaaaaaaaa")
  assert.equal(resetCall.password, resetBody.newPassword)
  assert.equal(audit.userId, actor.id); assert.equal(audit.resourceId, resetCall.userId)
  assert.equal(audit.action, "PASSWORD_RESET")
  assert(!JSON.stringify(audit).includes(resetBody.newPassword))
  assert.deepEqual(await response.json(), { success: true, message: "Password changed successfully." })
  resetCall = null; audit = null
  target.role = "super_admin"
  assert.equal((await reset(request(resetBody), context)).status, 200)
  assert.equal(resetCall.userId, "aaaaaaaaaaaaaaaaaaaaaaaa")
  actor.role = "super_admin"
  assert.equal((await reset(request(resetBody), context)).status, 200)
  resetCall = null
  target = null
  assert.equal((await reset(request(resetBody), context)).status, 404)
  assert.equal((await reset(request({ ...resetBody, confirmPassword: "wrong" }), context)).status, 400)
  assert.equal((await reset(request({ newPassword: "short", confirmPassword: "short" }), context)).status, 400)
  assert.equal((await reset(request(resetBody), { params: Promise.resolve({ id: "invalid" }) })).status, 400)
  assert.equal((await reset(request(resetBody, "https://other.invalid"), context)).status, 403)
  allowed = false
  assert.equal((await reset(request(resetBody), context)).status, 429)
  allowed = true; denied = Response.json({ error: "Unauthorized" }, { status: 401 })
  assert.equal((await reset(request(resetBody), context)).status, 401)
  assert.equal(resetCall, null)
  // Every user-management mutation enforces self-protection, independent of target role.
  let updates = [], currentTarget = { _id: "aaaaaaaaaaaaaaaaaaaaaaaa", role: "super_admin" }
  const manageMocks = { ...resetMocks,
    "@/models/User": { __esModule: true, default: { findById: () => ({ select: async () => currentTarget }) } },
    "@/services/user-service": { UserService: { updateUser: async (id, data) => { updates.push({ id, data }); return { id, ...data } } } },
  }
  const managed = load("lib/user-management.ts", manageMocks)
  manageMocks["@/lib/user-management"] = managed
  const userRoutes = load("app/api/users/[id]/route.ts", manageMocks)
  const activate = load("app/api/users/[id]/activate/route.ts", manageMocks).POST
  const deactivate = load("app/api/users/[id]/deactivate/route.ts", manageMocks).POST
  denied = null
  for (const actorRole of ["admin", "super_admin"]) {
    actor.role = actorRole
    const selfContext = { params: Promise.resolve({ id: actor.id }) }
    for (const data of [{ role: "viewer" }, { role: actorRole }, { isActive: false }, { isActive: true }, { name: "Updated Name", role: "admin" }]) {
      assert.equal((await userRoutes.PATCH(request(data), selfContext)).status, 403)
    }
    assert.equal((await userRoutes.PATCH(request({ isActive: false }), { params: Promise.resolve({ id: actor.id.toUpperCase() }) })).status, 403)
    assert.equal((await userRoutes.DELETE(request(), selfContext)).status, 403)
    assert.equal((await activate(request(), selfContext)).status, 403)
    assert.equal((await deactivate(request(), selfContext)).status, 403)
    assert.equal(updates.length, 0)
    for (const targetRole of ["admin", "super_admin", "viewer", "sales_executive", "technician"]) {
      currentTarget.role = targetRole
      assert.equal((await userRoutes.PATCH(request({ role: "super_admin" }), context)).status, 200)
      assert.equal(updates.at(-1).data.role, "super_admin")
      assert.equal((await userRoutes.PATCH(request({ isActive: false }), context)).status, 200)
      assert.equal(updates.at(-1).data.isActive, false)
      assert.equal((await activate(request(), context)).status, 200)
      assert.equal(updates.at(-1).data.isActive, true)
      assert.equal((await deactivate(request(), context)).status, 200)
      assert.equal(updates.at(-1).data.isActive, false)
      assert.equal((await userRoutes.DELETE(request(), context)).status, 200)
    }
    updates = []
  }
  assert.equal((await userRoutes.PATCH(request({ role: "manager" }), context)).status, 400)
  assert.equal((await userRoutes.PATCH(request({ role: "sales" }), context)).status, 400)
  assert.equal((await userRoutes.PATCH(request({ isActive: "false" }), context)).status, 400)
  assert.equal((await userRoutes.PATCH(request({ password: "disallowed" }), context)).status, 400)
  assert.equal((await userRoutes.PATCH(request({}), context)).status, 400)
  currentTarget = null
  assert.equal((await userRoutes.PATCH(request({ role: "viewer" }), context)).status, 404)
  denied = Response.json({ error: "Forbidden" }, { status: 403 })
  assert.equal((await userRoutes.PATCH(request({ role: "admin" }), context)).status, 403)
  assert.equal((await activate(request(), context)).status, 403)
  assert.equal((await deactivate(request(), context)).status, 403)
  assert.equal((await userRoutes.DELETE(request(), context)).status, 403)
  denied = Response.json({ error: "Unauthorized" }, { status: 401 })
  assert.equal((await userRoutes.PATCH(request({ role: "admin" }), context)).status, 401)
  assert.equal(updates.length, 0)
  const { ROLE_PERMISSIONS } = load("constants/permissions.ts")
  assert(ROLE_PERMISSIONS.admin.includes("user.create"))
  assert(ROLE_PERMISSIONS.admin.includes("user.delete"))
  let persisted
  const { UserService: actualService } = load("services/user-service.ts", {
    "@/lib/mongodb": { connectDB: async () => {} },
    "./auth-service": {},
    "@/models/User": { __esModule: true, default: { findByIdAndUpdate: async (id, changes) => { persisted = changes; return { _id: id, ...changes } } } },
  })
  await actualService.updateUser("aaaaaaaaaaaaaaaaaaaaaaaa", { role: "admin" })
  assert.deepEqual(persisted.permissions, ROLE_PERMISSIONS.admin)
  // The shared administrator guard uses current database status and role.
  let liveAccount = { _id: "bbbbbbbbbbbbbbbbbbbbbbbb", name: "Admin", role: "admin", isActive: true }
  let liveSession = { user: { id: liveAccount._id, role: "admin" } }
  const liveModel = { __esModule: true, default: { findById: () => ({ select: () => ({ lean: async () => liveAccount }) }) } }
  const { requireAdmin } = load("lib/admin-auth.ts", {
    "next-auth": { getServerSession: async () => liveSession },
    "@/lib/auth": { authOptions: {} },
    "@/lib/mongodb": { connectDB: async () => {} },
    "@/models/User": liveModel,
  })
  assert.equal((await requireAdmin()).user.role, "admin")
  liveAccount.role = "super_admin"
  assert.equal((await requireAdmin()).user.role, "super_admin")
  liveAccount.isActive = false
  assert.equal((await requireAdmin()).response.status, 403)
  liveAccount.isActive = true; liveAccount.role = "viewer"
  assert.equal((await requireAdmin()).response.status, 403)
  liveSession = null
  assert.equal((await requireAdmin()).response.status, 401)
  const { authOptions } = load("lib/auth.ts", {
    "@/lib/mongodb": { connectDB: async () => {} },
    "@/models/User": liveModel,
    "@/services/activity-log-service": { ActivityLogService: { log: async () => {} } },
  })
  const sessionToken = () => ({ id: "bbbbbbbbbbbbbbbbbbbbbbbb", role: "admin", exp: Math.floor(Date.now() / 1000) + 3600, lastActivity: Date.now() })
  assert.equal((await authOptions.callbacks.jwt({ token: sessionToken() })).role, "viewer")
  liveAccount.isActive = false
  assert.deepEqual(await authOptions.callbacks.jwt({ token: sessionToken() }), {})
  console.log("PASS: locked/demoted accounts lose administrator authorization; session refresh reads the current account role and lock state.")
  console.log("PASS: admin/super-admin manage every other role; self role/status/soft-delete blocked through all mutation endpoints; valid roles, unlock behavior and permission synchronization verified.")
  console.log("PASS: per-user reset validates input, authorizes administrator access, changes only selected user, logs actor and target without passwords, and handles errors.")
  console.log("PASS: password validation, JSON errors, authorization, origin, rate limiting, update/audit, activity filters and access scoping (mocked database).")
}
main().catch((error) => { console.error(error); process.exitCode = 1 })
