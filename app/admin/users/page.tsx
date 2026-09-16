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
async function deleteUser(user: any) {

  if (isProtectedUser(user)) {

    toast.error(
      `${user.role} cannot be deleted`
    )

    return
  }

  const confirmed = window.confirm(
    `Delete ${user.name}?`
  )

  if (!confirmed) return

  try {

    const res = await fetch(
      `/api/users/${user._id}`,
      {
        method: "DELETE",
      }
    )

    const data = await res.json()

    if (!res.ok) {

      throw new Error(
        data.message ||
        "Delete failed"
      )
    }

    toast.success(
      "User deleted successfully"
    )

    fetchUsers()

  } catch (error: any) {

    toast.error(
      error.message
    )
  }
}
 async function toggleUserStatus(
 user:any
) {

 if (isProtectedUser(user)) {

   toast.error(
     `${user.role} cannot be locked or unlocked`
   )

   return
 }

 try {

   const res = await fetch(
     `/api/users/${user._id}`,
     {
       method:"PATCH",

       headers:{
         "Content-Type":
         "application/json"
       },

       body:JSON.stringify({

         isActive:
         !user.isActive

       })
     }
   )

   const data =
   await res.json()

   if(data.success){

     toast.success(

      user.isActive

      ? "User disabled"

      : "User activated"

     )

     fetchUsers()

   }else{

     toast.error(

      data.message

     )
   }

 }catch{

   toast.error(
    "Update failed"
   )
 }
}

 async function updateUserRole() {

 if (!selectedUser) return

 if (
   isProtectedUser(
    selectedUser
   )
 ) {

   toast.error(

    `${selectedUser.role} role cannot be changed`

   )

   return
 }

 try {

   const res = await fetch(

    `/api/users/${selectedUser._id}`,

    {

      method:"PATCH",

      headers:{

       "Content-Type":

       "application/json"

      },

      body:JSON.stringify({

       role:selectedRole

      })

    }
   )

   const data =
   await res.json()

   if(data.success){

     toast.success(

      "Role updated successfully"

     )

     setSelectedUser(null)

     fetchUsers()

   }else{

     toast.error(

      data.message

     )
   }

 }catch{

   toast.error(

    "Role update failed"

   )
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
            <span className="font-medium text-brand-green">
              Active
            </span>
          ) : (
            <span className="font-medium text-destructive">
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
              className="rounded bg-primary p-2 text-primary-foreground"
            >
              <UserCog size={16} />
            </button>

            <button
             onClick={() =>
  toggleUserStatus(
    params.data
  )
}
              className="rounded bg-warning p-2 text-foreground"
            >
              <Shield size={16} />
            </button>

            <button
              onClick={() =>
                deleteUser(
                  params.data
                )
              }
              className="rounded bg-destructive p-2 text-destructive-foreground"
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
          <h1 className="text-4xl font-bold text-foreground">
            User Management
          </h1>

          <p className="text-muted-foreground">
            Manage CRM Users
          </p>
        </div>

        <Link
          href="/admin/users/create"
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-primary-foreground hover:bg-primary hover:text-primary-foreground"
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
        className="w-full rounded-xl border border-border bg-card p-4 text-foreground"
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
        <DialogContent className="bg-card text-foreground">
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
              className="w-full rounded-xl bg-primary py-3 text-primary-foreground"
            >
              Update Role
            </button>

          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
function isProtectedUser(user: any) {
  return (
    user?.role === "admin" ||
    user?.role === "super_admin"
  )
}