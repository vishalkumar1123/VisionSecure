"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

import { AgGridReact } from "ag-grid-react"

import { ColDef } from "ag-grid-community"
import {
  Trash2,
  Shield,
  UserCog,
  Plus,
} from "lucide-react"

import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-quartz.css"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [searchText, setSearchText] = useState("")
  const [selectedUser, setSelectedUser] =
    useState<any>(null)

  const [selectedRole, setSelectedRole] =
    useState("sales")

 async function fetchUsers() {
  try {
    const res = await fetch("/api/users", {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error("Failed to fetch users")
    }

    const response = await res.json()

    // console.log("Users API Response:", response)

    // Handle API structure
    const usersData =
      response?.data?.data ||
      response?.users ||
      response?.data ||
      []

    setUsers(usersData)
  } catch (error) {
    console.error(
      "Fetch Users Error:",
      error
    )

    toast.error(
      "Failed to load users"
    )

    setUsers([])
  }
}
useEffect(() => {
  fetchUsers()
}, [])
async function deleteUser(id: string) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this user?"
  )

  if (!confirmed) return

  try {
    const res = await fetch(`/api/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(
        data.message ||
          data.error ||
          "Failed to delete user"
      )
    }

    toast.success(
      data.message ||
        "User deleted successfully"
    )

    await fetchUsers()
  } catch (error: any) {
    console.error(
      "Delete User Error:",
      error
    )

    toast.error(
      error.message ||
        "Delete failed"
    )
  }
}
  async function toggleUserStatus(
    id: string,
    currentStatus: boolean
  ) {
    try {
      const res = await fetch(
        `/api/users/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            isActive: !currentStatus,
          }),
        }
      )

      const data = await res.json()

      if (data.success) {
        toast.success(
          currentStatus
            ? "User Disabled"
            : "User Activated"
        )

        fetchUsers()
      } else {
        toast.error(data.error)
      }
    } catch {
      toast.error("Update failed")
    }
  }

  async function updateUserRole() {
    if (!selectedUser) return

    try {
      const res = await fetch(
        `/api/users/${selectedUser._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            role: selectedRole,
          }),
        }
      )

      const data = await res.json()

      if (data.success) {
        toast.success(
          "Role Updated Successfully"
        )

        setSelectedUser(null)

        fetchUsers()
      } else {
        toast.error(data.error)
      }
    } catch {
      toast.error("Role Update Failed")
    }
  }

  const columnDefs = useMemo<
    ColDef[]
  >(
    () => [
      {
        headerName: "Name",
        field: "name",
        flex: 1,
      },

      {
        headerName: "Mobile",
        field: "mobile",
        flex: 1,
      },

      {
        headerName: "Email",
        field: "email",
        flex: 1.5,
      },

      {
        headerName: "Role",
        field: "role",
        flex: 1,
      },

      {
        headerName: "Status",
        field: "isActive",
        flex: 1,

        cellRenderer: (
          params: any
        ) =>
          params.value ? (
            <span className="font-medium text-green-500">
              Active
            </span>
          ) : (
            <span className="font-medium text-red-500">
              Disabled
            </span>
          ),
      },

      {
        headerName: "Actions",
        flex: 1.5,
        sortable: false,
        filter: false,

        cellRenderer: (
          params: any
        ) => (
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => {
                setSelectedUser(
                  params.data
                )

                setSelectedRole(
                  params.data.role
                )
              }}
              className="rounded bg-blue-600 p-2 text-white"
            >
              <UserCog size={16} />
            </button>

            <button
              onClick={() =>
                toggleUserStatus(
                  params.data._id,
                  params.data.isActive
                )
              }
              className="rounded bg-yellow-600 p-2 text-white"
            >
              <Shield size={16} />
            </button>

            <button
              onClick={() =>
                deleteUser(
                  params.data._id
                )
              }
              className="rounded bg-red-600 p-2 text-white"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    []
  )

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold text-white">
            User Management
          </h1>

          <p className="text-zinc-400">
            Manage CRM Users
          </p>
        </div>

        <Link
          href="/admin/users/create"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Create User
        </Link>

      </div>

      <input
        type="text"
        placeholder="Search users..."
        value={searchText}
        onChange={(e) =>
          setSearchText(
            e.target.value
          )
        }
        className="w-full rounded-xl border border-white/10 bg-zinc-900 p-4 text-white"
      />

      <div
        className="ag-theme-quartz-dark rounded-xl"
        style={{
          height: 700,
          width: "100%",
        }}
      >
        <AgGridReact
          rowData={users}
          columnDefs={columnDefs}
          quickFilterText={
            searchText
          }
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

      <Dialog
        open={!!selectedUser}
        onOpenChange={() =>
          setSelectedUser(null)
        }
      >
        <DialogContent className="bg-zinc-900 text-white">
          <DialogHeader>
            <DialogTitle>
              Update User Role
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">

            <Select
              value={selectedRole}
              onValueChange={
                setSelectedRole
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="admin">
                  Admin
                </SelectItem>

                <SelectItem value="manager">
                  Manager
                </SelectItem>

                <SelectItem value="technician">
                  Technician
                </SelectItem>

                <SelectItem value="sales">
                  Sales
                </SelectItem>
              </SelectContent>

            </Select>

            <button
              onClick={
                updateUserRole
              }
              className="w-full rounded-xl bg-blue-600 py-3 text-white"
            >
              Update Role
            </button>

          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}