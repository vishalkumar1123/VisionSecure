export function NotificationSkeleton() {
  return <div className="space-y-3 p-3" aria-label="Loading notifications">{[0, 1, 2].map((item) => <div key={item} className="h-16 animate-pulse rounded-xl bg-card/5" />)}</div>
}
