import { NextResponse } from "next/server"

import { connectDB } from "@/lib/mongodb"

import Lead from "@/models/Lead"



// GET ALL LEADS
export async function GET() {

  try {

    await connectDB()

    const leads = await Lead.find()
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
    await connectDB()

    const body = await req.json()

    if (!body.name || !body.phone) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Name and phone are required",
        },
        {
          status: 400,
        }
      )
    }
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
        source: "Website",
      })

    return NextResponse.json({
      success: true,
      message:
        "Lead created successfully",
      lead: newLead,
    })
  } catch (error: any) {

  console.error(
    "CREATE LEAD ERROR FULL:",
    error
  )

  return NextResponse.json(
    {
      success: false,
      error:
        error?.message ||
        "Failed to create lead",

      stack:
        process.env.NODE_ENV ===
        "development"
          ? error?.stack
          : undefined,
    },
    {
      status: 500,
    }
  )
}
}