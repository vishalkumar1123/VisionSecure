import "server-only"
import { Schema, model, models } from "mongoose"

const schema = new Schema({
  _id: String,
  status: { type: String, enum: ["Passed", "Warning", "Failed"] },
  checkedAt: Date,
  lastSuccessAt: Date,
  error: String,
  latencyMs: Number,
  fingerprint: { type: String, select: false },
}, { timestamps: true })
export default models.IntegrationHealth || model("IntegrationHealth", schema)
