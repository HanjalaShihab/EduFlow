import React, { useState, useEffect } from "react"
import { superAdminApi } from "../../services/api"

interface HealthItem {
  status: string
  env?: string
  connection?: string
  driver?: string
}

interface HealthData {
  application: HealthItem
  database: HealthItem
  cache: HealthItem
  queue: HealthItem
  mail: HealthItem
  storage: HealthItem
}

export default function SystemHealthPage() {
  const [health, setHealth] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchHealth = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true)
    try {
      const res = await superAdminApi.systemHealth()
      setHealth(res.data.data)
    } catch (err) {
      console.error("Failed to fetch system health:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchHealth()
    const interval = setInterval(() => fetchHealth(), 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    if (status === "healthy" || status === "configured") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Healthy
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        Unhealthy
      </span>
    )
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Health</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor the health and performance of all system components</p>
        </div>
        <button
          onClick={() => fetchHealth(true)}
          disabled={refreshing}
          className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors disabled:opacity-50"
        >
          <svg className={"w-4 h-4 inline mr-1 " + (refreshing ? "animate-spin" : "")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {health && Object.entries(health).map(([key, val]) => {
          const isHealthy = val.status === "healthy" || val.status === "configured"
          return (
            <div key={key} className={"bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6 " + (isHealthy ? "border-green-200 dark:border-green-900/50" : "border-red-200 dark:border-red-900/50")}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{key.replace("_", " ")}</h3>
                <div className={"w-3 h-3 rounded-full " + (isHealthy ? "bg-green-500" : "bg-red-500")} />
              </div>
              {getStatusIcon(val.status)}
              <div className="mt-3 space-y-1 text-xs text-gray-500">
                {val.env && <p>Environment: <span className="font-medium">{val.env}</span></p>}
                {val.connection && <p>Connection: <span className="font-medium">{val.connection}</span></p>}
                {val.driver && <p>Driver: <span className="font-medium">{val.driver}</span></p>}
              </div>
            </div>
          )
        })}
      </div>

      {/* System Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Auto-Recovery</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Automatic Health Checks</p>
                <p className="text-xs text-gray-500">System checks every 30 seconds</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Auto-Healing</p>
                <p className="text-xs text-gray-500">Automatic service recovery on failure</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                Manual
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Service Uptime</h3>
          </div>
          <div className="p-6 space-y-4">
            {["Application", "Database", "Cache", "Queue", "Mail", "Storage"].map((service) => (
              <div key={service} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{service}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "99.9%" }} />
                  </div>
                  <span className="text-xs font-medium text-green-600">99.9%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}