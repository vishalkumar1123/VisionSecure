"use client"

export function showLeadBrowserNotification(title: string, message: string, leadId: string) {
  if (!("Notification" in window) || Notification.permission !== "granted") return false

  try {
    const notification = new Notification(title, {
      body: message,
      tag: `lead-${leadId}`,
    })
    notification.onclick = () => {
      window.focus()
      window.location.assign(`/admin/leads/${encodeURIComponent(leadId)}`)
      notification.close()
    }
    return true
  } catch {
    return false
  }
}
