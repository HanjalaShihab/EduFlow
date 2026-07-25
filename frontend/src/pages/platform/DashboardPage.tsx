import React from 'react'
import { useAuth } from '../../hooks/useAuth'

export default function PlatformDashboard() {
  const { user, logout } = useAuth()

  const statsCards = [
    { label: 'Total Institutions', value: '--', color: 'bg-blue-500' },
    { label: 'Active Institutions', value: '--', color: 'bg-green-500' },
    { label: 'Total Users', value: '--', color: 'bg-purple-500' },
    { label: 'Pending Approvals', value: '--', color: 'bg-yellow-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary">EduFlow</h1>
              <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">Platform Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
                  {user?.name?.charAt(0) || 'P'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Platform Admin</p>
                </div>
              </div>
              <button type="button" onClick={logout} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex items-center">
                  <div className={'flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ' + stat.color}>
                    <span className="text-white text-lg font-bold">{stat.value}</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Registrations</h3>
            </div>
            <div className="p-6">
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No recent registrations</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Health</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div><p className="text-sm text-gray-500">API Status</p><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Healthy</span></div>
                <div><p className="text-sm text-gray-500">Queue Status</p><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span></div>
                <div><p className="text-sm text-gray-500">AI Service</p><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Online</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
