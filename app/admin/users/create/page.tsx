"use client"

import { useState } from "react"
import { toast } from "sonner"

export default function CreateUserPage() {
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "sales_executive",
  })

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault()

    if (loading) return
    setLoading(true)
    const notice = toast.loading("Creating user...")
    try {
      const response = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) })
      const data = await response.json().catch(() => null)
      if (!response.ok || !data?.success) throw new Error(data?.error || "Unable to create user.")
      toast.success("User created successfully", { id: notice })
      setFormData({ name: "", email: "", mobile: "", password: "", role: "sales_executive" })
    } catch (failure) { toast.error(failure instanceof Error ? failure.message : "Unable to create user.", { id: notice }) }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl">

      <h1 className="mb-8 text-4xl font-bold text-foreground">
        Create User
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
          className="w-full rounded-xl bg-card p-4 text-foreground"
        />
<input
  type="text"
  placeholder="Mobile Number"
  value={formData.mobile}
  onChange={(e) =>
    setFormData({
      ...formData,
      mobile: e.target.value,
    })
  }
  className="w-full rounded-xl bg-card p-4 text-foreground"
/>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value,
            })
          }
          className="w-full rounded-xl bg-card p-4 text-foreground"
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({
              ...formData,
              password: e.target.value,
            })
          }
          className="w-full rounded-xl bg-card p-4 text-foreground"
        />

       <select
  value={formData.role}
  onChange={(e) =>
    setFormData({
      ...formData,
      role: e.target.value,
    })
  }
>
  <option value="admin">
    Admin
  </option>

  <option value="sales_executive">
    Sales Executive
  </option>

  <option value="technician">
    Technician
  </option>

  <option value="viewer">
    Viewer
  </option>

  <option value="super_admin">
    Super Admin
  </option>
</select>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-primary px-6 py-3 text-primary-foreground"
        >
          {loading ? "Creating..." : "Create User"}
        </button>

      </form>

    </div>
  )
}