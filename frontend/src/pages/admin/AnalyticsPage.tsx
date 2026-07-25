import React, { useState, useEffect } from "react"
import { superAdminApi } from "../../services/api"

interface AnalyticsData {
  institutions: { total: number; active: number; pending: number; suspended: number }
  users: { total: number; platform_admins: number; institution_admins: number; teachers: number; students: number }
  attendance: { total_sessions: number; total_records: number }
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await superAdminApi.analytics()
        setData(res.data.data)
      } catch (err) {
        console.error("Failed to fetch analytics:", err)
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

  const institutionsData = data?.institutions
  const usersData = data?.users
  const attendanceData = data?.attendance

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Comprehensive platform analytics and insights</p>
      </div>

      {/* Institutions Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Institutions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{institutionsData?.total || 0}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">Total</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{institutionsData?.active || 0}</p>
              <p className="text-sm text-green-600 dark:text-green-400">Active</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{institutionsData?.pending || 0}</p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">Pending</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{institutionsData?.suspended || 0}</p>
              <p className="text-sm text-red-600 dark:text-red-400">Suspended</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Users</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{usersData?.total || 0}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{usersData?.platform_admins || 0}</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">Platform Admins</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{usersData?.institution_admins || 0}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">Inst. Admins</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{usersData?.teachers || 0}</p>
              <p className="text-sm text-green-600 dark:text-green-400">Teachers</p>
            </div>
            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{usersData?.students || 0}</p>
              <p className="text-sm text-teal-600 dark:text-teal-400">Students</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Attendance</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{attendanceData?.total_sessions || 0}</p>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">Total Sessions</p>
            </div>
            <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">{attendanceData?.total_records || 0}</p>
              <p className="text-sm text-pink-600 dark:text-pink-400 mt-1">Total Records</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}