"use client"

import Link from "next/link"
import { BellRing, Check, Trash2 } from "lucide-react"
import { timeAgo } from "@/notification/utils/time-ago"
import type { ClientNotification } from "@/notification/hooks/useNotifications"

export function NotificationItem({ item, onRead, onDelete, close }: { item: ClientNotification; onRead: (id: string) => Promise<void>; onDelete: (id: string) => Promise<void>; close: () => void }) {
  const open = async () => { if (!item.isRead) await onRead(item._id); close() }
  return <div className={`group border-b border-white/5 p-4 transition hover:bg-white/5 ${item.isRead ? "opacity-70" : "bg-cyan-500/5"}`}>
    <div className="flex gap-3"><BellRing className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" /><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="font-medium text-white">{item.title}</p>{!item.isRead && <span className="h-2 w-2 rounded-full bg-cyan-400" aria-label="Unread" />}</div><p className="mt-1 text-sm text-zinc-400">{item.message}</p><p className="mt-2 text-xs text-zinc-500">{timeAgo(item.createdAt)}</p><div className="mt-3 flex items-center gap-3 text-xs"><Link href={`/admin/leads/${encodeURIComponent(item.referenceId)}`} onClick={() => void open()} className="font-semibold text-cyan-300 hover:text-cyan-200">Open lead</Link>{!item.isRead && <button type="button" onClick={() => void onRead(item._id)} className="inline-flex items-center gap-1 text-zinc-400 hover:text-white"><Check className="h-3.5 w-3.5" />Read</button>}<button type="button" aria-label="Delete notification" onClick={() => void onDelete(item._id)} className="ml-auto text-zinc-500 hover:text-red-300"><Trash2 className="h-3.5 w-3.5" /></button></div></div></div>
  </div>
}
