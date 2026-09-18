import { NextResponse } from "next/server"

import { connectDB } from "@/lib/mongodb"

import Lead from "@/models/Lead"
import { NotificationService } from "@/notification/services/notification.service"
import { NotificationActivityLogService } from "@/notification/services/activity-log.service"
import { allowRateLimitedRequest } from "@/notification/utils/rate-limit"
import { requireAdmin } from "@/lib/admin-auth"
import { z } from "zod"
import { businessDay, CLOSED_STATUSES } from "@/lib/dashboard-time"

const createLeadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z.string().transform((phone) => phone.replace(/\D/g, "")).pipe(z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number")),
  email: z.string().trim().email("Please enter a valid email address").max(254).optional().or(z.literal("")),
  service: z.string().trim().min(2, "Please select a service or requirement").max(160),
  budget: z.string().trim().max(100).optional().default(""),
  message: z.string().trim().max(3000).optional().default(""),
  source: z.enum(["Website", "AI Chat", "AI Assistant"]).optional().default("Website"),
})



// GET ALL LEADS
export async function GET(request: Request) {

  const { response } = await requireAdmin()
  if (response) return response

  try {

    await connectDB()

    const params = new URL(request.url).searchParams
    const search = (params.get("q") || "").trim().slice(0,100)
    const status = params.get("status")
    const filter = params.get("filter")
    const { start, end } = businessDay()
    const query: Record<string, unknown> = {}
    if (status) query.status = status
    if (filter === "active") query.status = { $nin: CLOSED_STATUSES }
    if (filter === "won") query.status = { $in: ["Converted", "Installed Successfully"] }
    if (filter === "today") query.createdAt = { $gte: start, $lt: end }
    if (filter === "due" || filter === "overdue") {
      query.status = { $nin: CLOSED_STATUSES }
      query.followUpDate = filter === "due" ? { $gte: start, $lt: end } : { $lt: start, $ne: null }
    }
    if (search) {
      const literal = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      query.$or = ["name","phone","email","service"].map(field => ({ [field]: { $regex: literal, $options: "i" } }))
    }
    const leads = await Lead.find(query)
      .sort({
        createdAt: -1,
      })

    return NextResponse.json(leads)

  } catch (error) {

    console.log(error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch leads",
      },
      {
        status: 500,
      }
    )
  }
}




// CREATE LEAD
export async function POST(
  req: Request
) {
  try {
    const forwardedFor = req.headers.get("x-forwarded-for")
    const requestIp = forwardedFor?.split(",")[0]?.trim() || "unknown"
    if (!allowRateLimitedRequest(`lead:${requestIp}`)) {
      return NextResponse.json({ success: false, error: "Too many requests. Please try again shortly." }, { status: 429 })
    }

    let requestBody: unknown
    try {
      requestBody = await req.json()
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON request body" }, { status: 400 })
    }

    const parsed = createLeadSchema.safeParse(requestBody)
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Invalid lead information",
        },
        {
          status: 400,
        }
      )
    }
    const body = parsed.data

    await connectDB()
// CHECK DUPLICATE LEAD
const last24Hours = new Date()

last24Hours.setHours(
  last24Hours.getHours() - 24
)

const existingLead = await Lead.findOne({
  phone: body.phone,
  service: body.service,
  createdAt: {
    $gte: last24Hours,
  },
})

if (existingLead) {
  return NextResponse.json(
    {
      success: false,
      error:
        "You already submitted the same service request recently.",
    },
    {
      status: 409,
    }
  )
}
    const newLead =
      await Lead.create({
        name: body.name,
        phone: body.phone,
        email: body.email,
        service: body.service,
        budget: body.budget,
        message: body.message,

        // FIXED
        status: "New",

        // FIXED
        source: body.source,
      })

    const notificationPayload = {
      name: newLead.name,
      phone: newLead.phone,
      email: newLead.email,
      requirement: newLead.message || newLead.service,
      service: newLead.service,
      source: newLead.source,
      priority: newLead.priority,
      status: newLead.status,
      createdAt: newLead.createdAt,
    }

    // VNC is deliberately isolated: delivery failures never change a saved lead response.
    console.info("Lead created", { leadId: newLead._id.toString() })
    await NotificationActivityLogService.record("LEAD_CREATED", { leadId: newLead._id.toString() })
    await NotificationService.notifyNewLead(newLead._id.toString(), notificationPayload).catch((error: unknown) => {
      console.error("VNC notification dispatch failed", { leadId: newLead._id.toString(), error: error instanceof Error ? error.message : "unknown" })
    })

    return NextResponse.json({
      success: true,
      message:
        "Lead created successfully",
      leadId: newLead._id.toString(),
    })
  } catch (error: unknown) {

  console.error(
    "CREATE LEAD ERROR FULL:",
    error
  )

  return NextResponse.json(
    {
      success: false,
        error: "Failed to create lead",
    },
    {
      status: 500,
    }
  )
}
}
