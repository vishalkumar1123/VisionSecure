"use client"
import { useEffect, useState } from "react"
import { action, api, ErrorNotice, Panel } from "./shared"

type Status = { connected: boolean; accountEmail: string | null; analytics: string; search: string; lastVerifiedAt: string | null; missing: string[]; propertyId: string; siteUrl: string; pagespeed: string }
export default function GoogleConnectCard() {
  const [status, setStatus] = useState<Status | null>(null), [busy, setBusy] = useState(false), [error, setError] = useState(""), [notice, setNotice] = useState("")
  useEffect(() => {
    const controller = new AbortController()
    api<Status>("/api/admin/integrations/google/status", "GET", controller.signal).then(setStatus).catch(e => { if (e.name !== "AbortError") setError(e.message) })
    const result = new URLSearchParams(window.location.search).get("google")
    if (result) { setNotice(({ connected: "Google connected successfully.", partial: "Connected with partial access. Check service permissions below.", consent_denied: "Google consent was cancelled." } as Record<string, string>)[result] || "Connection could not finish. Please reconnect and complete consent within five minutes."); window.history.replaceState(null, "", window.location.pathname) }
    return () => controller.abort()
  }, [])
  async function run(command: string) {
    if (command === "disconnect" && !window.confirm("Disconnect Google Analytics and Search Console for all administrators?")) return
    setBusy(true); setError(""); setNotice("")
    try {
      const result = await api<{ url?: string; revoked?: boolean }>(`/api/admin/integrations/google/${command}`, "POST")
      if (result.url) { window.location.assign(result.url); return }
      if (result.revoked === false) setNotice("Disconnected locally. Google revocation could not be confirmed; remove this app from your Google account permissions if needed.")
      setStatus(await api<Status>("/api/admin/integrations/google/status"))
    } catch (e) { setError((e as Error).message) } finally { setBusy(false) }
  }
  const state = !status?.connected ? "Not connected" : status.analytics === "Connected" && status.search === "Connected" ? "Connected" : status.analytics === "Connected" || status.search === "Connected" ? "Partially connected" : "Needs attention"
  return <Panel title="Google Analytics + Search Console"><div className="space-y-4">
    <p className="text-sm text-muted-foreground">Read-only access to website traffic and search visibility. Your existing admin login remains in use.</p>
    {error && <ErrorNotice error={error}/>} {notice && <p role="status" className="rounded-xl bg-muted p-3 text-sm">{notice}</p>}
    {!status ? <p role="status">Checking connection…</p> : <>
      <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-sm font-semibold">{busy ? "Working…" : state}</span>
      {status.accountEmail && <p className="break-all text-sm">Google account: {status.accountEmail}</p>}
      <dl className="grid gap-4 text-sm sm:grid-cols-2"><div><dt className="text-muted-foreground">Analytics · {status.propertyId}</dt><dd className="mt-1 break-words">{status.analytics}</dd></div><div><dt className="text-muted-foreground">Search Console</dt><dd className="mt-1 break-all">{status.search}<br/>{status.siteUrl}</dd></div><div><dt className="text-muted-foreground">PageSpeed</dt><dd>{status.pagespeed}</dd></div><div><dt className="text-muted-foreground">Last verified</dt><dd>{status.lastVerifiedAt ? new Date(status.lastVerifiedAt).toLocaleString() : "Not checked"}</dd></div></dl>
      {status.missing.length > 0 && <p className="break-words rounded-xl bg-muted p-3 text-sm">Server configuration required: {status.missing.join(", ")}. See GOOGLE_WEBSITE_SERVICES.md.</p>}
      <div className="flex flex-wrap gap-2"><button disabled={busy || status.missing.length > 0} className={action} onClick={() => run("connect")}>{status.connected ? "Reconnect Google" : "Connect Google"}</button>{status.connected && <><button disabled={busy} className={action} onClick={() => run("test")}>Test Connection</button><button disabled={busy} className={action} onClick={() => run("disconnect")}>Disconnect</button></>}</div>
    </>}
  </div></Panel>
}
