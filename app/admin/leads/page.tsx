"use client"

import {
  useEffect,
  useState,
} from "react"

import LeadsGrid from "@/components/admin/leads-grid"

type Lead = {
  _id: string
  name: string
  phone: string
  email: string
  service: string
  budget: string
  status: string
  createdAt: string
}

export default function LeadsPage() {

  const [leads, setLeads] =
    useState<Lead[]>([])

  const [loading, setLoading] =
    useState(true)

  async function fetchLeads() {

    try {

      const res =
        await fetch("/api/leads")

      const data =
        await res.json()

      setLeads(data)

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  return (

    <div>

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold text-white">
            Leads Management
          </h1>

          <p className="mt-2 text-zinc-400">
            Manage CRM leads professionally
          </p>

        </div>

      </div>

      {loading ? (

        <div className="text-white">
          Loading leads...
        </div>

      ) : (

        <LeadsGrid
          leads={leads}
          refreshLeads={fetchLeads}
        />

      )}

    </div>
  )
}