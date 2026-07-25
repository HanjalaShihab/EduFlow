import React, { useState } from "react"

interface ApiKey {
  id: number
  name: string
  key: string
  created_at: string
  last_used: string | null
  status: "active" | "revoked"
  permissions: string[]
}

const SAMPLE_KEYS: ApiKey[] = [
  { id: 1, name: "Production API Key", key: "ef_live_2xM9...kL3q", created_at: "2024-01-01T00:00:00", last_used: "2024-01-15T10:30:00", status: "active", permissions: ["read", "write"] },
  { id: 2, name: "Development API Key", key: "ef_test_8pR4...wN7b", created_at: "2024-01-05T00:00:00", last_used: "2024-01-14T14:20:00", status: "active", permissions: ["read"] },
  { id: 3, name: "Integration API Key", key: "ef_test_3hS7...mT2k", created_at: "2024-01-10T00:00:00", last_used: null, status: "active", permissions: ["read", "write"] },
  { id: 4, name: "Old Production Key", key: "ef_live_1fD8...pR9s", created_at: "2023-06-01T00:00:00", last_used: "2023-12-20T00:00:00", status: "revoked", permissions: ["read", "write"] },
]

const INTEGRATIONS = [
  { name: "Zoom", desc: "Video conferencing integration", icon: "Z", connected: true },
  { name: "Google Classroom", desc: "Sync courses and assignments", icon: "G", connected: false },
  { name: "Microsoft Teams", desc: "Team collaboration integration", icon: "M", connected: false },
  { name: "Slack", desc: "Notifications and alerts", icon: "S", connected: true },
]

export default function ApiKeysPage() {
  const [apiKeys] = useState<ApiKey[]>(SAMPLE_KEYS)
  const [showNewKeyForm, setShowNewKeyForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">API & Integrations</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage API keys and third-party integrations</p>
        </div>
        <button
          onClick={() => setShowNewKeyForm(!showNewKeyForm)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          {showNewKeyForm ? "Cancel" : "New API Key"}
        </button>
      </div>

      {showNewKeyForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New API Key</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Key Name</label>
              <input type="text" placeholder="e.g., Production API Key" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Permissions</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" /> Read
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" /> Write
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" /> Admin
                </label>
              </div>
            </div>
          </div>
          <button className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors">
            Generate Key
          </button>
        </div>
      )}

      {/* API Keys */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">API Keys</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">API Key</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Permissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Used</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {apiKeys.map((key) => (
                <tr key={key.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{key.name}</td>
                  <td className="px-6 py-4">
                    <code className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">{key.key}</code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {key.permissions.map((perm) => (
                        <span key={perm} className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 uppercase">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      key.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${key.status === "active" ? "bg-green-500" : "bg-red-500"}`} />
                      {key.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{key.last_used ? new Date(key.last_used).toLocaleDateString() : "Never"}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                      {key.status === "active" && (
                        <button className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Third-party integrations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Third-Party Integrations</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {INTEGRATIONS.map((integration) => (
            <div key={integration.name} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center text-white font-bold">
                  {integration.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{integration.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{integration.desc}</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                integration.connected
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${integration.connected ? "bg-green-500" : "bg-gray-400"}`} />
                {integration.connected ? "Connected" : "Disconnected"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

