import React, { useState } from "react"

interface Backup {
  id: number
  name: string
  size: string
  type: "full" | "incremental"
  status: "completed" | "in_progress" | "failed"
  created_at: string
  created_by: string
}

const SAMPLE_BACKUPS: Backup[] = [
  { id: 1, name: "Full Backup 2024-01-15", size: "2.4 GB", type: "full", status: "completed", created_at: "2024-01-15T03:00:00", created_by: "System" },
  { id: 2, name: "Incremental Backup 2024-01-14", size: "450 MB", type: "incremental", status: "completed", created_at: "2024-01-14T03:00:00", created_by: "System" },
  { id: 3, name: "Incremental Backup 2024-01-13", size: "380 MB", type: "incremental", status: "completed", created_at: "2024-01-13T03:00:00", created_by: "System" },
  { id: 4, name: "Full Backup 2024-01-12", size: "2.3 GB", type: "full", status: "failed", created_at: "2024-01-12T03:00:00", created_by: "System" },
  { id: 5, name: "Incremental Backup 2024-01-11", size: "420 MB", type: "incremental", status: "completed", created_at: "2024-01-11T03:00:00", created_by: "System" },
]

export default function BackupPage() {
  const [backups] = useState<Backup[]>(SAMPLE_BACKUPS)

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    }
    return colors[status] || "bg-gray-100 text-gray-700"
  }

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      full: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      incremental: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    }
    return colors[type] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Backup & Recovery</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage system backups and disaster recovery</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Backup Now
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 text-sm font-medium rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Configure
          </button>
        </div>
      </div>

      {/* Backup stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Backups</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{backups.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Latest Backup</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">Today 3:00 AM</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Size</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">6.0 GB</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Storage Used</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">42%</p>
        </div>
      </div>

      {/* Schedule configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Backup Schedule</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Frequency</label>
              <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Time</label>
              <input type="time" defaultValue="03:00" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Retention</label>
              <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500">
                <option>7 days</option>
                <option>30 days</option>
                <option>90 days</option>
                <option>Keep all</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Backup history */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Backup History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {backups.map((backup) => (
                <tr key={backup.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{backup.name}</td>
                  <td className="px-6 py-4">
                    <span className={"inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize " + getTypeBadge(backup.type)}>
                      {backup.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{backup.size}</td>
                  <td className="px-6 py-4">
                    <span className={"inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize " + getStatusBadge(backup.status)}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        backup.status === "completed" ? "bg-green-500" :
                        backup.status === "in_progress" ? "bg-blue-500" : "bg-red-500"
                      }`} />
                      {backup.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{new Date(backup.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
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

