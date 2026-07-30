import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { attendanceApi, dashboardApi } from '../../services/api'
import { cn, formatTime } from '../../lib/utils'

interface DashboardStats {
  overall_percentage: number
  present_count: number
  absent_count: number
  late_count: number
  today_status: string
  total_sessions: number
  pending_reviews: number
  monthly_percentage: number
  semester_percentage: number
  weekly_present: number
  weekly_absent: number
  weekly_total: number
}

interface UpcomingClass {
  id: number
  course_name: string
  teacher_name: string
  start_time: string
  end_time: string
  room: string
  status: string
}

const todaySchedule: UpcomingClass[] = [
  { id: 1, course_name: 'Mathematics 101', teacher_name: 'Dr. Smith', start_time: '2024-01-15T08:00:00', end_time: '2024-01-15T09:30:00', room: 'Room 201', status: 'completed' },
  { id: 2, course_name: 'Physics 101', teacher_name: 'Prof. Johnson', start_time: '2024-01-15T10:00:00', end_time: '2024-01-15T11:30:00', room: 'Room 305', status: 'active' },
  { id: 3, course_name: 'Computer Science', teacher_name: 'Dr. Williams', start_time: '2024-01-15T13:00:00', end_time: '2024-01-15T14:30:00', room: 'Lab 1', status: 'upcoming' },
]

export default function StudentDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    overall_percentage: 0,
    present_count: 0,
    absent_count: 0,
    late_count: 0,
    today_status: 'Not Marked',
    total_sessions: 0,
    pending_reviews: 0,
    monthly_percentage: 0,
    semester_percentage: 0,
    weekly_present: 0,
    weekly_absent: 0,
    weekly_total: 0,
  })
  const [activeSessions, setActiveSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, sessionsRes] = await Promise.all([
          dashboardApi.stats(),
          attendanceApi.sessions.active().catch(() => ({ data: { data: [] } })),
        ])
        const data = statsRes?.data?.data
        if (data) {
          setStats({
            overall_percentage: data.attendance_percentage || 0,
            present_count: data.present_count || 0,
            absent_count: data.absent_count || 0,
            late_count: data.late_count || 0,
            today_status: data.today_status || 'Not Marked',
            total_sessions: data.total_sessions || 0,
            pending_reviews: data.pending_reviews || 0,
            monthly_percentage: data.monthly_percentage || 0,
            semester_percentage: data.semester_percentage || 0,
            weekly_present: data.weekly_present || 0,
            weekly_absent: data.weekly_absent || 0,
            weekly_total: data.weekly_total || 0,
          })
        }
        setActiveSessions(sessionsRes?.data?.data || [])
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const quickActions = [
    { label: 'Mark Attendance', path: '/student/attendance', icon: '✓', color: 'bg-purple-500' },
    { label: "Today's Sessions", path: '/student/schedule', icon: '📅', color: 'bg-blue-500' },
    { label: 'Attendance History', path: '/student/attendance/history', icon: '📋', color: 'bg-green-500' },
    { label: 'Update Face Data', path: '/student/face-enrollment', icon: '🙂', color: 'bg-teal-500' },
    { label: 'View Notifications', path: '/student/notifications', icon: '🔔', color: 'bg-amber-500' },
  ]

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      present: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      absent: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      late: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'Not Marked': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    }
    return colors[status] || colors['Not Marked']
  }

  const getSessionStatus = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      completed: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
      upcoming: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    }
    return (
      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', colors[status] || '')}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-600 dark:text-green-400'
    if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-10 w-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name?.split(' ')[0] || 'Student'}!</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's your attendance overview for today.</p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Overall Attendance</p>
              <p className={cn('text-3xl font-bold mt-1', getAttendanceColor(stats.overall_percentage))}>
                {stats.overall_percentage}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <span className="text-purple-600 dark:text-purple-400 text-xl">%</span>
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={cn('h-2 rounded-full transition-all', stats.overall_percentage >= 75 ? 'bg-green-500' : stats.overall_percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500')}
              style={{ width: `${Math.min(stats.overall_percentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Present</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.present_count}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-3">Classes attended</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Absent</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">{stats.absent_count}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <span className="text-red-600 dark:text-red-400 text-xl">✗</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-3">Classes missed</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Today's Status</p>
              <span className={cn('inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold', getStatusBadge(stats.today_status))}>
                {stats.today_status}
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <span className="text-amber-600 dark:text-amber-400 text-xl">📋</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-3">
            {stats.pending_reviews > 0 ? `${stats.pending_reviews} pending review(s)` : 'All up to date'}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickActions.map(action => (
            <Link
              key={action.path}
              to={action.path}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all group"
            >
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg mb-2', action.color)}>
                {action.icon}
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {action.label}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Two column layout for progress and schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance Progress</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500 dark:text-gray-400">Monthly Attendance</span>
                <span className={cn('font-semibold', getAttendanceColor(stats.monthly_percentage))}>{stats.monthly_percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className={cn('h-2.5 rounded-full transition-all', stats.monthly_percentage >= 75 ? 'bg-green-500' : stats.monthly_percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500')}
                  style={{ width: `${Math.min(stats.monthly_percentage, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500 dark:text-gray-400">Semester Attendance</span>
                <span className={cn('font-semibold', getAttendanceColor(stats.semester_percentage))}>{stats.semester_percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className={cn('h-2.5 rounded-full transition-all', stats.semester_percentage >= 75 ? 'bg-green-500' : stats.semester_percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500')}
                  style={{ width: `${Math.min(stats.semester_percentage, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500 dark:text-gray-400">This Week</span>
                <span className="text-gray-700 dark:text-gray-300 font-semibold">
                  {stats.weekly_present}/{stats.weekly_total} present
                </span>
              </div>
              <div className="flex gap-1 h-3">
                {Array.from({ length: Math.max(stats.weekly_total, 5) }).map((_, i) => {
                  const isPresent = i < stats.weekly_present
                  const isAbsent = i >= stats.weekly_present && i < stats.weekly_present + stats.weekly_absent
                  return (
                    <div
                      key={i}
                      className={cn(
                        'flex-1 rounded-sm',
                        isPresent ? 'bg-green-400' : isAbsent ? 'bg-red-400' : 'bg-gray-200 dark:bg-gray-700'
                      )}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Schedule</h2>
          <div className="space-y-3">
            {todaySchedule.map(session => (
              <div
                key={session.id}
                className={cn(
                  'flex items-center gap-4 p-3 rounded-lg border transition-colors',
                  session.status === 'active'
                    ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10'
                    : 'border-gray-200 dark:border-gray-700'
                )}
              >
                {/* Time indicator */}
                <div className="flex flex-col items-center min-w-[60px]">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {formatTime(session.start_time)}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">-</span>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {formatTime(session.end_time)}
                  </span>
                </div>

                {/* Session info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {session.course_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {session.teacher_name} · {session.room}
                  </p>
                </div>

                {/* Status badge */}
                <div className="flex-shrink-0">
                  {getSessionStatus(session.status)}
                </div>
              </div>
            ))}
          </div>
          {activeSessions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/student/attendance"
                className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
              >
                {activeSessions.length} active attendance session(s) available →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
