import { Schema, model, models } from "mongoose"

const integration = new Schema({
  _id: { type: String, default: "primary" },
  encryptedRefreshToken: { type: String, select: false },
  accountEmail: String, grantedScopes: [String], revision: String,
  connectedAt: Date, lastVerifiedAt: Date, lastSuccessfulAt: Date, lastError: String,
  analytics: String, search: String,
}, { timestamps: true })
export default models.GoogleIntegration || model("GoogleIntegration", integration)
const application = new Schema({ _id: String, clientId: String, secretEncrypted: { type: String, select: false } }, { timestamps: true })
export const GoogleApplication = models.GoogleApplication || model("GoogleApplication", application)

const state = new Schema({ _id: String, userId: String, verifier: String, redirectUri: String, expiresAt: Date })
state.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
export const GoogleOAuthState = models.GoogleOAuthState || model("GoogleOAuthState", state)

const cache = new Schema({ _id: String, data: Schema.Types.Mixed, fetchedAt: Date, expiresAt: Date })
cache.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
export const GoogleReportCache = models.GoogleReportCache || model("GoogleReportCache", cache)

const limit = new Schema({ _id: String, count: Number, expiresAt: Date })
limit.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
export const GoogleRateLimit = models.GoogleRateLimit || model("GoogleRateLimit", limit)
