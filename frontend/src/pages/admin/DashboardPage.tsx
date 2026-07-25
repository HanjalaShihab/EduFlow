import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { superAdminApi } from "../../services/api"

interface Stats {
  total_institutions: number
  active_institutions: number
  pending_institutions: number
  suspended_institutions: number
  total_institution_admins: number
  total_teachers: number
  total_students: number
  total_users: number
  total_sessions_today: number
  total_records_today: number
  total_face_verifications: number
  successful_verification_rate: number
  pending_manual_reviews: number
  active_subscriptions: number
  new_institutions_this_month: number
  total_attendance_sessions: number
  total_attendance_records: number
}

interface GrowthPoint {
  month: string
  count: number
}

interface DailyAttendance {
  date: string
  total: number
  present: number
  absent: number
}

interface ChartData {
  institution_growth: GrowthPoint[]
  user_growth: GrowthPoint[]
  daily_attendance: DailyAttendance[]
}

interface HealthItem {
  status: string
  env?: string
  connection?: string
  driver?: string
}

interface SystemHealth {
  application: HealthItem
  database: HealthItem
  cache: HealthItem
  queue: HealthItem
  mail: HealthItem
  storage: HealthItem
}

interface Activity {
  id: number
  action: string
  description: string
  user_name: string
  user_email: string
  created_at: string
}

const statCards = [
  { key: "total_institutions", label: "Total Institutions", color: "bg-blue-500", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", subKey: "new_institutions_this_month", subLabel: "new this month" },
  { key: "active_institutions", label: "Active Institutions", color: "bg-green-500", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { key: "pending_institutions", label: "Pending Approvals", color: "bg-yellow-500", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { key: "total_teachers", label: "Total Teachers", color: "bg-purple-500", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { key: "total_students", label: "Total Students", color: "bg-teal-500", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" },
  { key: "total_sessions_today", label: "Sessions Today", color: "bg-indigo-500", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { key: "total_records_today", label: "Records Today", color: "bg-pink-500", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { key: "pending_manual_reviews", label: "Pending Reviews", color: "bg-orange-500", icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
]

const quickActions = [
  { label: "Institutions", path: "/admin/institutions", desc: "Manage all institutions", color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" },
  { label: "Registration Requests", path: "/admin/registrations", desc: "Review pending registrations", color: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400" },
  { label: "Users", path: "/admin/users", desc: "Manage platform users", color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" },
  { label: "System Health", path: "/admin/system-health", desc: "Monitor system status", color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" },
]

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [charts, setCharts] = useState<ChartData | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartsRes, activitiesRes, healthRes] = await Promise.allSettled([
          superAdminApi.dashboardStats(),
          superAdminApi.dashboardCharts(),
          superAdminApi.recentActivities(),
          superAdminApi.systemHealth(),
        ])

        if (statsRes.status === "fulfilled") setStats(statsRes.value.data.data)
        if (chartsRes.status === "fulfilled") setCharts(chartsRes.value.data.data)
        if (activitiesRes.status === "fulfilled") setActivities(activitiesRes.value.data.data || [])
        if (healthRes.status === "fulfilled") setHealth(healthRes.value.data.data)
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-10 w-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  const maxInstGrowth = charts?.institution_growth ? Math.max(...charts.institution_growth.map((d) => d.count), 1) : 1
  const maxUserGrowth = charts?.user_growth ? Math.max(...charts.user_growth.map((d) => d.count), 1) : 1
  const maxDailyAtt = charts?.daily_attendance ? Math.max(...charts.daily_attendance.map((d) => d.total), 1) : 1

  const userRoles = [
    { label: "Institution Admins", value: stats?.total_institution_admins ?? 0, color: "bg-blue-500" },
    { label: "Teachers", value: stats?.total_teachers ?? 0, color: "bg-purple-500" },
    { label: "Students", value: stats?.total_students ?? 0, color: "bg-teal-500" },
  ]
  const totalUsers = (stats?.total_institution_admins ?? 0) + (stats?.total_teachers ?? 0) + (stats?.total_students ?? 0)

  const healthEntries = health ? Object.entries(health) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time overview of the entire EduFlow platform</p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            All Systems Online
          </span>
        </div>
      </div>

      {/* Stat Cards - 8 cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3">
        {statCards.map((card) => {
          const val = (stats as any)?.[card.key] ?? 0
          const subVal = card.subKey ? (stats as any)?.[card.subKey] ?? 0 : null
          return (
            <div key={card.key} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">{card.label}</p>
                <div className={"flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center " + card.color}>
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                  </svg>
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{val}</p>
              {subVal !== null && (
                <p className="text-[10px] text-green-500 mt-0.5">+{subVal} {card.subLabel}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.path}
            to={action.path}
            className={"rounded-xl p-4 " + action.color + " border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all"}
          >
            <p className="text-sm font-semibold">{action.label}</p>
            <p className="text-xs mt-1 opacity-75">{action.desc}</p>
          </Link>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Institution Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Institution Growth (12mo)</h3>
          </div>
          <div className="p-5">
            {charts?.institution_growth && charts.institution_growth.length > 0 ? (
              <div className="flex items-end gap-1.5 h-32">
                {charts.institution_growth.map((d) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-medium text-gray-500">{d.count}</span>
                    <div
                      className="w-full bg-blue-500 rounded-t transition-all duration-300"
                      style={{ height: ((d.count / maxInstGrowth) * 100) + "%", minHeight: d.count > 0 ? "4px" : "0" }}
                    />
                    <span className="text-[8px] text-gray-400 -rotate-45 origin-left whitespace-nowrap">
                      {d.month?.slice(5)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 text-sm py-6">No growth data available</p>
            )}
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">User Growth (12mo)</h3>
          </div>
          <div className="p-5">
            {charts?.user_growth && charts.user_growth.length > 0 ? (
              <div className="flex items-end gap-1.5 h-32">
                {charts.user_growth.map((d) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-medium text-gray-500">{d.count}</span>
                    <div
                      className="w-full bg-purple-500 rounded-t transition-all duration-300"
                      style={{ height: ((d.count / maxUserGrowth) * 100) + "%", minHeight: d.count > 0 ? "4px" : "0" }}
                    />
                    <span className="text-[8px] text-gray-400 -rotate-45 origin-left whitespace-nowrap">
                      {d.month?.slice(5)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 text-sm py-6">No growth data available</p>
            )}
          </div>
        </div>

        {/* Daily Attendance Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Daily Attendance (30d)</h3>
          </div>
          <div className="p-5">
            {charts?.daily_attendance && charts.daily_attendance.length > 0 ? (
              <div className="flex items-end gap-1 h-32">
                {charts.daily_attendance.map((d) => (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] font-medium text-gray-500">{d.total}</span>
                    <div
                      className="w-full flex flex-col-reverse rounded-t overflow-hidden transition-all duration-300"
                      style={{ height: ((d.total / maxDailyAtt) * 100) + "%", minHeight: d.total > 0 ? "4px" : "0" }}
                    >
                      <div className="w-full bg-green-400" style={{ flex: d.present || 0.1 }} />
                      <div className="w-full bg-red-400" style={{ flex: d.absent || 0.1 }} />
                    </div>
                    <span className="text-[7px] text-gray-400 -rotate-45 origin-left whitespace-nowrap">
                      {d.date?.slice(5)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 text-sm py-6">No attendance data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom: Activities + System Health + User Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Activities</h3>
            <Link to="/admin/audit-logs" className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400">
              View All
            </Link>
          </div>
          <div className="p-5 max-h-80 overflow-y-auto">
            {activities.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">No recent activities</p>
            ) : (
              <div className="space-y-3">
                {activities.slice(0, 15).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <span className="text-purple-600 dark:text-purple-300 text-xs font-medium">
                        {(activity.user_name || "S").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{activity.user_name}</span> {activity.description || activity.action}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {activity.created_at ? new Date(activity.created_at).toLocaleString() : ""}
                      </p>
                    </div>
                    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 uppercase">
                      {activity.action}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* System Health - from real API */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">System Health</h3>
            </div>
            <div className="p-5 space-y-3">
              {healthEntries ? (
                healthEntries.map(([key, val]) => {
                  const isHealthy = val.status === "healthy" || val.status === "configured"
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{key.replace("_", " ")}</span>
                      <span className={
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium " +
                        (isHealthy
                          ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400")
                      }>
                        <span className={"w-1.5 h-1.5 rounded-full " + (isHealthy ? "bg-green-500" : "bg-red-500")} />
                        {val.status}
                      </span>
                    </div>
                  )
                })
              ) : (
                <>
                  {["Application", "Database", "Cache", "Queue", "Mail", "Storage"].map((item) => (
                    <div key={item} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        Unknown
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* User Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">User Distribution</h3>
            </div>
            <div className="p-5 space-y-4">
              {userRoles.map((item) => {
                const pct = totalUsers > 0 ? Math.round((item.value / totalUsers) * 100) : 0
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className={item.color + " h-2 rounded-full transition-all duration-500"} style={{ width: pct + "%" }} />
                    </div>
                  </div>
                )
              })}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Total Users</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{stats?.total_users ?? 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}