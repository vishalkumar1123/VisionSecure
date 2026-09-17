"use client"
import { useCallback, useEffect, useState } from "react"
import { ArrowLeft, CheckCircle2, Mail, RefreshCw, ShieldCheck, Trash2 } from "lucide-react"
import Link from "next/link"
import Swal from "sweetalert2"
import { configSchema, defaults, EMAIL_EVENTS, canActivate, type ConfigurationInput } from "@/lib/email-config/shared"

type Stored = ConfigurationInput & { usernameConfigured: boolean; passwordConfigured: boolean; status: string; isVerified: boolean; verifiedAt?: string; lastTestedAt?: string; lastTestStatus?: string; lastTestErrorCategory?: string; activatedAt?: string }
type Health = { sentToday: number; pending: number; failed: number; failed24h: number; lastSuccessfulDelivery: string | null; lastFailedDelivery: string | null; encryptionKeyConfigured: boolean }
type Log = { _id: string; eventType: string; entityId: string; subject: string; recipients: string[]; acceptedRecipients: string[]; status: string; attemptCount: number; providerMessageIds: string[]; failureCategory?: string; createdAt: string; sentAt?: string; retryEligible: boolean; nextRetryAt?: string }
const date = (value?: string | null) => value ? new Date(value).toLocaleString() : "Not yet"
const fieldClass = "mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground disabled:opacity-60"
const buttonClass = "shrink-0 whitespace-nowrap rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
const emptyFilters = { status: "", eventType: "", recipient: "", entityId: "", from: "", to: "" }
export function EmailConfigurationPanel() {
  const [form, setForm] = useState<ConfigurationInput>(defaults)
  const [config, setConfig] = useState<Stored | null>(null)
  const [health, setHealth] = useState<Health | null>(null)
  const [canManage, setCanManage] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState("")
  const [error, setError] = useState("")
  const [savedMessage, setSavedMessage] = useState("")
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [recipient, setRecipient] = useState("")
  const [logs, setLogs] = useState<Log[]>([])
  const [filters, setFilters] = useState(emptyFilters)
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [showLogs, setShowLogs] = useState(false)
  const request = async (path = "", method = "GET", body?: unknown) => {
    const response = await fetch(`/api/admin/settings/email${path}`, { method, cache: "no-store", headers: { "Content-Type": "application/json" }, ...(body ? { body: JSON.stringify(body) } : {}) })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || "Email service unavailable")
    return data
  }
  const load = useCallback(async () => {
    try {
      const data = await request()
      setConfig(data.config); setHealth(data.health); setCanManage(data.canManage)
      const normal = Object.fromEntries(Object.keys(defaults).map(key => [key, data.config?.[key] ?? defaults[key as keyof ConfigurationInput]])) as ConfigurationInput
      setForm({ ...normal, username: data.config?.usernameConfigured ? "" : "info@visionsecuretech.in", password: "", freshCredentialConfirmed: false }); setDirty(false)
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to load configuration") }
    finally { setLoading(false) }
  }, [])
  const loadLogs = useCallback(async () => {
    try { const data = await request(`/logs?${new URLSearchParams({ ...appliedFilters, page: String(page) })}`); setLogs(data.items); setPages(Math.max(1, data.pages)) }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to load logs") }
  }, [appliedFilters, page])
  useEffect(() => { void load() }, [load])
  useEffect(() => { if (showLogs) void loadLogs() }, [showLogs, loadLogs])
  const update = <K extends keyof ConfigurationInput>(key: K, value: ConfigurationInput[K]) => { setForm(current => ({ ...current, [key]: value })); setDirty(true); setSavedMessage(""); setValidationErrors(current => { const next = { ...current }; delete next[key]; return next }) }
  const action = async (name: string, path = `/${name}`) => {
    if (busy) return
    if (name === "save") {
      const parsed = configSchema.safeParse(form)
      if (!parsed.success) {
        setValidationErrors(Object.fromEntries(parsed.error.issues.map(issue => [String(issue.path[0]), issue.message])))
        setError("Please correct the highlighted configuration fields before saving.")
        document.getElementById("email-validation")?.scrollIntoView({ behavior: "smooth", block: "center" })
        return
      }
      setValidationErrors({})
    }
    const messages: Record<string, string> = {
      save: "Save this draft? Notifications will pause and verification plus a new test will be required.",
      verify: "Test this saved SMTP connection? Existing activation will be reset; verification alone sends no email.",
      test: `Send one test message to each of the ${form.recipients.length} saved recipients? Check their inboxes before activation.`,
      activate: "Have you confirmed the test email in every recipient inbox? Activate production email notifications?",
      disable: "Disable future email notifications? An email already being sent may still complete.",
      process: "Process up to five pending email notifications using the active configuration?",
      retry: "Retry this failed email for recipients who have not already accepted it?",
    }
    const confirmation = await Swal.fire({ title: name === "save" ? "Save as draft?" : `${name.charAt(0).toUpperCase() + name.slice(1)} email service?`, text: messages[name], icon: "question", showCancelButton: true, focusCancel: true, confirmButtonText: "Continue" })
    if (!confirmation.isConfirmed) return
    setBusy(name); setError("")
    try {
      const result = await request(name === "save" ? "" : path, name === "save" ? "PUT" : "POST", name === "save" ? form : undefined)
      await load(); if (showLogs) await loadLogs()
      setSavedMessage(name === "save" ? "Configuration saved securely as a draft. Next: test the SMTP connection. Notifications are not active yet." : name === "verify" ? "Connection verified. Next: send a test email to every recipient." : name === "test" ? "Test email accepted by SMTP. Confirm receipt in each inbox, then activate notifications." : name === "activate" ? "Notifications are now active for the selected events." : name === "disable" ? "Notifications are disabled. Your saved configuration is preserved." : "Delivery logs have been updated.")
      const failedRetry = name === "retry" && result.status !== "sent"
      await Swal.fire({ title: failedRetry ? "Retry needs attention" : "Action completed", text: name === "test" ? "SMTP accepted the test for every recipient. Confirm actual inbox delivery before activation." : failedRetry ? `Result: ${result.status}. Review the delivery log.` : "Email service details have been updated.", icon: failedRetry ? "warning" : "success" })
    } catch (e) { setError(e instanceof Error ? e.message : "Action failed"); if (name !== "save") await load() }
    finally { setBusy("") }
  }
  const status = busy === "verify" ? "VERIFYING" : config?.status || "NOT_CONFIGURED"
  const tone = ["ACTIVE", "VERIFIED", "TEST_EMAIL_SENT"].includes(status) ? "bg-success/10 text-success" : status === "ERROR" ? "bg-destructive/10 text-destructive" : ["SAVED_NOT_VERIFIED", "VERIFYING"].includes(status) ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"
  if (loading) return <p role="status" className="p-8">Loading email configuration...</p>
  return <div className="mx-auto max-w-6xl space-y-7 pb-12 text-foreground">
    <Link href="/admin/settings" className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft size={16} />Settings</Link>
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-bold">Email Configuration</h1><p className="mt-2 text-muted-foreground">Configure, verify and monitor website notification emails.</p></div><div className="flex flex-wrap items-center gap-3"><span className={`rounded-full px-4 py-2 text-sm font-semibold ${tone}`}>{status.replaceAll("_", " ")}</span><button className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none" disabled={!canManage || !!busy || !health?.encryptionKeyConfigured} onClick={() => void action("save")}>{busy === "save" ? "Saving..." : "Save Configuration"}</button></div></div>
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Email setup progress">{[["1", "Save details", !!config?.smtpHost], ["2", "Verify connection", !!config?.isVerified], ["3", "Send test email", config?.lastTestStatus === "success"], ["4", "Activate", status === "ACTIVE"]].map(([number, label, complete]) => <div key={String(number)} className={`flex items-center gap-3 rounded-xl border p-4 text-sm ${complete ? "border-success/30 bg-success/5" : "border-border bg-card"}`}><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${complete ? "bg-success text-white" : "bg-muted"}`}>{complete ? <CheckCircle2 size={17} /> : number}</span><span>{label}</span></div>)}</section>
    <div id="email-validation" aria-live="polite">{Object.keys(validationErrors).length > 0 && <ul className="list-inside list-disc rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{Object.entries(validationErrors).map(([field,message]) => <li key={field}><strong>{field.replace(/([A-Z])/g, " $1")}: </strong>{message}</li>)}</ul>}</div>
    {savedMessage && <p role="status" className="flex items-start gap-3 rounded-xl border border-success/30 bg-success/10 p-4 text-sm text-success"><CheckCircle2 className="shrink-0" size={20} />{savedMessage}</p>}
    {error && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive">{error.replaceAll("_", " ")}</p>}
    {!canManage && <p className="rounded-xl bg-muted p-4">Read-only access. Only a super-admin can change, test, activate or retry email delivery.</p>}
    {health && !health.encryptionKeyConfigured && <p className="rounded-xl bg-warning/10 p-4 text-warning">The server encryption key is not configured. Ask the server operator to set EMAIL_CONFIG_ENCRYPTION_KEY before saving credentials. Never enter this key here.</p>}
    <section className="rounded-2xl border border-border bg-card p-6"><h2 className="flex items-center gap-2 text-xl font-bold"><ShieldCheck size={22} />Email service status</h2><dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {[["Provider", config?.provider || "Not configured"], ["From", config?.fromEmail || "Not configured"], ["Recipients", config?.recipients?.length || 0], ["Service", status === "ACTIVE" ? "Active" : "Inactive"], ["Last verified", date(config?.verifiedAt)], ["Last test email", date(config?.lastTestedAt)], ["Last successful delivery", date(health?.lastSuccessfulDelivery)], ["Last failed delivery", date(health?.lastFailedDelivery)], ["Sent today (UTC)", health?.sentToday || 0], ["Pending", health?.pending || 0], ["Failed / uncertain", health?.failed || 0], ["Failures in 24 hours", health?.failed24h || 0]].map(([label, value]) => <div key={label}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 break-words text-sm font-semibold">{value}</dd></div>)}
    </dl><p className="mt-5 text-xs text-muted-foreground">Sent means accepted by the SMTP provider, not confirmed inbox delivery. This panel uses stored health data and does not connect to SMTP when opened.</p></section>
    <fieldset disabled={!canManage || !!busy} className="space-y-7 disabled:opacity-80">
    <section className="rounded-2xl border border-border bg-card p-6"><h2 className="text-xl font-bold">SMTP configuration</h2><div className="mt-5 grid gap-5 md:grid-cols-2">
      <label className="text-sm">Provider preset<select className={fieldClass} value={form.provider} onChange={e => { setForm(current => ({ ...current, provider: e.target.value as ConfigurationInput["provider"], ...(e.target.value === "Zoho Mail India" ? { smtpHost: "smtp.zoho.in", smtpPort: 465, encryption: "SSL", secure: true, requireTLS: false, authRequired: true } : {}) })); setDirty(true) }}><option>Zoho Mail India</option><option>Custom SMTP</option></select></label>
      <label className="text-sm">Encryption mode<select className={fieldClass} value={form.encryption} onChange={e => { const ssl = e.target.value === "SSL"; setForm(current => ({ ...current, encryption: ssl ? "SSL" : "STARTTLS", smtpPort: ssl ? 465 : 587, secure: ssl, requireTLS: !ssl })); setDirty(true) }}><option value="SSL">SSL / TLS - port 465</option><option value="STARTTLS">STARTTLS - port 587</option></select></label>
      {([['smtpHost', 'SMTP host'], ['fromName', 'From name'], ['fromEmail', 'From email'], ['replyTo', 'Reply-to email']] as const).map(([key,label]) => <label key={key} className="text-sm">{label}<input type={key.includes("Email") || key === "replyTo" ? "email" : "text"} className={`${fieldClass} ${validationErrors[key] ? "border-destructive" : ""}`} aria-invalid={!!validationErrors[key]} value={form[key]} onChange={e => update(key,e.target.value)} /></label>)}
      <label className="text-sm">SMTP port<input className={fieldClass} readOnly value={form.smtpPort} /></label>
      <div className="flex flex-wrap items-center gap-4 text-sm"><label><input type="checkbox" checked={form.secure} readOnly disabled /> Secure connection</label><label><input type="checkbox" checked={form.requireTLS} readOnly disabled /> Require TLS</label><label><input type="checkbox" checked={form.authRequired} onChange={e => update("authRequired",e.target.checked)} disabled={form.provider === "Zoho Mail India"} /> Authentication required</label></div>
      <label className="text-sm">SMTP username<input autoComplete="off" className={fieldClass} value={form.username} placeholder={config?.usernameConfigured ? "Configured - leave blank to preserve" : "Enter SMTP username"} onChange={e => update("username",e.target.value)} /></label>
      <label className="text-sm">New SMTP password / app password<input type="password" autoComplete="new-password" className={fieldClass} value={form.password} placeholder={config?.passwordConfigured ? "••••••••••••" : "Enter a new app password"} onChange={e => update("password",e.target.value)} /><span className="mt-2 block text-xs text-muted-foreground">Write-only. Blank preserves the saved secret. The existing secret is never loaded into this form.</span></label>
      {form.password && <label className="flex gap-3 text-sm md:col-span-2"><input type="checkbox" checked={form.freshCredentialConfirmed} onChange={e => update("freshCredentialConfirmed",e.target.checked)} />I have changed the mailbox password or created a new app password. This is not the previously exposed credential.</label>}
    </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
        <div className="text-sm" id="smtp-save-help"><p className="font-semibold">Save your email settings</p><p className="mt-1 text-muted-foreground">Saves these SMTP details, recipients and event preferences as a draft.</p><p className="mt-1 text-muted-foreground">{!canManage ? "Only a super-admin can save changes." : !health?.encryptionKeyConfigured ? "Saving is unavailable until the server operator configures EMAIL_CONFIG_ENCRYPTION_KEY." : "After saving, test the connection, send a test email, then activate notifications."}</p></div>
        <button type="button" aria-describedby="smtp-save-help" className="w-full rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none sm:w-auto" disabled={!canManage || !!busy || !health?.encryptionKeyConfigured} onClick={() => void action("save")}>{busy === "save" ? "Saving securely..." : "Save SMTP Configuration"}</button>
      </div>
    </section>
    <section className="rounded-2xl border border-border bg-card p-6"><h2 className="text-xl font-bold">Notification recipients</h2><p className="mt-2 text-sm text-muted-foreground">Each recipient receives their own email. At least one recipient is required; maximum ten.</p><div className="mt-5 flex flex-wrap gap-2">{form.recipients.map(email => <span key={email} className="inline-flex items-center gap-3 rounded-full border border-border bg-background px-4 py-2 text-sm">{email}<button type="button" aria-label={`Remove ${email}`} onClick={() => update("recipients",form.recipients.filter(value => value !== email))}><Trash2 size={14} /></button></span>)}</div><div className="mt-4 flex gap-3"><input aria-label="Add recipient email" type="email" className={fieldClass} placeholder="name@example.com" value={recipient} onChange={e => setRecipient(e.target.value)} /><button className={buttonClass} type="button" onClick={() => { const value = recipient.trim().toLowerCase(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { setError("Enter a valid recipient email."); return } update("recipients", [...new Set([...form.recipients,value])]); setRecipient("") }}>Add</button></div></section>
    <section className="rounded-2xl border border-border bg-card p-6"><h2 className="text-xl font-bold">Notification events</h2><p className="mt-2 text-sm text-muted-foreground">Email only meaningful business and security events. Modules that are not yet part of the application require their event producer to be connected.</p><div className="mt-5 grid gap-4 md:grid-cols-2">{Object.entries(EMAIL_EVENTS).map(([key,label]) => <label key={key} className="flex items-start gap-3 rounded-lg border border-border p-3 text-sm"><input type="checkbox" className="mt-1 accent-green-600" checked={form.eventSettings[key as keyof typeof EMAIL_EVENTS]} onChange={e => update("eventSettings",{ ...form.eventSettings, [key]: e.target.checked })} />{label}</label>)}</div><label className="mt-6 block max-w-xs text-sm">Failure alert threshold (24 hours)<input type="number" min={1} max={100} className={fieldClass} value={form.failureThreshold} onChange={e => update("failureThreshold", Number(e.target.value))} /></label></section>
    </fieldset>
    {dirty && <p className="text-sm text-warning">Unsaved changes. Save a draft before testing or activating.</p>}
    <div className="sticky bottom-0 z-30 flex flex-nowrap gap-3 overflow-x-auto sm:flex-wrap rounded-2xl border border-border bg-background/95 p-4 shadow-xl backdrop-blur-md" aria-busy={!!busy}>
      <p className="hidden w-full text-xs text-muted-foreground sm:block">{dirty ? "You have unsaved changes. Save your details first." : config?.smtpHost ? "Your settings are saved. Follow the setup steps to enable notifications." : "Enter your SMTP details, then save a draft to begin."}</p>
      <button className={`${buttonClass} bg-accent text-accent-foreground`} disabled={!canManage || !!busy || !health?.encryptionKeyConfigured} onClick={() => void action("save")}>{busy === "save" ? "Saving securely..." : dirty || !config?.smtpHost ? "Save as Draft" : "Save Changes as Draft"}</button>
      <button className={buttonClass} disabled={!canManage || !!busy || dirty || !config?.smtpHost} onClick={() => void action("verify")}>Test Connection</button>
      <button className={buttonClass} disabled={!canManage || !!busy || dirty || !config?.isVerified || !["VERIFIED", "TEST_EMAIL_SENT", "ACTIVE", "DISABLED"].includes(status)} onClick={() => void action("test")}>Send Test Email</button>
      <button className={buttonClass} disabled={!canManage || !!busy || dirty || !config || !canActivate(config) || status === "ACTIVE"} onClick={() => void action("activate")}>Activate Notifications</button>
      <button className={buttonClass} disabled={!canManage || !!busy || !config || status === "DISABLED"} onClick={() => void action("disable")}>Disable Notifications</button>
      <button className={buttonClass} disabled={!canManage || !!busy || dirty || status !== "ACTIVE" || !health?.pending} onClick={() => void action("process")}>Process Pending Emails</button>
      <button className={buttonClass} onClick={() => setShowLogs(value => !value)}>View Delivery Logs</button>
      <button className={buttonClass} onClick={() => { setFilters({ ...emptyFilters, status: "failed" }); setAppliedFilters({ ...emptyFilters, status: "failed" }); setPage(1); setShowLogs(true) }}>Retry Failed Notifications</button>
      {busy && <span role="status" className="flex items-center gap-2 text-sm"><RefreshCw className="animate-spin" size={16} />{busy} in progress...</span>}
    </div>
    {showLogs && <section className="rounded-2xl border border-border bg-card p-6"><h2 className="flex items-center gap-2 text-xl font-bold"><Mail size={22} />Delivery logs</h2><form className="my-5 grid gap-3 sm:grid-cols-3" onSubmit={e => { e.preventDefault(); setPage(1); setAppliedFilters({ ...filters }) }}>
      <label className="text-xs">Status<select className={fieldClass} value={filters.status} onChange={e => setFilters({ ...filters,status:e.target.value })}><option value="">All statuses</option>{["sent","pending","failed","skipped","uncertain"].map(value => <option key={value}>{value}</option>)}</select></label>
      <label className="text-xs">Event<select className={fieldClass} value={filters.eventType} onChange={e => setFilters({ ...filters,eventType:e.target.value })}><option value="">All events</option><option value="test">Test email</option>{Object.entries(EMAIL_EVENTS).map(([key,label]) => <option key={key} value={key}>{label}</option>)}</select></label>
      {([['recipient','Recipient email','email'],['entityId','Entity ID','text'],['from','From date (UTC)','date'],['to','To date (UTC)','date']] as const).map(([key,label,type]) => <label className="text-xs" key={key}>{label}<input type={type} className={fieldClass} value={filters[key]} onChange={e => setFilters({ ...filters,[key]:e.target.value })} /></label>)}<button className={buttonClass}>Apply filters</button><button type="button" className={buttonClass} onClick={() => void loadLogs()}>Refresh logs</button>
    </form><div className="overflow-x-auto"><table className="w-full min-w-[1000px] text-left text-xs"><thead><tr>{["Date / event","Subject / entity","Recipients","Status / attempts","Message IDs / sent time","Failure","Action"].map(label => <th key={label} className="border-b border-border p-3">{label}</th>)}</tr></thead><tbody>{logs.map(log => <tr key={log._id}><td className="border-b border-border p-3">{date(log.createdAt)}<br />{log.eventType}</td><td className="max-w-52 break-words border-b border-border p-3">{log.subject}<br />{log.entityId}</td><td className="border-b border-border p-3">{log.recipients.join(", ")}<br />Accepted: {log.acceptedRecipients.length}</td><td className="border-b border-border p-3">{log.status} / {log.attemptCount}</td><td className="max-w-48 break-all border-b border-border p-3">{log.providerMessageIds.join(", ") || "No message sent"}<br />{date(log.sentAt)}</td><td className="border-b border-border p-3">{log.failureCategory === "EMAIL_SERVICE_NOT_ACTIVE" ? "Skipped: email service was inactive. Save, verify, test and activate settings for future alerts." : log.failureCategory || "None"}</td><td className="border-b border-border p-3"><button className={buttonClass} disabled={!canManage || !!busy || dirty || status !== "ACTIVE" || log.status !== "failed" || !log.retryEligible || log.eventType === "test" || (!!log.nextRetryAt && new Date(log.nextRetryAt).getTime() > Date.now())} onClick={() => void action("retry", `/logs/${log._id}/retry`)}>Retry</button></td></tr>)}</tbody></table></div>{!logs.length && <p className="p-8 text-center text-muted-foreground">No matching email deliveries.</p>}<div className="mt-4 flex items-center justify-between"><button className={buttonClass} disabled={page <= 1} onClick={() => setPage(value => value - 1)}>Previous</button><span className="text-sm">Page {page} of {pages}</span><button className={buttonClass} disabled={page >= pages} onClick={() => setPage(value => value + 1)}>Next</button></div><p className="mt-4 text-xs text-muted-foreground">Retries use backoff and stop after three attempts. Uncertain deliveries are never automatically retried because the provider may already have accepted them.</p></section>}
    <p className="flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 size={16} />SMTP credentials are encrypted on the server and are never returned by this page API.</p>
  </div>
}
