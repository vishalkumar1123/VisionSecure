import { Bell } from "lucide-react"

export function NotificationEmptyState() {
  return <div className="px-6 py-12 text-center text-zinc-400"><Bell className="mx-auto mb-3 h-8 w-8 text-cyan-300" /><p className="font-medium text-white">You&apos;re all caught up!</p><p className="mt-1 text-sm">No new notifications.</p></div>
}
