"use client"
import { useRef, useState } from "react"
import { button, field } from "@/components/admin/customer-center/shared"
export default function WhatsAppTestSend() {
  const [recipient, setRecipient] = useState(""), [confirmed, setConfirmed] = useState(false), [busy, setBusy] = useState(false), [notice, setNotice] = useState("")
  const key = useRef("")
  return <form className="space-y-3" onSubmit={async event => {
    event.preventDefault()
    if (!confirmed || !window.confirm(`Send one VisionSecure test message to +${recipient}?`)) return
    setBusy(true); setNotice("")
    try {
      key.current ||= crypto.randomUUID()
      const response = await fetch("/api/admin/integrations/meta/test-send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ recipient, confirmed, key: key.current }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "TEST_SEND_UNAVAILABLE")
      setNotice(`Test delivery status: ${result.status}. Verify receipt on your test phone.`)
    } catch (error) { setNotice((error as Error).message.replaceAll("_", " ")) } finally { setBusy(false) }
  }}><p>First send an inbound message from your own test phone and take over that conversation in Inbox. A recent inbound message and your active assignment are required.</p><label className="grid gap-2">Test recipient (country code and digits)<input className={field} inputMode="tel" required pattern="[1-9][0-9]{7,14}" maxLength={15} value={recipient} onChange={e => { setRecipient(e.target.value); setConfirmed(false); key.current = "" }}/></label><label className="flex items-start gap-2"><input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)}/><span>I confirm this is my test number and authorize one test message.</span></label><button className={button} disabled={busy || !confirmed}>{busy ? "Sending…" : "Send Confirmed Test Message"}</button>{notice && <p role="status" className="break-words">{notice}</p>}</form>
}
