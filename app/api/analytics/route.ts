import { NextResponse } from "next/server"

import { connectDB } from "@/lib/mongodb"

import Lead from "@/models/Lead"
import { requireAdmin } from "@/lib/admin-auth"



export async function GET() {

  const { response } = await requireAdmin()
  if (response) return response

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
        status: { $in: ["Installed Successfully", "Converted"] },
      })



    // CLOSED LEADS
    const closedLeads =
      await Lead.countDocuments({
        status: { $in: ["Cancelled", "Closed"] },
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
        .select("_id name phone service status createdAt")
        .lean()



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
        name: "Installed Successfully",
        total: convertedLeads,
      },

      {
        name: "Cancelled",
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

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setHours(0, 0, 0, 0)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)
    const previousPeriodStart = new Date(thirtyDaysAgo)
    previousPeriodStart.setDate(previousPeriodStart.getDate() - 30)

    const [dailyRows, current30Days, previous30Days, sourceStats] = await Promise.all([
      Lead.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Kolkata" } }, total: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Lead.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Lead.countDocuments({ createdAt: { $gte: previousPeriodStart, $lt: thirtyDaysAgo } }),
      Lead.aggregate([{ $group: { _id: "$source", total: { $sum: 1 } } }, { $sort: { total: -1 } }]),
    ])

    const dailyMap = new Map(dailyRows.map((row) => [row._id, row.total]))
    const dailyTrend = Array.from({ length: 30 }, (_, index) => {
      const day = new Date(thirtyDaysAgo)
      day.setDate(day.getDate() + index)
      const key = day.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
      return { date: key, label: day.toLocaleDateString("en-IN", { day: "2-digit", month: "short", timeZone: "Asia/Kolkata" }), total: dailyMap.get(key) || 0 }
    })
    const leadTrendPercentage = previous30Days > 0 ? Number((((current30Days - previous30Days) / previous30Days) * 100).toFixed(1)) : current30Days > 0 ? 100 : 0



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
  dailyTrend,
  current30Days,
  previous30Days,
  leadTrendPercentage,
  sourceStats,
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
