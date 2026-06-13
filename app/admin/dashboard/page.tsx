"use client"

import {
  useEffect,
  useState,
} from "react"

import {
  Users,
  UserPlus,
  PhoneCall,
  FileText,
  Wrench,
  CheckCircle,
  XCircle,
  CalendarDays,
} from "lucide-react"

interface AnalyticsData {

  totalLeads: number

  newLeads: number

  followUpLeads: number

  quotationLeads: number

  installationLeads: number

  convertedLeads: number

  closedLeads: number

  todayLeads: number

  latestLeads: any[]
}

export default function DashboardPage() {

  const [data, setData] =
    useState<AnalyticsData | null>(
      null
    )

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    async function fetchData() {

      try {

        const res = await fetch(
          "/api/analytics"
        )

        const result =
          await res.json()

        setData(result)

      } catch (error) {

        console.log(error)

      } finally {

        setLoading(false)
      }
    }

    fetchData()

  }, [])




  if (loading) {

    return (
      <div className="text-white">
        Loading dashboard...
      </div>
    )
  }




  const statusColors: any = {

    New:
      "text-blue-400",

    "Follow-Up":
      "text-yellow-400",

    "Quotation Sent":
      "text-purple-400",

    "Installation Scheduled":
      "text-cyan-400",

    Converted:
      "text-green-400",

    Closed:
      "text-red-400",
  }




  return (

    <div>

      {/* PAGE TITLE */}
      <div className="mb-10">

        <h1 className="text-5xl font-bold text-white">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-zinc-400">
          VisionSecure CRM Overview
        </p>

      </div>




      {/* DASHBOARD CARDS */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <DashboardCard
          title="Total Leads"
          value={data?.totalLeads || 0}
          color="text-white"
          icon={
            <Users className="h-7 w-7 text-white" />
          }
        />

        <DashboardCard
          title="New Leads"
          value={data?.newLeads || 0}
          color="text-blue-400"
          icon={
            <UserPlus className="h-7 w-7 text-blue-400" />
          }
        />

        <DashboardCard
          title="Follow-Up"
          value={
            data?.followUpLeads || 0
          }
          color="text-yellow-400"
          icon={
            <PhoneCall className="h-7 w-7 text-yellow-400" />
          }
        />

        <DashboardCard
          title="Quotation Sent"
          value={
            data?.quotationLeads || 0
          }
          color="text-purple-400"
          icon={
            <FileText className="h-7 w-7 text-purple-400" />
          }
        />

        <DashboardCard
          title="Installation"
          value={
            data?.installationLeads || 0
          }
          color="text-cyan-400"
          icon={
            <Wrench className="h-7 w-7 text-cyan-400" />
          }
        />

        <DashboardCard
          title="Converted"
          value={
            data?.convertedLeads || 0
          }
          color="text-green-400"
          icon={
            <CheckCircle className="h-7 w-7 text-green-400" />
          }
        />

        <DashboardCard
          title="Closed"
          value={
            data?.closedLeads || 0
          }
          color="text-red-400"
          icon={
            <XCircle className="h-7 w-7 text-red-400" />
          }
        />

        <DashboardCard
          title="Today Leads"
          value={
            data?.todayLeads || 0
          }
          color="text-orange-400"
          icon={
            <CalendarDays className="h-7 w-7 text-orange-400" />
          }
        />

      </div>




      {/* LATEST LEADS */}
      <div className="mt-10 rounded-3xl border border-white/10 bg-zinc-900/60 p-8">

        <div className="mb-8 flex items-center justify-between">

          <h2 className="text-3xl font-bold text-white">
            Latest Leads
          </h2>

          <div className="rounded-xl bg-zinc-800 px-4 py-2 text-sm text-zinc-300">
            Recent CRM Activities
          </div>

        </div>




        <div className="space-y-5">

          {data?.latestLeads?.length ===
          0 ? (

            <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-6 text-center text-zinc-400">
              No leads found
            </div>

          ) : (

            data?.latestLeads?.map(
              (lead) => (

                <div
                  key={lead._id}
                  className="flex items-center justify-between rounded-2xl border border-white/5 bg-zinc-950/40 p-5 transition hover:border-blue-500/30"
                >

                  <div>

                    <h3 className="text-xl font-semibold text-white">
                      {lead.name}
                    </h3>

                    <p className="mt-1 text-zinc-400">
                      {lead.phone}
                    </p>

                  </div>




                  <div className="text-right">

                    <p className="text-lg text-white">
                      {lead.service}
                    </p>

                    <p
                      className={`mt-2 text-sm font-semibold ${statusColors[lead.status]}`}
                    >
                      {lead.status}
                    </p>

                  </div>

                </div>
              )
            )

          )}

        </div>

      </div>

    </div>
  )
}




function DashboardCard({
  title,
  value,
  color,
  icon,
}: any) {

  return (

    <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-7 shadow-lg transition hover:border-blue-500/30">

      <div className="flex items-center justify-between">

        <h3 className="text-lg text-zinc-400">
          {title}
        </h3>

        {icon}

      </div>

      <p
        className={`mt-6 text-5xl font-bold ${color}`}
      >
        {value}
      </p>

    </div>
  )
}