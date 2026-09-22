"use client"
import { useState } from "react"
import { action, api, ErrorNotice } from "./shared"
export default function GoogleSignIn() {
  const [busy, setBusy] = useState(false), [error, setError] = useState("")
  return <div><button className={action} disabled={busy} onClick={async () => { setBusy(true); setError(""); try { const data = await api<{ url: string }>("/api/admin/integrations/google/connect", "POST"); window.location.assign(data.url) } catch (e) { if ((e as Error).message === "CONFIGURATION_REQUIRED") window.location.assign("/admin/settings/integrations#google-setup"); else setError((e as Error).message); setBusy(false) } }}>{busy ? "Opening Google…" : "Sign in with Google"}</button>{error && <ErrorNotice error={error}/>}</div>
}
