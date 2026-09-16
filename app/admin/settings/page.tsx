import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  return <div className="text-foreground">
    <h1 className="text-4xl font-bold">Settings</h1>
    <p className="mt-3 text-muted-foreground">Manage your account and security preferences.</p>
    <div className="mt-10 grid items-start gap-6 md:grid-cols-2">
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">Admin Profile</h2>
        <dl className="mt-6 space-y-4">
          <div><dt className="text-sm text-muted-foreground">Name</dt><dd className="mt-1 font-medium">{session?.user?.name || "Administrator"}</dd></div>
          <div><dt className="text-sm text-muted-foreground">Email</dt><dd className="mt-1 break-all">{session?.user?.email}</dd></div>
          <div><dt className="text-sm text-muted-foreground">Role</dt><dd className="mt-1 capitalize">{session?.user?.role?.replaceAll("_", " ")}</dd></div>
        </dl>
        <p className="mt-6 text-sm leading-6 text-muted-foreground">Use the sun or moon icon in the toolbar to change your theme. Your choice also applies to the public website on this browser.</p>
      </section>
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold">Change Password</h2>
        <p className="mb-6 mt-2 text-sm text-muted-foreground">Confirm your current password to securely update your account.</p>
        <ChangePasswordForm />
      </section>
    </div>
  </div>
}
