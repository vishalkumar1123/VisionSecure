export default function SettingsPage() {

  return (
    <div>

      <h1 className="text-4xl font-bold text-white">
        Settings
      </h1>

      <p className="mt-3 text-zinc-400">
        Manage your CRM settings
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">

        {/* Profile */}
        <div className="rounded-2xl bg-zinc-900 p-6">

          <h2 className="text-2xl font-semibold text-white">
            Admin Profile
          </h2>

          <p className="mt-2 text-zinc-400">
            Update your profile information
          </p>

        </div>

        {/* Password */}
        <div className="rounded-2xl bg-zinc-900 p-6">

          <h2 className="text-2xl font-semibold text-white">
            Change Password
          </h2>

          <p className="mt-2 text-zinc-400">
            Update admin password securely
          </p>

        </div>

      </div>
    </div>
  )
}