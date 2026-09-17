"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export type ClientNotification = {
  _id: string
  title: string
  message: string
  actionUrl?: string
  severity?: "success" | "information" | "warning" | "error"
  referenceId: string
  isRead: boolean
  createdAt: string
}

type NotificationResponse = { items: ClientNotification[]; unreadCount: number }

export function useNotifications(pollMs = 12_000) {
  const [items, setItems] = useState<ClientNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const firstFetch = useRef(true)

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/notifications?limit=10", { cache: "no-store" })
      if (!response.ok) throw new Error("Unable to fetch notifications")
      const data = (await response.json()) as NotificationResponse
      setItems(data.items)
      setUnreadCount(data.unreadCount)
      setError(false)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
      firstFetch.current = false
    }
  }, [])

  useEffect(() => {
    void refresh()
    const timer = window.setInterval(() => void refresh(), pollMs)
    return () => window.clearInterval(timer)
  }, [pollMs, refresh])

  const markRead = useCallback(async (id: string) => {
    const response = await fetch("/api/admin/notifications/read", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    if (!response.ok) throw new Error("Unable to update notification")
    setItems((current) => current.map((item) => item._id === id ? { ...item, isRead: true } : item))
    setUnreadCount((count) => Math.max(0, count - 1))
  }, [])

  const markAllRead = useCallback(async () => {
    const response = await fetch("/api/admin/notifications/read-all", { method: "PATCH" })
    if (!response.ok) throw new Error("Unable to update notifications")
    setItems((current) => current.map((item) => ({ ...item, isRead: true })))
    setUnreadCount(0)
  }, [])

  const remove = useCallback(async (id: string) => {
    const response = await fetch(`/api/admin/notifications/${id}`, { method: "DELETE" })
    if (!response.ok) throw new Error("Unable to delete notification")
    setItems((current) => current.filter((item) => item._id !== id))
  }, [])

  return { items, unreadCount, loading, error, refresh, markRead, markAllRead, remove, isInitialLoad: firstFetch.current }
}
