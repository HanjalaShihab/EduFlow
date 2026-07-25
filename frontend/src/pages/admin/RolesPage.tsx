import React, { useState } from "react"

interface Role {
  id: string
  name: string
  description: string
  usersCount: number
  permissions: string[]
}

const ALL_PERMISSIONS = [
  "view_dashboard", "manage_institutions", "manage_users", "manage_subscriptions",
  "view_analytics", "manage_roles", "manage_settings", "view_audit_logs",
  "manage_backups", "manage_support", "send_notifications", "manage_api_keys",
  "view_reports", "manage_security", "view_system_health", "manage_ai_monitoring",
]

const INITIAL_ROLES: Role[] = [
  {
    id: "platform_admin", name: "Platform Admin", description: "Full access to all platform features",
    usersCount: 3, permissions: ALL_PERMISSIONS,
  },
  {
    id: "institution_admin", name: "Institution Admin", description: "Manage institution-specific settings and users",
    usersCount: 25, permissions: ["view_dashboard", "manage_institutions", "manage_users", "view_reports"],
  },
  {
    id: "teacher", name: "Teacher", description: "Take attendance, view reports, manage classes",
    usersCount: 150, permissions: ["view_dashboard", "view_reports"],
  },
  {
    id: "student", name: "Student", description: "Mark attendance and view personal records",
    usersCount: 2500, permissions: ["view_dashboard"],
  },
]

export default function RolesPage() {
  const [roles] = useState<Role[]>(INITIAL_ROLES)
  const [selectedRole, setSelectedRole] = useState<string>("platform_admin")

  const currentRole = roles.find(r => r.id === selectedRole)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Roles & Permissions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage roles, permissions, and access control</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Role
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setSelectedRole(role.id)}
            className={`text-left p-4 rounded-xl border-2 transition-all ${
              selectedRole === role.id
                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300"
            }`}
          >
            <h3 className="font-semibold text-gray-900 dark:text-white">{role.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{role.description}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{role.usersCount} users</p>
          </button>
        ))}
      </div>

      {currentRole && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{currentRole.name} Permissions</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Toggle permissions for this role ({currentRole.permissions.length}/{ALL_PERMISSIONS.length} assigned)</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {ALL_PERMISSIONS.map((perm) => {
                const hasPermission = currentRole.permissions.includes(perm)
                return (
                  <div
                    key={perm}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                      hasPermission
                        ? "border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      hasPermission
                        ? "bg-purple-500 border-purple-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}>
                      {hasPermission && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm ${hasPermission ? "text-gray-900 dark:text-white font-medium" : "text-gray-500 dark:text-gray-400"}`}>
                      {perm.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors">
              Save Permissions
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

