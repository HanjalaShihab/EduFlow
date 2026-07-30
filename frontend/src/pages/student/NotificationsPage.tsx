import React, { useState, useEffect } from 'react'
import { cn, formatDateTime } from '../../lib/utils'

interface Notification {
  id: number
  type: 'attendance' | 'academic' | 'system' | 'reminder'
  title: string
  message: string
  read_at: string | null
  created_at: string
}

const mockNotifications: Notification[] = [
  { id: 1, type: 'attendance', title: 'Attendance Recorded', message: 'Your attendance for Mathematics 101 has been recorded successfully.', read_at: null, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, type: 'reminder', title: 'Upcoming Session', message: 'Physics 101 session starts in 30 minutes. Don\'t forget to mark attendance!', read_at: null, created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 3, type: 'attendance', title: 'Late Arrival', message: 'You were marked late for Computer Science class.', read_at: new Date(Date.now() - 86400000).toISOString(), created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: 4, type: 'academic', title: 'New Course Material', message: 'New study material has been uploaded for Mathematics 101.', read_at: null, created_at: new Date(Date.now() - 259200000).toISOString() },
  { id: 5, type: 'system', title: 'Account Update', message: 'Your profile has been updated successfully.', read_at: new Date(Date.now() - 345600000).toISOString(), created_at: new Date(Date.now() - 432000000).toISOString() },
  { id: 6, type: 'attendance', title: 'Manual Review Required', message: 'Your attendance for History class on Friday requires manual review.', read_at: null, created_at: new Date(Date.now() - 604800000).toISOString() },
  { id: 7, type: 'system', title: 'Institution Announcement', message: 'The institution will remain closed on Monday for a public holiday.', read_at: null, created_at: new Date(Date.now() - 1209600000).toISOString() },
  { id: 8, type: 'reminder', title: 'Face Enrollment Reminder', message: 'Please update your face data for the upcoming semester.', read_at: new Date(Date.now() - 1814400000).toISOString(), created_at: new Date(Date.now() - 2419200000).toISOString() },
]

const notificationIcons: Record<string, string> = {
  attendance: '📋',
  academic: '📚',
  system: '⚙️',
  reminder: '⏰',
}

const notificationColors: Record<string, string> = {
  attendance: 'bg-blue-100 dark:bg-blue-900/30',
  academic: 'bg-green-100 dark:bg-green-900/30',
  system: 'bg-gray-100 dark:bg-gray-700',
  reminder: 'bg-amber-100 dark:bg-amber-900/30',
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'read' | 'unread' | 'attendance' | 'academic' | 'system'>('all')

  const getFilteredNotifications = () => {
    if (filter === 'all') return notifications
    if (filter === 'read') return notifications.filter(n => n.read_at !== null)
    if (filter === 'unread') return notifications.filter(n => n.read_at === null)
    return notifications.filter(n => n.type === filter)
  }

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
    )
  }

  const unreadCount = notifications.filter(n => !n.read_at).length

  const filteredNotifications = getFilteredNotifications()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification(s)` : 'No unread notifications'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'unread', 'read', 'attendance', 'academic', 'system'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize',
              filter === f
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            )}
          >
            {f}
            {f === 'unread' && unreadCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-white/20">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Notifications</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">No notifications match your current filter.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map(notification => (
            <div
              key={notification.id}
              onClick={() => !notification.read_at && markAsRead(notification.id)}
              className={cn(
                'flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer',
                notification.read_at
                  ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  : 'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800'
              )}
            >
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0', notificationColors[notification.type])}>
                {notificationIcons[notification.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={cn('text-sm font-medium truncate', notification.read_at ? 'text-gray-900 dark:text-white' : 'text-purple-900 dark:text-purple-100')}>
                    {notification.title}
                  </h4>
                  {!notification.read_at && (
                    <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {formatDateTime(notification.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
