"use client"

import { useCallback, useEffect, useState } from "react"

export function useBrowserPermission() {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("unsupported")
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) setPermission(Notification.permission)
  }, [])
  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return "unsupported" as const
    const result = await Notification.requestPermission()
    setPermission(result)
    return result
  }, [])
  return { permission, requestPermission }
}
