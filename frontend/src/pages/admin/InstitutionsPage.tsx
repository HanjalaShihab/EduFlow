import React, { useState, useEffect } from "react"
import { superAdminApi } from "../../services/api"
import { Link } from "react-router-dom"

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const params: Record<string, any> = {}
        if (statusFilter !== "all") params.status = statusFilter
        if (search) params.search = search
        const res = await superAdminApi.listInstitutions(params)
        setInstitutions(res.data.data || [])
      } catch (err) {
        console.error("Failed to fetch institutions:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchInstitutions()
  }, [statusFilter, search])

  const handleApprove = async (id: number) => {
    try {
      await superAdminApi.approveInstitution(id)
      setInstitutions(prev => prev.map(inst => inst.id === id ? { ...inst, status: "active" } : inst))
    } catch (err) {
      console.error("Failed to approve institution:", err)
    }
  }

  const handleReject = async (id: number) => {
    try {
      await superAdminApi.rejectInstitution(id)
      setInstitutions(prev => prev.map(inst => inst.id === id ? { ...inst, status: "rejected" } : inst))
    } catch (err) {
      console.error("Failed to reject institution:", err)
    }
  }

  const handleSuspend = async (id: number) => {
    try {
      await superAdminApi.suspendInstitution(id)
      setInstitutions(prev => prev.map(inst => inst.id === id ? { ...inst, status: "suspended" } : inst))
    } catch (err) {
      console.error("Failed to suspend institution:", err)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      suspended: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      rejected: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    }
    return colors[status] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Institution Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage all registered institutions on the platform</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search institutions..."
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Institution</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Users</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Registered</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {institutions.map((inst: any) => (
                  <tr key={inst.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                          {(inst.name || "I").charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{inst.name}</p>
                          <p className="text-xs text-gray-500">{inst.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 capitalize">{inst.type?.replace("_", " ")}</td>
                    <td className="px-6 py-4">
                      <span className={"inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium " + getStatusBadge(inst.status)}>
                        {inst.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{inst.users_count ?? 0}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 capitalize">{inst.subscription_plan || "Free"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{new Date(inst.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/institutions/${inst.id}`} className="p-1.5 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        {inst.status === "pending" && (
                          <>
                            <button onClick={() => handleApprove(inst.id)} className="p-1.5 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button onClick={() => handleReject(inst.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </>
                        )}
                        {inst.status === "active" && (
                          <button onClick={() => handleSuspend(inst.id)} className="p-1.5 text-gray-400 hover:text-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {institutions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">No institutions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}