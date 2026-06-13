import { NextResponse } from "next/server"

import { connectDB } from "@/lib/mongodb"

import Lead from "@/models/Lead"



const ALLOWED_STATUSES = [
  "New",
  "In Discussion",
  "Follow-Up",
  "Quotation Sent",
  "Installation Scheduled",
  "Converted",
  "Closed",
]



// UPDATE LEAD
export async function PATCH(
  req: Request,
  context: {
    params: Promise<{
      id: string
    }>
  }
) {

  try {

    await connectDB()

    const { id } =
      await context.params

    const body =
      await req.json()



    // VALIDATE STATUS
    if (
      body.status &&
      !ALLOWED_STATUSES.includes(
        body.status
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



    // TIMELINE TRACKING
    if (
      body.status &&
      body.status !== lead.status
    ) {

      lead.timeline.push({
        action:
          `Lead moved from "${lead.status}" to "${body.status}"`,

        status: body.status,

        createdAt: new Date(),
      })
    }



    // UPDATE LEAD
    Object.assign(
      lead,
      body
    )

    await lead.save()



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