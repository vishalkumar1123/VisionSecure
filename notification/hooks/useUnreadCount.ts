"use client"

import { useNotifications } from "./useNotifications"

export function useUnreadCount() {
  const { unreadCount, refresh } = useNotifications()
  return { unreadCount, refresh }
}
