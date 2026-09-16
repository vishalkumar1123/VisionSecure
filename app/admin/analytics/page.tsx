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
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-4)",
  "var(--destructive)",
  "var(--chart-5)",
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
      <div className="p-10 text-foreground">
        Loading Analytics...
      </div>
    )
  }

 return (
  <div className="space-y-6">

    <div>
      <h1 className="text-3xl font-bold text-foreground">
        Analytics Dashboard
      </h1>

      <p className="mt-1 text-muted-foreground">
        Lead Performance & CRM Insights
      </p>
    </div>

    {/* KPI CARDS */}

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">

      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">
          Total Leads
        </p>

        <h3 className="mt-2 text-3xl font-bold text-foreground">
          {data.totalLeads}
        </h3>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">
          Today Leads
        </p>

        <h3 className="mt-2 text-3xl font-bold text-highlight-ink">
          {data.todayLeads}
        </h3>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">
          Active Pipeline
        </p>

        <h3 className="mt-2 text-3xl font-bold text-brand-ink">
          {data.activeLeads}
        </h3>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">
          Installed Successfully
        </p>

        <h3 className="mt-2 text-3xl font-bold text-brand-green">
          {data.convertedLeads}
        </h3>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">
          Cancelled
        </p>

        <h3 className="mt-2 text-3xl font-bold text-destructive">
          {data.closedLeads}
        </h3>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">
          Conversion %
        </p>

        <h3 className="mt-2 text-3xl font-bold text-warning">
          {data.conversionRate}%
        </h3>
      </div>

    </div>

    {/* MONTHLY LEADS */}

    <div className="rounded-2xl border border-border bg-card p-6">

      <h2 className="mb-6 text-xl font-semibold text-foreground">
        Monthly Leads Trend
      </h2>

      <div className="h-[350px]">

        <ResponsiveContainer width="100%" height="100%">

        <BarChart data={data.monthlyLeads}>
  <CartesianGrid
    strokeDasharray="3 3"
    stroke="var(--border)"
  />

  <XAxis dataKey="month" />

  <YAxis />

  <Tooltip />

  <Bar
    dataKey="total"
    fill="var(--chart-1)"
    radius={[6, 6, 0, 0]}
  />
</BarChart>

        </ResponsiveContainer>

      </div>

    </div>

    {/* PIE CHARTS */}

    <div className="grid gap-6 lg:grid-cols-2">

      <div className="rounded-2xl border border-border bg-card p-6">

        <h2 className="mb-4 text-xl font-semibold text-foreground">
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

      <div className="rounded-2xl border border-border bg-card p-6">

        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Lead Status
        </h2>

        <div className="space-y-3">

          <div className="flex justify-between text-warning">
            <span>New Leads</span>
            <span>{data.newLeads}</span>
          </div>

          <div className="flex justify-between text-brand-ink">
            <span>Discussion</span>
            <span>{data.discussionLeads}</span>
          </div>

          <div className="flex justify-between text-warning">
            <span>Follow-Up</span>
            <span>{data.followUpLeads}</span>
          </div>

          <div className="flex justify-between text-status-purple">
            <span>Quotation</span>
            <span>{data.quotationLeads}</span>
          </div>

          <div className="flex justify-between text-highlight-ink">
            <span>Installation</span>
            <span>{data.installationLeads}</span>
          </div>

          <div className="flex justify-between text-brand-green">
            <span>Installed Successfully</span>
            <span>{data.convertedLeads}</span>
          </div>

          <div className="flex justify-between text-destructive">
            <span>Cancelled</span>
            <span>{data.closedLeads}</span>
          </div>

        </div>

      </div>

    </div>

    {/* RECENT LEADS */}

    <div className="rounded-2xl border border-border bg-card p-6">

      <h2 className="mb-4 text-xl font-semibold text-foreground">
        Recent Leads
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-border">

              <th className="p-3 text-left text-muted-foreground">
                Name
              </th>

              <th className="p-3 text-left text-muted-foreground">
                Service
              </th>

              <th className="p-3 text-left text-muted-foreground">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {data.latestLeads.map(
              (lead: any) => (

                <tr
                  key={lead._id}
                  className="border-b border-border"
                >

                  <td className="p-3 text-foreground">
                    {lead.name}
                  </td>

                  <td className="p-3 text-muted-foreground">
                    {lead.service}
                  </td>

                  <td className="p-3 text-brand-ink">
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
