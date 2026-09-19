import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  return <div className="text-foreground">
    <h1 className="text-4xl font-bold">Settings</h1>
    <p className="mt-3 text-muted-foreground">Manage your account and security preferences.</p>
    <Link href="/admin/settings/email" className="mt-8 inline-flex rounded-xl bg-accent px-5 py-3 font-semibold text-accent-foreground">Email Configuration</Link>
    <Link href="/admin/settings/integrations" className="ml-3 mt-3 inline-flex rounded-xl border border-border bg-card px-5 py-3 font-semibold">Google Integrations</Link>
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
        <h2 className="text-2xl font-semibold">User Passwords</h2>
        <p className="mb-6 mt-2 text-sm text-muted-foreground">Manage passwords from the key icon in each user's Actions column.</p>
        <Link href="/admin/users" className="inline-flex rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground hover:bg-brand-hover">Go to Users</Link>
      </section>
    </div>
  </div>
}
