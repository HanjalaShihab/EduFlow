import React, { useState, useEffect } from "react"
import { superAdminApi } from "../../services/api"

interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
  institution: { id: number; name: string } | null
  created_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params: Record<string, any> = { page, per_page: 15 }
      if (roleFilter !== "all") params.role = roleFilter
      if (search) params.search = search
      const res = await superAdminApi.listUsers(params)
      setUsers(res.data.data || [])
      setTotalPages(res.data.last_page || 1)
    } catch (err) {
      console.error("Failed to fetch users:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page, roleFilter])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== undefined) fetchUsers()
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const handleSuspend = async (id: number) => {
    setActionLoading(id)
    try {
      await superAdminApi.suspendUser(id)
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: "suspended" } : u)))
    } catch (err) {
      console.error("Failed to suspend user:", err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleActivate = async (id: number) => {
    setActionLoading(id)
    try {
      await superAdminApi.activateUser(id)
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: "active" } : u)))
    } catch (err) {
      console.error("Failed to activate user:", err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return
    setActionLoading(id)
    try {
      await superAdminApi.deleteUser(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (err) {
      console.error("Failed to delete user:", err)
    } finally {
      setActionLoading(null)
    }
  }

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      platform_admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      institution_admin: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      teacher: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      student: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    }
    return colors[role] || "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      suspended: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    }
    return colors[status] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage all platform users</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search users..."
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
          >
            <option value="all">All Roles</option>
            <option value="platform_admin">Platform Admin</option>
            <option value="institution_admin">Institution Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Institution</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                          {(user.name || "U").charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={"inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize " + getRoleBadge(user.role)}>
                        {user.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={"inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize " + getStatusBadge(user.status)}>
                        {user.status || "active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {user.institution?.name || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.status === "active" && (
                          <button
                            onClick={() => handleSuspend(user.id)}
                            disabled={actionLoading === user.id}
                            className="p-1.5 text-gray-400 hover:text-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 disabled:opacity-50"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          </button>
                        )}
                        {user.status === "suspended" && (
                          <button
                            onClick={() => handleActivate(user.id)}
                            disabled={actionLoading === user.id}
                            className="p-1.5 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 disabled:opacity-50"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={actionLoading === user.id}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}