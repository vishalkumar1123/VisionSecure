"use client"

import {
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
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

function LeadsContent() {
  const params = useSearchParams()
  const query = params.toString()
  const [error,setError] = useState("")

  const [leads, setLeads] =
    useState<Lead[]>([])

  const [loading, setLoading] =
    useState(true)

  const fetchLeads = useCallback(async () => {
    setLoading(true); setError("")

    try {

      const res =
        await fetch(`/api/leads?${query}`)
      if (!res.ok) throw new Error("Unable to load leads")

      const data =
        await res.json()

      setLeads(data)

    } catch (error) {

      setError("Unable to load leads. Please retry.")

    } finally {

      setLoading(false)
    }
  }, [query])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  return (

    <div>

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold text-foreground">
            Leads Management
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage CRM leads professionally
          </p>

        </div>

      </div>

      {query && <p className="mb-4 rounded-xl bg-muted p-3 text-sm text-foreground">Filtered by: {Array.from(params.entries()).map(([key,value])=>`${key}: ${value}`).join(" / ")} <Link href="/admin/leads" className="ml-3 underline">Clear filters</Link></p>}
      {error && <p role="alert" className="mb-4 text-destructive">{error} <button onClick={()=>void fetchLeads()} className="underline">Retry</button></p>}
      {loading ? (

        <div className="text-foreground">
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
export default function LeadsPage(){return <Suspense fallback={<p>Loading leads...</p>}><LeadsContent/></Suspense>}
