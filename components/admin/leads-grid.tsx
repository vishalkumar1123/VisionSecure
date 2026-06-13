"use client"

import {
  useMemo,
  useState,
} from "react"

import { AgGridReact } from "ag-grid-react"

import { ColDef } from "ag-grid-community"
import {
  Trash2,
  Phone,
  Mail,
} from "lucide-react"

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
  "Converted",
  "Closed",
]

const STATUS_COLORS: Record<
  string,
  string
> = {
  New:
    "bg-yellow-500/20 text-yellow-400",

  "In Discussion":
    "bg-blue-500/20 text-blue-400",

  "Quotation Sent":
    "bg-purple-500/20 text-purple-400",

  "Follow-Up":
    "bg-orange-500/20 text-orange-400",

  Converted:
    "bg-green-500/20 text-green-400",

  Closed:
    "bg-red-500/20 text-red-400",
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

      if (data.success) {

        toast.success(
          "Lead deleted successfully"
        )

        refreshLeads()

      } else {

        toast.error(
          data.error ||
            "Delete failed"
        )
      }

    } catch (error) {

      toast.error(
        "Delete failed"
      )

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

      if (data.success) {

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

  const columns = useMemo<
    ColDef<Lead>[]
  >(
    () => [

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

            <Phone className="h-4 w-4 text-green-400" />

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

            <Mail className="h-4 w-4 text-blue-400" />

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
              className={`w-full rounded-lg border border-white/10 px-3 py-2 text-sm font-medium outline-none ${STATUS_COLORS[status]}`}
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

          <div className="flex items-center">

            <button
              onClick={() =>
                deleteLead(
                  params.data._id
                )
              }
              className="rounded-lg bg-red-600 p-2 text-white transition hover:bg-red-700"
            >

              <Trash2 className="h-4 w-4" />

            </button>

          </div>
        ),
      },

    ],
    []
  )

  return (

    <div
      className="ag-theme-quartz-dark overflow-hidden rounded-2xl border border-white/10"
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