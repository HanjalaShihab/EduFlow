import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { attendanceApi } from '../../../services/api'
import { cn, formatTime, formatDate } from '../../../lib/utils'

interface ActiveSession {
  id: number
  course?: { name: string; code: string }
  teacher?: { name: string }
  section?: { name: string; room?: string }
  department?: { name: string }
  start_time: string
  end_time: string
  attendance_window_minutes: number
  status: string
  room?: string
}

export default function ActiveSessionsPage() {
  const [sessions, setSessions] = useState<ActiveSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await attendanceApi.sessions.active()
        setSessions(res.data?.data || [])
      } catch (err: any) {
        console.error('Failed to fetch active sessions:', err)
        setError('Could not load active sessions. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchSessions()

    // Refresh every 30 seconds
    const interval = setInterval(fetchSessions, 30000)
    return () => clearInterval(interval)
  }, [])

  const getRemainingTime = (endTime: string) => {
    const end = new Date(endTime)
    const now = new Date()
    const diff = end.getTime() - now.getTime()

    if (diff <= 0) return 'Closing soon'

    const minutes = Math.floor(diff / 60000)
    if (minutes < 60) return `${minutes}m remaining`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m remaining`
  }

  const getStatusColor = (endTime: string) => {
    const end = new Date(endTime)
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes <= 0) return 'text-red-600 dark:text-red-400'
    if (minutes < 10) return 'text-amber-600 dark:text-amber-400'
    return 'text-green-600 dark:text-green-400'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-10 w-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 dark:text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Active Sessions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {sessions.length} session(s) available for attendance
          </p>
        </div>
        <Link
          to="/student/attendance/history"
          className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
        >
          View History →
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Active Sessions</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">There are no active attendance sessions right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map(session => (
            <div
              key={session.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {session.course?.name || 'Course'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {session.course?.code} · {session.section?.name}
                  </p>
                </div>
                <span className={cn('text-sm font-semibold whitespace-nowrap', getStatusColor(session.end_time))}>
                  {getRemainingTime(session.end_time)}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{session.teacher?.name || 'Teacher'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{session.room || session.section?.room || 'No room assigned'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{formatDate(session.start_time)} · {formatTime(session.start_time)} - {formatTime(session.end_time)}</span>
                </div>
              </div>

              <Link
                to={`/student/attendance/sessions/${session.id}/mark`}
                className="mt-4 w-full block text-center px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
              >
                Mark Attendance
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
