"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCheck, RefreshCw, X } from "lucide-react"
import type { ClientNotification } from "@/notification/hooks/useNotifications"
import { NotificationItem } from "./NotificationItem"
import { NotificationSkeleton } from "./NotificationSkeleton"
import { NotificationEmptyState } from "./NotificationEmptyState"

type Props = { open: boolean; close: () => void; items: ClientNotification[]; loading: boolean; error: boolean; markRead: (id: string) => Promise<void>; markAllRead: () => Promise<void>; remove: (id: string) => Promise<void>; refresh: () => Promise<void> }

export function NotificationDropdown({ open, close, items, loading, error, markRead, markAllRead, remove, refresh }: Props) {
  return <AnimatePresence>{open && <motion.div initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={{ duration: 0.16 }} className="absolute right-0 top-12 z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-background/95 shadow-2xl shadow-black/50 backdrop-blur-xl" role="dialog" aria-label="Notifications">
    <div className="flex items-center justify-between border-b border-border px-4 py-3"><div><p className="font-semibold text-foreground">Notifications</p><p className="text-xs text-muted-foreground">Latest CRM activity</p></div><div className="flex gap-1"><button type="button" aria-label="Refresh notifications" onClick={() => void refresh()} className="rounded-lg p-2 text-muted-foreground hover:bg-card/10 hover:text-foreground"><RefreshCw className="h-4 w-4" /></button><button type="button" aria-label="Close notifications" onClick={close} className="rounded-lg p-2 text-muted-foreground hover:bg-card/10 hover:text-foreground"><X className="h-4 w-4" /></button></div></div>
    {items.some((item) => !item.isRead) && <button type="button" onClick={() => void markAllRead()} className="flex w-full items-center gap-2 border-b border-border px-4 py-2.5 text-left text-xs font-semibold text-highlight-ink hover:bg-card/5"><CheckCheck className="h-4 w-4" />Mark all as read</button>}
    <div className="max-h-[420px] overflow-y-auto">{loading ? <NotificationSkeleton /> : error ? <div className="p-6 text-center text-sm text-muted-foreground">Couldn&apos;t load notifications. <button type="button" onClick={() => void refresh()} className="text-highlight-ink">Retry</button></div> : items.length ? items.map((item) => <NotificationItem key={item._id} item={item} onRead={markRead} onDelete={remove} close={close} />) : <NotificationEmptyState />}</div>
  </motion.div>}</AnimatePresence>
}
