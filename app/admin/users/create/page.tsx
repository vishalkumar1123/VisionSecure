"use client"

import { useState } from "react"

export default function CreateUserPage() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "sales",
  })

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault()

    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    const data = await response.json()

    if (data.success) {

      alert("User created successfully")

      setFormData({
        name: "",
        email: "",
        mobile: "",
        password: "",
        role: "sales",
      })

    } else {

      alert(data.error)
    }
  }

  return (
    <div className="max-w-2xl">

      <h1 className="mb-8 text-4xl font-bold text-white">
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
          className="w-full rounded-xl bg-zinc-900 p-4 text-white"
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
  className="w-full rounded-xl bg-zinc-900 p-4 text-white"
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
          className="w-full rounded-xl bg-zinc-900 p-4 text-white"
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
          className="w-full rounded-xl bg-zinc-900 p-4 text-white"
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
          className="rounded-xl bg-blue-600 px-6 py-3 text-white"
        >
          Create User
        </button>

      </form>

    </div>
  )
}