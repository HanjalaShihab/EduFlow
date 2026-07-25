import React, { useState } from "react"

interface NotificationItem {
  id: number
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  read: boolean
  created_at: string
}

const sampleNotifications: NotificationItem[] = [
  { id: 1, title: "New Institution Registered", message: "Springfield University has registered on the platform.", type: "info", read: false, created_at: "2024-01-15T10:30:00" },
  { id: 2, title: "Suspicious Activity Detected", message: "Multiple failed login attempts detected from IP 192.168.1.100", type: "warning", read: false, created_at: "2024-01-14T14:20:00" },
  { id: 3, title: "System Update Complete", message: "Platform has been updated to version 2.4.1", type: "success", read: false, created_at: "2024-01-13T09:15:00" },
  { id: 4, title: "Backup Failed", message: "Scheduled backup for Riverside College failed due to insufficient storage.", type: "error", read: true, created_at: "2024-01-12T08:00:00" },
  { id: 5, title: "Subscription Expiring", message: "Tech Institute subscription will expire in 7 days.", type: "warning", read: true, created_at: "2024-01-11T16:45:00" },
  { id: 6, title: "New Support Ticket", message: "Greenwood School has opened a new support ticket.", type: "info", read: true, created_at: "2024-01-10T11:30:00" },
]

const typeStyles: Record<string, string> = {
  info: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  warning: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  success: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  error: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
}

const typeIcons: Record<string, string> = {
  info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  warning: "M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  error: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(sampleNotifications)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const filtered = filter === "all" ? notifications : notifications.filter((n) => !n.read)
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage system notifications and alerts</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
            {unreadCount} Unread
          </span>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium">
              Mark all as read
            </button>
          )}
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "unread")}
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((notification) => (
          <div
            key={notification.id}
            className={"bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-4 transition-colors cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 " +
              (notification.read ? "border-gray-200 dark:border-gray-700" : "border-purple-300 dark:border-purple-700")}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="flex items-start gap-3">
              <div className={"flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center " + typeStyles[notification.type]}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={typeIcons[notification.type]} />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={"text-sm font-medium " + (notification.read ? "text-gray-700 dark:text-gray-300" : "text-gray-900 dark:text-white")}>
                    {notification.title}
                  </p>
                  {!notification.read && <span className="w-2 h-2 rounded-full bg-purple-500" />}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(notification.created_at).toLocaleString()}</p>
              </div>
              <span className={"inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize " + typeStyles[notification.type]}>
                {notification.type}
              </span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-gray-500 py-12">No notifications found</div>
        )}
      </div>
    </div>
  )
}