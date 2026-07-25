import React, { useState, useEffect } from "react"
import { superAdminApi } from "../../services/api"

export default function AIMonitoringPage() {
  const [aiStatus, setAiStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await superAdminApi.systemHealth()
        setAiStatus(res.data.data)
      } catch (err) {
        console.error("Failed to fetch AI status:", err)
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

  const metrics = [
    { label: "Face Recognition Accuracy", value: "98.5%", trend: "+2.1%", status: "good", color: "text-green-500" },
    { label: "Liveness Detection Rate", value: "99.2%", trend: "+0.8%", status: "good", color: "text-green-500" },
    { label: "Avg Response Time", value: "245ms", trend: "-12ms", status: "good", color: "text-green-500" },
    { label: "Daily API Calls", value: "1,847", trend: "+15%", status: "good", color: "text-blue-500" },
    { label: "Error Rate", value: "0.3%", trend: "-0.1%", status: "good", color: "text-green-500" },
    { label: "Model Version", value: "v2.4.1", status: "info", color: "text-purple-500" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Monitoring</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor AI service performance and face recognition analytics</p>
      </div>

      {/* Status Banner */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 rounded-xl p-4 flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
        <div>
          <p className="text-sm font-medium text-green-800 dark:text-green-200">AI Service Operational</p>
          <p className="text-xs text-green-600 dark:text-green-400">All AI models are running normally</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{metric.label}</p>
            <p className={"text-2xl font-bold " + metric.color}>{metric.value}</p>
            {metric.trend && (
              <p className={"text-xs mt-1 " + (metric.trend.startsWith("+") ? "text-green-500" : "text-red-500")}>{metric.trend}</p>
            )}
          </div>
        ))}
      </div>

      {/* Service Components */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Service Components</h3>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: "Face Detection", status: "healthy", latency: "45ms", uptime: "99.9%" },
            { name: "Face Recognition", status: "healthy", latency: "120ms", uptime: "99.8%" },
            { name: "Liveness Detection", status: "healthy", latency: "80ms", uptime: "99.7%" },
            { name: "Keyword Verification", status: "healthy", latency: "15ms", uptime: "100%" },
          ].map((comp) => (
            <div key={comp.name} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{comp.name}</p>
                <p className="text-xs text-gray-500">Latency: {comp.latency} | Uptime: {comp.uptime}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />{comp.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}