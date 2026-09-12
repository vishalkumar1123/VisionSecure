"use client"

// Add a short licensed asset at /sounds/notification.mp3 to enable audible alerts.
export function playNotificationSound() {
  const sound = new Audio("/sounds/notification.mp3")
  sound.volume = 0.35
  void sound.play().catch(() => undefined)
}
