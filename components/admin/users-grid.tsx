"use client"

import { useMemo, useState } from "react"

import { AgGridReact } from "ag-grid-react"

import {
  Trash2,
  Shield,
  UserCog,
} from "lucide-react"

import Swal from "sweetalert2"

import EditUserDialog from "./edit-user-dialog"

import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"

export default function UsersGrid({
  users,
  refreshUsers,
}: any) {

  const [selectedUser, setSelectedUser] =
    useState(null)

  const [openDialog, setOpenDialog] =
    useState(false)

  async function deleteUser(user: any) {

    if (user.role === "admin") {

      Swal.fire({
        icon: "error",
        title: "Protected",
        text: "Admin cannot be deleted",
      })

      return
    }

    const result = await Swal.fire({
      title: "Delete User?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#3b82f6",
      confirmButtonText: "Yes Delete",
    })

    if (!result.isConfirmed) return

    const res = await fetch(
      `/api/users/${user._id}`,
      {
        method: "DELETE",
      }
    )

    const data = await res.json()

    if (data.success) {

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "User deleted successfully",
      })

      refreshUsers()

    } else {

      Swal.fire({
        icon: "error",
        title: "Error",
        text: data.error,
      })
    }
  }

  async function toggleStatus(user: any) {

    if (user.role === "admin") {

      Swal.fire({
        icon: "error",
        title: "Protected",
        text: "Admin cannot be disabled",
      })

      return
    }

    const result = await Swal.fire({
      title: user.isActive
        ? "Disable User?"
        : "Activate User?",

      text: user.isActive
        ? "User will not be able to login."
        : "User account will become active.",

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: user.isActive
        ? "#eab308"
        : "#22c55e",

      confirmButtonText: user.isActive
        ? "Disable"
        : "Activate",
    })

    if (!result.isConfirmed) return

    const res = await fetch(
      `/api/users/${user._id}`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          isActive: !user.isActive,
          role: user.role,
        }),
      }
    )

    const data = await res.json()

    if (data.success) {

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "User status updated",
      })

      refreshUsers()

    } else {

      Swal.fire({
        icon: "error",
        title: "Error",
        text: data.error,
      })
    }
  }

  function openEdit(user: any) {
    setSelectedUser(user)
    setOpenDialog(true)
  }

  const columnDefs = useMemo(
    () => [
      {
        field: "name",
        headerName: "Name",
        flex: 1,
      },

      {
        field: "email",
        headerName: "Email",
        flex: 1.5,
      },

      {
        field: "role",
        headerName: "Role",

        cellRenderer: (params: any) => {

          return (
            <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-brand-ink">
              {params.value}
            </span>
          )
        },
      },

      {
        field: "isActive",
        headerName: "Status",

        cellRenderer: (params: any) => {

          return params.value ? (
            <span className="font-semibold text-brand-green">
              Active
            </span>
          ) : (
            <span className="font-semibold text-destructive">
              Disabled
            </span>
          )
        },
      },

      {
        headerName: "Actions",

        cellRenderer: (params: any) => {

          const user = params.data

          return (
            <div className="flex items-center gap-2 pt-2">

              <button
                onClick={() =>
                  openEdit(user)
                }
                className="rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary hover:text-primary-foreground"
              >
                <UserCog className="h-4 w-4" />
              </button>

              <button
                onClick={() =>
                  toggleStatus(user)
                }
                className="rounded-lg bg-warning p-2 text-foreground hover:bg-warning"
              >
                <Shield className="h-4 w-4" />
              </button>

              <button
                onClick={() =>
                  deleteUser(user)
                }
                className="rounded-lg bg-destructive p-2 text-destructive-foreground hover:bg-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>

            </div>
          )
        },

        flex: 1.2,
      },
    ],
    []
  )

  return (
    <div>

      <div
        className="ag-theme-alpine mt-6"
        style={{
          height: 600,
          width: "100%",
        }}
      >

        <AgGridReact
          rowData={users}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          animateRows={true}
          defaultColDef={{
            sortable: true,
            filter: true,
            floatingFilter: true,
            resizable: true,
          }}
        />

      </div>

      {selectedUser && (

        <EditUserDialog
          open={openDialog}
          onClose={() =>
            setOpenDialog(false)
          }
          user={selectedUser}
          refreshUsers={refreshUsers}
        />

      )}

    </div>
  )
}