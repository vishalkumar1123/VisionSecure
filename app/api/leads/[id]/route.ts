import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-auth"

import { connectDB } from "@/lib/mongodb"

import { ActivityLogService } from "@/services/activity-log-service"
import Lead from "@/models/Lead"



const ALLOWED_STATUSES = [
  "New",
  "In Discussion",
  "Follow-Up",
  "Quotation Sent",
  "Installation Scheduled",
  "Converted",
  "Closed",
  "Installed Successfully",
  "Cancelled",
]
const ALLOWED_PRIORITIES = ["Low", "Medium", "High", "Urgent"]

// GET ONE LEAD (used by the notification deep link)
export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAdmin()
  if (response) return response

  try {
    await connectDB()
    const { id } = await context.params
    const lead = await Lead.findById(id).lean()

    if (!lead) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, lead })
  } catch {
    return NextResponse.json({ success: false, error: "Unable to load lead" }, { status: 400 })
  }
}



// UPDATE LEAD
export async function PATCH(
  req: Request,
  context: {
    params: Promise<{
      id: string
    }>
  }
) {

  const { user, response } = await requireAdmin()
  if (response) return response

  try {

    await connectDB()

    const { id } =
      await context.params

    const body: unknown = await req.json().catch(() => null)
    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 })
    }
    const update = body as Record<string, unknown>



    // VALIDATE STATUS
    if (
      update.status &&
      !ALLOWED_STATUSES.includes(
        String(update.status)
      )
    ) {

      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid status",
        },
        {
          status: 400,
        }
      )
    }

    if (update.priority && !ALLOWED_PRIORITIES.includes(String(update.priority))) {
      return NextResponse.json({ success: false, error: "Invalid priority" }, { status: 400 })
    }



    // FIND LEAD
    const lead =
      await Lead.findById(id)

    if (!lead) {

      return NextResponse.json(
        {
          success: false,
          error:
            "Lead not found",
        },
        {
          status: 404,
        }
      )
    }



    const previousStatus = lead.status
    const previousFollowUp = lead.followUpDate ? new Date(lead.followUpDate).toISOString() : null

    // TIMELINE TRACKING
    if (
      update.status &&
      update.status !== lead.status
    ) {

      lead.timeline.push({
        action:
          `Lead moved from "${lead.status}" to "${update.status}"`,

        status: String(update.status),

        createdAt: new Date(),
      })
    }



    if (update.status) lead.status = String(update.status)
    if (update.priority) lead.priority = String(update.priority)

    if ("followUpDate" in update) {
      if (!update.followUpDate) {
        lead.followUpDate = null
      } else {
        if (typeof update.followUpDate !== "string" || !/T.*(?:Z|[+-]\d{2}:\d{2})$/.test(update.followUpDate)) return NextResponse.json({ success: false, error: "Choose a follow-up date and time with a timezone" }, { status: 400 })
        const followUpDate = new Date(update.followUpDate)
        if (Number.isNaN(followUpDate.getTime())) return NextResponse.json({ success: false, error: "Invalid follow-up date" }, { status: 400 })
        if (+followUpDate <= Date.now()) return NextResponse.json({ success: false, error: "Choose a future follow-up time" }, { status: 400 })
        lead.followUpDate = followUpDate
      }
    }

    if (typeof update.note === "string" && update.note.trim()) {
      const note = update.note.trim()
      if (note.length > 2000) return NextResponse.json({ success: false, error: "Note is too long" }, { status: 400 })
      lead.notes.push({ text: note, createdBy: user?.name || user?.email || "Admin", createdAt: new Date() })
      lead.timeline.push({ action: "A follow-up note was added", status: lead.status, createdAt: new Date() })
    }

    const nextFollowUp = lead.followUpDate ? new Date(lead.followUpDate).toISOString() : null
    if ("followUpDate" in update && previousFollowUp !== nextFollowUp) lead.timeline.push({ action: nextFollowUp ? `Follow-up scheduled for ${new Date(nextFollowUp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST` : "Follow-up schedule cleared", status: lead.status, createdAt: new Date() })
    await lead.save()
    if (user?.id) {
      await ActivityLogService.log({
        userId: user.id,
        action: update.status && update.status !== previousStatus ? "LEAD_STATUS_CHANGED" : "LEAD_UPDATED",
        resourceType: "Lead", resourceId: id,
        changes: update.status && update.status !== previousStatus ? { previousStatus, newStatus: lead.status, customerName: lead.name, service: lead.service, actorName: user.name || "Administrator" } : undefined,
      })
      if (typeof update.note === "string" && update.note.trim()) {
        await ActivityLogService.log({ userId: user.id, action: "NOTE_ADDED", resourceType: "Lead", resourceId: id })
      }
    }



    return NextResponse.json({
      success: true,
      message:
        "Lead updated successfully",
      lead,
    })

  } catch (error) {

    console.log(
      "PATCH ERROR:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to update lead",
      },
      {
        status: 500,
      }
    )
  }
}



// DELETE LEAD
export async function DELETE(
  req: Request,
  context: {
    params: Promise<{
      id: string
    }>
  }
) {

  const { response } = await requireAdmin()
  if (response) return response

  try {

    await connectDB()

    const { id } =
      await context.params

    const deletedLead =
      await Lead.findByIdAndDelete(
        id
      )

    if (!deletedLead) {

      return NextResponse.json(
        {
          success: false,
          error:
            "Lead not found",
        },
        {
          status: 404,
        }
      )
    }

    return NextResponse.json({
      success: true,
      message:
        "Lead deleted successfully",
    })

  } catch (error) {

    console.log(
      "DELETE ERROR:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Delete failed",
      },
      {
        status: 500,
      }
    )
  }
}
