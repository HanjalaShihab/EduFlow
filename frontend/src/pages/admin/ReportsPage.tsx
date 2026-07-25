import React, { useState } from "react"

interface Report {
  id: number
  name: string
  type: "daily" | "weekly" | "monthly" | "custom"
  format: "pdf" | "excel" | "csv"
  generated_at: string
  size: string
  status: "ready" | "generating" | "failed"
}

const SAMPLE_REPORTS: Report[] = [
  { id: 1, name: "Daily Attendance Report", type: "daily", format: "pdf", generated_at: "2024-01-15T08:00:00", size: "2.3 MB", status: "ready" },
  { id: 2, name: "Weekly Platform Summary", type: "weekly", format: "excel", generated_at: "2024-01-14T08:00:00", size: "5.1 MB", status: "ready" },
  { id: 3, name: "Monthly Analytics Report", type: "monthly", format: "pdf", generated_at: "2024-01-01T08:00:00", size: "12.8 MB", status: "ready" },
  { id: 4, name: "Custom Institution Report", type: "custom", format: "csv", generated_at: "2024-01-10T10:30:00", size: "3.5 MB", status: "ready" },
  { id: 5, name: "Institution Growth Report", type: "monthly", format: "excel", generated_at: "2024-01-12T08:00:00", size: "8.2 MB", status: "ready" },
]

const REPORT_TYPES = [
  { id: "daily", label: "Daily Report", desc: "Daily attendance and activity summary", icon: "D" },
  { id: "weekly", label: "Weekly Report", desc: "Weekly platform performance overview", icon: "W" },
  { id: "monthly", label: "Monthly Report", desc: "Comprehensive monthly analytics", icon: "M" },
  { id: "custom", label: "Custom Report", desc: "Build your own custom report", icon: "C" },
]

export default function ReportsPage() {
  const [reports] = useState<Report[]>(SAMPLE_REPORTS)
  const [selectedType, setSelectedType] = useState("daily")

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      daily: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      weekly: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      monthly: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
      custom: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    }
    return colors[type] || "bg-gray-100 text-gray-700"
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      ready: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      generating: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    }
    return colors[status] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Generate and view platform-wide reports</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Generate Report
        </button>
      </div>

      {/* Quick report generation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {REPORT_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`text-left p-5 rounded-xl border-2 transition-all ${
              selectedType === type.id
                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300"
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center text-white font-bold mb-3">
              {type.icon}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{type.label}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{type.desc}</p>
          </button>
        ))}
      </div>

      {/* Generated reports */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Generated Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Report Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Format</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Generated</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{report.name}</td>
                  <td className="px-6 py-4">
                    <span className={"inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize " + getTypeBadge(report.type)}>
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 uppercase">{report.format}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{report.size}</td>
                  <td className="px-6 py-4">
                    <span className={"inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize " + getStatusBadge(report.status)}>
                      {report.status === "ready" && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{new Date(report.generated_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-xs font-medium rounded-lg transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

