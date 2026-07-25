import React, { useState, useEffect } from "react"
import { superAdminApi } from "../../services/api"

interface AuditLog {
  id: number
  action: string
  description: string
  user_name: string
  user_email: string
  created_at: string
}

const actionTypes = ["all", "login", "logout", "create", "update", "delete", "approve", "reject", "suspend", "activate"]

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [actionFilter, setActionFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const params: Record<string, any> = { page, per_page: 30 }
      if (actionFilter !== "all") params.action = actionFilter
      const res = await superAdminApi.auditLogs(params)
      setLogs(res.data.data || [])
      setTotalPages(res.data.last_page || 1)
    } catch (err) {
      console.error("Failed to fetch audit logs:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [page, actionFilter])

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      login: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      logout: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
      create: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      update: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      delete: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      approve: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      reject: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
      suspend: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      activate: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    }
    return colors[action] || "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View and monitor all platform activity logs</p>
        </div>
        <select
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPage(1) }}
        >
          {actionTypes.map((a) => (
            <option key={a} value={a}>{a === "all" ? "All Actions" : a.charAt(0).toUpperCase() + a.slice(1)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-10 w-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300">
                          {(log.user_name || "S").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{log.user_name}</p>
                          <p className="text-xs text-gray-500">{log.user_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={"inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize " + getActionColor(log.action)}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-md truncate">
                      {log.description || "—"}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-500">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No audit logs found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700">Previous</button>
                <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700">Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}