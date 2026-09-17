"use client"

import { useState } from "react"

import { AgGridReact } from "ag-grid-react"

import { ColDef } from "ag-grid-community"
import {
  Trash2,
  Phone,
  Mail,
  Eye,
} from "lucide-react"
import Link from "next/link"

import Swal from "sweetalert2"

import { toast } from "sonner"

import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-quartz.css"

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

interface Props {
  leads: Lead[]
  refreshLeads: () => void
}

/*
|--------------------------------------------------------------------------
| PROFESSIONAL CRM STATUS FLOW
|--------------------------------------------------------------------------
*/

const LEAD_STATUSES = [
  "New",
  "In Discussion",
  "Follow-Up",
  "Quotation Sent",
  "Installation Scheduled",
  "Installed Successfully",
  "Cancelled",
]

const STATUS_COLORS: Record<
  string,
  string
> = {
  New:
    "bg-warning/20 text-warning",

  "In Discussion":
    "bg-primary/20 text-brand-ink",

  "Quotation Sent":
    "bg-status-purple/20 text-status-purple",

  "Follow-Up":
    "bg-warning/20 text-warning",

  "Installed Successfully":
    "bg-accent/20 text-brand-green",

  Cancelled:
    "bg-destructive/20 text-destructive",
}

export default function LeadsGrid({
  leads,
  refreshLeads,
}: Props) {

  const [loading, setLoading] =
    useState(false)

  /*
  |--------------------------------------------------------------------------
  | DELETE LEAD
  |--------------------------------------------------------------------------
  */

  async function deleteLead(
    id: string
  ) {

    const result =
      await Swal.fire({
        title:
          "Delete Lead?",
        text:
          "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        focusCancel: true,
        confirmButtonColor:
          "#dc2626",
        background: "#18181b",
        color: "#ffffff",
        confirmButtonText:
          "Delete",
      })

    if (!result.isConfirmed)
      return

    try {

      setLoading(true)

      const res = await fetch(
        `/api/leads/${id}`,
        {
          method: "DELETE",
        }
      )

      const data =
        await res.json()

      if (res.ok && data.success) {

        await Swal.fire({ title: "Lead deleted", text: "The lead has been deleted successfully.", icon: "success" })

        refreshLeads()

      } else {

        await Swal.fire({ title: "Delete failed", text: data.error || "Please try again.", icon: "error" })
      }

    } catch (error) {

      await Swal.fire({ title: "Delete failed", text: "Check your connection and try again.", icon: "error" })

    } finally {

      setLoading(false)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | UPDATE STATUS
  |--------------------------------------------------------------------------
  */

  async function updateStatus(
    id: string,
    status: string
  ) {

    try {

      const res = await fetch(
        `/api/leads/${id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        }
      )

      const data =
        await res.json()

      if (res.ok && data.success) {

        toast.success(
          `Lead moved to "${status}"`
        )

        refreshLeads()

      } else {

        toast.error(
          data.error ||
            "Update failed"
        )
      }

    } catch (error) {

      toast.error(
        "Update failed"
      )
    }
  }

  /*
  |--------------------------------------------------------------------------
  | GRID COLUMNS
  |--------------------------------------------------------------------------
  */

  const columns: ColDef<Lead>[] = [

      {
        headerName: "Name",
        field: "name",
        flex: 1,
      },

      {
        headerName: "Phone",
        field: "phone",
        flex: 1,

        cellRenderer: (
          params: any
        ) => (

          <div className="flex items-center gap-2">

            <Phone className="h-4 w-4 text-brand-green" />

            <span>
              {params.value}
            </span>

          </div>
        ),
      },

      {
        headerName: "Email",
        field: "email",
        flex: 1.5,

        cellRenderer: (
          params: any
        ) => (

          <div className="flex items-center gap-2">

            <Mail className="h-4 w-4 text-brand-ink" />

            <span>
              {params.value || "-"}
            </span>

          </div>
        ),
      },

      {
        headerName: "Service",
        field: "service",
        flex: 1,
      },

      {
        headerName: "Status",
        field: "status",
        flex: 1.2,

        cellRenderer: (
          params: any
        ) => {

          const status =
            params.value

          return (

            <select
              value={status}
              onChange={(e) =>
                updateStatus(
                  params.data._id,
                  e.target.value
                )
              }
              className={`w-full rounded-lg border border-border px-3 py-2 text-sm font-medium outline-none ${STATUS_COLORS[status]}`}
            >

              {LEAD_STATUSES.map(
                (status) => (

                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                )
              )}

            </select>
          )
        },
      },

      {
        headerName: "Date",
        field: "createdAt",
        flex: 1,

        valueFormatter: (
          params
        ) =>

          new Date(
            params.value as string
          ).toLocaleDateString(),
      },

      {
        headerName: "Actions",
        field: "_id",
        flex: 0.8,

        sortable: false,
        filter: false,

        cellRenderer: (
          params: any
        ) => (

          <div className="flex items-center gap-2">

            <Link href={`/admin/leads/${params.data._id}`} aria-label={`Track ${params.data.name}`} className="rounded-lg bg-highlight p-2 text-accent-foreground transition hover:bg-highlight">
              <Eye className="h-4 w-4" />
            </Link>

            <button
              onClick={() =>
                deleteLead(
                  params.data._id
                )
              }
              className="rounded-lg bg-destructive p-2 text-destructive-foreground transition hover:bg-destructive"
            >

              <Trash2 className="h-4 w-4" />

            </button>

          </div>
        ),
      },

    ]

  return (

    <div
      className="ag-theme-quartz-dark overflow-hidden rounded-2xl border border-border"
      style={{
        height: 650,
        width: "100%",
      }}
    >

     <AgGridReact<Lead>
  rowData={leads}
  columnDefs={columns}
  pagination
  paginationPageSize={10}
  rowHeight={70}
  animateRows
  loading={loading}
  defaultColDef={{
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
  }}
/>

    </div>
  )
}
