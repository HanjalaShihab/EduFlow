import React, { useState } from "react"

export default function SecurityPage() {
  const [settings, setSettings] = useState({
    twoFactorRequired: false,
    passwordMinLength: 8,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    ipWhitelistEnabled: false,
    auditLogRetention: 90,
  })

  const toggleSetting = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !(prev as any)[key] }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Security</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage platform security settings and access controls</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Authentication */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Authentication</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Require Two-Factor Auth</p>
                <p className="text-xs text-gray-500">Enforce 2FA for all platform admins</p>
              </div>
              <button
                onClick={() => toggleSetting("twoFactorRequired")}
                className={"relative w-10 h-6 rounded-full transition-colors " + (settings.twoFactorRequired ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600")}
              >
                <span className={"absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform " + (settings.twoFactorRequired ? "translate-x-4" : "")} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Minimum Password Length</p>
                <p className="text-xs text-gray-500">{settings.passwordMinLength} characters required</p>
              </div>
              <input
                type="number"
                value={settings.passwordMinLength}
                onChange={(e) => setSettings((prev) => ({ ...prev, passwordMinLength: parseInt(e.target.value) || 8 }))}
                className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm text-center"
                min={6}
                max={32}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Session Timeout</p>
                <p className="text-xs text-gray-500">{settings.sessionTimeout} minutes of inactivity</p>
              </div>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings((prev) => ({ ...prev, sessionTimeout: parseInt(e.target.value) || 30 }))}
                className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm text-center"
                min={5}
                max={120}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Max Login Attempts</p>
                <p className="text-xs text-gray-500">Before account lockout</p>
              </div>
              <input
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => setSettings((prev) => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) || 5 }))}
                className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm text-center"
                min={3}
                max={10}
              />
            </div>
          </div>
        </div>

        {/* Access Control */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Access Control</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">IP Whitelist</p>
                <p className="text-xs text-gray-500">Restrict access to specific IP addresses</p>
              </div>
              <button
                onClick={() => toggleSetting("ipWhitelistEnabled")}
                className={"relative w-10 h-6 rounded-full transition-colors " + (settings.ipWhitelistEnabled ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600")}
              >
                <span className={"absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform " + (settings.ipWhitelistEnabled ? "translate-x-4" : "")} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Audit Log Retention</p>
                <p className="text-xs text-gray-500">{settings.auditLogRetention} days</p>
              </div>
              <input
                type="number"
                value={settings.auditLogRetention}
                onChange={(e) => setSettings((prev) => ({ ...prev, auditLogRetention: parseInt(e.target.value) || 90 }))}
                className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm text-center"
                min={30}
                max={365}
              />
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Recent Security Events</p>
              <div className="space-y-2">
                {[
                  { event: "Failed login attempt", time: "2 minutes ago", severity: "warning" },
                  { event: "New device login", time: "1 hour ago", severity: "info" },
                  { event: "Password changed", time: "3 hours ago", severity: "info" },
                ].map((evt) => (
                  <div key={evt.event} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={"w-2 h-2 rounded-full " + (evt.severity === "warning" ? "bg-yellow-500" : "bg-blue-500")} />
                      <span className="text-gray-600 dark:text-gray-400">{evt.event}</span>
                    </div>
                    <span className="text-xs text-gray-400">{evt.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
          Save Security Settings
        </button>
      </div>
    </div>
  )
}