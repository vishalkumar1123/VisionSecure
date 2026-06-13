"use client"

import { useEffect, useState } from "react"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts"

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
]

export default function AnalyticsPage() {

  const [data, setData] = useState<any>(null)

  useEffect(() => {

    fetch("/api/analytics")
      .then((res) => res.json())
      .then((result) => {
        setData(result)
      })

  }, [])

  if (!data) {
    return (
      <div className="p-10 text-white">
        Loading Analytics...
      </div>
    )
  }

 return (
  <div className="space-y-6">

    <div>
      <h1 className="text-3xl font-bold text-white">
        Analytics Dashboard
      </h1>

      <p className="mt-1 text-zinc-400">
        Lead Performance & CRM Insights
      </p>
    </div>

    {/* KPI CARDS */}

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">

      <div className="rounded-xl border border-white/10 bg-zinc-900 p-5">
        <p className="text-sm text-zinc-400">
          Total Leads
        </p>

        <h3 className="mt-2 text-3xl font-bold text-white">
          {data.totalLeads}
        </h3>
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-900 p-5">
        <p className="text-sm text-zinc-400">
          Today Leads
        </p>

        <h3 className="mt-2 text-3xl font-bold text-cyan-400">
          {data.todayLeads}
        </h3>
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-900 p-5">
        <p className="text-sm text-zinc-400">
          Active Pipeline
        </p>

        <h3 className="mt-2 text-3xl font-bold text-blue-400">
          {data.activeLeads}
        </h3>
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-900 p-5">
        <p className="text-sm text-zinc-400">
          Converted
        </p>

        <h3 className="mt-2 text-3xl font-bold text-green-400">
          {data.convertedLeads}
        </h3>
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-900 p-5">
        <p className="text-sm text-zinc-400">
          Closed
        </p>

        <h3 className="mt-2 text-3xl font-bold text-red-400">
          {data.closedLeads}
        </h3>
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-900 p-5">
        <p className="text-sm text-zinc-400">
          Conversion %
        </p>

        <h3 className="mt-2 text-3xl font-bold text-yellow-400">
          {data.conversionRate}%
        </h3>
      </div>

    </div>

    {/* MONTHLY LEADS */}

    <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">

      <h2 className="mb-6 text-xl font-semibold text-white">
        Monthly Leads Trend
      </h2>

      <div className="h-[350px]">

        <ResponsiveContainer width="100%" height="100%">

        <BarChart data={data.monthlyLeads}>
  <CartesianGrid
    strokeDasharray="3 3"
    stroke="#27272a"
  />

  <XAxis dataKey="month" />

  <YAxis />

  <Tooltip />

  <Bar
    dataKey="total"
    fill="#3b82f6"
    radius={[6, 6, 0, 0]}
  />
</BarChart>

        </ResponsiveContainer>

      </div>

    </div>

    {/* PIE CHARTS */}

    <div className="grid gap-6 lg:grid-cols-2">

      <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">

        <h2 className="mb-4 text-xl font-semibold text-white">
          Services Distribution
        </h2>

        <div className="h-[350px]">

          <ResponsiveContainer>

            <PieChart>

              <Pie
                data={data.serviceStats}
                dataKey="total"
                nameKey="_id"
                outerRadius={120}
                label
              >

                {data.serviceStats.map(
                  (_: any, index: number) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />

                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">

        <h2 className="mb-4 text-xl font-semibold text-white">
          Lead Status
        </h2>

        <div className="space-y-3">

          <div className="flex justify-between text-yellow-400">
            <span>New Leads</span>
            <span>{data.newLeads}</span>
          </div>

          <div className="flex justify-between text-blue-400">
            <span>Discussion</span>
            <span>{data.discussionLeads}</span>
          </div>

          <div className="flex justify-between text-orange-400">
            <span>Follow-Up</span>
            <span>{data.followUpLeads}</span>
          </div>

          <div className="flex justify-between text-purple-400">
            <span>Quotation</span>
            <span>{data.quotationLeads}</span>
          </div>

          <div className="flex justify-between text-cyan-400">
            <span>Installation</span>
            <span>{data.installationLeads}</span>
          </div>

          <div className="flex justify-between text-green-400">
            <span>Converted</span>
            <span>{data.convertedLeads}</span>
          </div>

          <div className="flex justify-between text-red-400">
            <span>Closed</span>
            <span>{data.closedLeads}</span>
          </div>

        </div>

      </div>

    </div>

    {/* RECENT LEADS */}

    <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">

      <h2 className="mb-4 text-xl font-semibold text-white">
        Recent Leads
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-white/10">

              <th className="p-3 text-left text-zinc-400">
                Name
              </th>

              <th className="p-3 text-left text-zinc-400">
                Service
              </th>

              <th className="p-3 text-left text-zinc-400">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {data.latestLeads.map(
              (lead: any) => (

                <tr
                  key={lead._id}
                  className="border-b border-white/5"
                >

                  <td className="p-3 text-white">
                    {lead.name}
                  </td>

                  <td className="p-3 text-zinc-300">
                    {lead.service}
                  </td>

                  <td className="p-3 text-blue-400">
                    {lead.status}
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>

  </div>
)
}