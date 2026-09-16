"use client"

import { useEffect, useRef, useState } from "react"
import { Bell } from "lucide-react"

import { useNotifications } from "@/notification/hooks/useNotifications"
import { useBrowserPermission } from "@/notification/hooks/useBrowserPermission"
import { showLeadBrowserNotification } from "@/notification/channels/browser/browser-notification.client"
import { playNotificationSound } from "@/notification/channels/browser/sound"
import { NotificationDropdown } from "./NotificationDropdown"

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { items, unreadCount, loading, error, refresh, markRead, markAllRead, remove } = useNotifications()
  const { permission, requestPermission } = useBrowserPermission()
  const knownIds = useRef<Set<string> | null>(null)

  useEffect(() => {
    const unread = items.filter((item) => !item.isRead)
    if (!knownIds.current) {
      knownIds.current = new Set(items.map((item) => item._id))
      return
    }

    const newItems = unread.filter((item) => !knownIds.current?.has(item._id))
    knownIds.current = new Set(items.map((item) => item._id))
    newItems.forEach((item) => {
      if (showLeadBrowserNotification(item.title, item.message, item.referenceId)) playNotificationSound()
    })
  }, [items])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((value) => !value)
          if (permission === "default") void requestPermission()
        }}
        className="relative rounded-xl border border-border bg-card p-2.5 text-foreground transition hover:border-highlight/50 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-highlight"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
        title={permission === "granted" ? "Notifications enabled" : "Enable browser notifications"}
      >
        <Bell className={`h-5 w-5 ${unreadCount ? "animate-[pulse_1s_ease-in-out_1]" : ""}`} />
        {unreadCount > 0 && <span className="absolute -right-2 -top-2 min-w-5 rounded-full bg-highlight px-1 text-center text-xs font-bold leading-5 text-accent-foreground" aria-hidden="true">{unreadCount > 99 ? "99+" : unreadCount}</span>}
      </button>
      {permission === "denied" && (
        <p className="absolute right-0 top-12 z-40 w-64 rounded-lg border border-warning/30 bg-background p-3 text-xs text-warning shadow-xl">
          Browser notifications are blocked. Enable them for this site in your browser settings.
        </p>
      )}
      <span className="sr-only" aria-live="polite">{unreadCount ? `${unreadCount} unread notifications` : "No unread notifications"}</span>
      <NotificationDropdown open={open} close={() => setOpen(false)} items={items} loading={loading} error={error} markRead={markRead} markAllRead={markAllRead} remove={remove} refresh={refresh} />
    </div>
  )
}
