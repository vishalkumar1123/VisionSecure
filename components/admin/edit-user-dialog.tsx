"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { useState } from "react"

import Swal from "sweetalert2"

export default function EditUserDialog({
  open,
  onClose,
  user,
  refreshUsers,
}: any) {

  const [role, setRole] =
    useState(user?.role)

  const [isActive, setIsActive] =
    useState(user?.isActive)

  async function updateUser() {

    const res = await fetch(
      `/api/users/${user._id}`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          role,
          isActive,
        }),
      }
    )

    const data = await res.json()

    if (data.success) {

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "User updated successfully",
      })

      refreshUsers()

      onClose()

    } else {

      Swal.fire({
        icon: "error",
        title: "Error",
        text: data.error,
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >

      <DialogContent className="border-white/10 bg-zinc-950 text-white">

        <DialogHeader>
          <DialogTitle>
            Edit User
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">

          <div>

            <label className="mb-2 block text-sm">
              Role
            </label>

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-zinc-900 p-3"
            >
              <option value="admin">
                Admin
              </option>

              <option value="manager">
                Manager
              </option>

              <option value="technician">
                Technician
              </option>

              <option value="sales">
                Sales
              </option>
            </select>

          </div>

          <div>

            <label className="mb-2 block text-sm">
              Status
            </label>

            <select
              value={
                isActive
                  ? "active"
                  : "disabled"
              }
              onChange={(e) =>
                setIsActive(
                  e.target.value ===
                    "active"
                )
              }
              className="w-full rounded-xl border border-white/10 bg-zinc-900 p-3"
            >
              <option value="active">
                Active
              </option>

              <option value="disabled">
                Disabled
              </option>
            </select>

          </div>

          <button
            onClick={updateUser}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold hover:bg-blue-700"
          >
            Update User
          </button>

        </div>

      </DialogContent>

    </Dialog>
  )
}