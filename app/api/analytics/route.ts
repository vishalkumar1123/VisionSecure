import { NextResponse } from "next/server"

import { connectDB } from "@/lib/mongodb"

import Lead from "@/models/Lead"



export async function GET() {

  try {

    await connectDB()



    // TOTAL LEADS
    const totalLeads =
      await Lead.countDocuments()



    // NEW LEADS
    const newLeads =
      await Lead.countDocuments({
        status: "New",
      })



    // DISCUSSION LEADS
    const discussionLeads =
      await Lead.countDocuments({
        status: "In Discussion",
      })



    // FOLLOW UP LEADS
    const followUpLeads =
      await Lead.countDocuments({
        status: "Follow-Up",
      })



    // QUOTATION LEADS
    const quotationLeads =
      await Lead.countDocuments({
        status: "Quotation Sent",
      })



    // INSTALLATION LEADS
    const installationLeads =
      await Lead.countDocuments({
        status:
          "Installation Scheduled",
      })



    // CONVERTED LEADS
    const convertedLeads =
      await Lead.countDocuments({
        status: "Converted",
      })



    // CLOSED LEADS
    const closedLeads =
      await Lead.countDocuments({
        status: "Closed",
      })



    // ACTIVE PIPELINE
    const activeLeads =
      await Lead.countDocuments({
        status: {
          $in: [
            "New",
            "In Discussion",
            "Follow-Up",
            "Quotation Sent",
            "Installation Scheduled",
          ],
        },
      })



    // TODAY LEADS
    const startOfDay = new Date()

    startOfDay.setHours(
      0,
      0,
      0,
      0
    )

    const endOfDay = new Date()

    endOfDay.setHours(
      23,
      59,
      59,
      999
    )

    const todayLeads =
      await Lead.countDocuments({
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })



    // LATEST LEADS
    const latestLeads =
      await Lead.find()
        .sort({
          createdAt: -1,
        })
        .limit(5)



    // MONTHLY LEADS
    const monthlyLeads =
      await Lead.aggregate([
        {
          $group: {
            _id: {
              month: {
                $month:
                  "$createdAt",
              },
            },

            total: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            "_id.month": 1,
          },
        },
      ])



    // SERVICE STATS
    const serviceStats =
      await Lead.aggregate([
        {
          $group: {
            _id: "$service",

            total: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            total: -1,
          },
        },
      ])

    // STATUS DISTRIBUTION

    const statusStats = [
      {
        name: "New",
        total: newLeads,
      },

      {
        name: "In Discussion",
        total: discussionLeads,
      },

      {
        name: "Follow-Up",
        total: followUpLeads,
      },

      {
        name: "Quotation Sent",
        total: quotationLeads,
      },

      {
        name: "Installation Scheduled",
        total: installationLeads,
      },

      {
        name: "Converted",
        total: convertedLeads,
      },

      {
        name: "Closed",
        total: closedLeads,
      },
    ]



    // THIS MONTH LEADS

    const currentDate =
      new Date()

    const currentMonthStart =
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      )

    const currentMonthEnd =
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
        23,
        59,
        59
      )

    const thisMonthLeads =
      await Lead.countDocuments({
        createdAt: {
          $gte:
            currentMonthStart,

          $lte:
            currentMonthEnd,
        },
      })



    // LAST MONTH LEADS

    const lastMonthStart =
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      )

    const lastMonthEnd =
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0,
        23,
        59,
        59
      )

    const lastMonthLeads =
      await Lead.countDocuments({
        createdAt: {
          $gte:
            lastMonthStart,

          $lte:
            lastMonthEnd,
        },
      })



    // GROWTH %

    const growthPercentage =
      lastMonthLeads > 0
        ? Number(
            (
              ((thisMonthLeads -
                lastMonthLeads) /
                lastMonthLeads) *
              100
            ).toFixed(1)
          )
        : 100

    // CONVERSION RATE
    const conversionRate =
      totalLeads > 0
        ? Number(
            (
              (convertedLeads /
                totalLeads) *
              100
            ).toFixed(1)
          )
        : 0



    return NextResponse.json({
  success: true,

  totalLeads,

  activeLeads,

  newLeads,

  discussionLeads,

  followUpLeads,

  quotationLeads,

  installationLeads,

  convertedLeads,

  closedLeads,

  todayLeads,

  thisMonthLeads,

  lastMonthLeads,

  growthPercentage,

  latestLeads,

  monthlyLeads,

  serviceStats,

  statusStats,

  conversionRate,
})

  } catch (error) {

    console.log(
      "Analytics Error:",
      error
    )

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to load analytics",
      },
      {
        status: 500,
      }
    )
  }
}