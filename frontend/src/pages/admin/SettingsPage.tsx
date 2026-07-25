import React, { useState } from "react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    platform_name: "EduFlow",
    support_email: "support@eduflow.com",
    support_phone: "+1-555-0123",
    default_language: "en",
    timezone: "UTC",
    date_format: "YYYY-MM-DD",
    enable_registration: true,
    require_approval: true,
    email_notifications: true,
    weekly_reports: false,
    audit_logging: true,
    maintenance_mode: false,
  })

  const toggleSetting = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !(prev as any)[key] }))
  }

  const settingToggles = [
    { key: "enable_registration", label: "Enable Public Registration", desc: "Allow new institutions to register" },
    { key: "require_approval", label: "Require Approval", desc: "New registrations require admin approval" },
    { key: "email_notifications", label: "Email Notifications", desc: "Send email notifications for system events" },
    { key: "weekly_reports", label: "Weekly Reports", desc: "Generate and send weekly platform reports" },
    { key: "audit_logging", label: "Audit Logging", desc: "Log all platform activities for auditing" },
    { key: "maintenance_mode", label: "Maintenance Mode", desc: "Put platform in maintenance mode (admins only)" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Platform-wide configuration and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">General</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Platform Name</label>
                <input type="text" value={settings.platform_name} onChange={(e) => setSettings(prev => ({ ...prev, platform_name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Support Email</label>
                  <input type="email" value={settings.support_email} onChange={(e) => setSettings(prev => ({ ...prev, support_email: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Support Phone</label>
                  <input type="text" value={settings.support_phone} onChange={(e) => setSettings(prev => ({ ...prev, support_phone: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Default Language</label>
                  <select value={settings.default_language} onChange={(e) => setSettings(prev => ({ ...prev, default_language: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500">
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                    <option value="ar">Arabic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Timezone</label>
                  <select value={settings.timezone} onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500">
                    <option value="UTC">UTC</option>
                    <option value="US/Eastern">US/Eastern</option>
                    <option value="US/Pacific">US/Pacific</option>
                    <option value="Europe/London">Europe/London</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Date Format</label>
                  <select value={settings.date_format} onChange={(e) => setSettings(prev => ({ ...prev, date_format: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500">
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Feature Toggles</h3>
            </div>
            <div className="p-6 space-y-4">
              {settingToggles.map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                  </div>
                  <button
                    onClick={() => toggleSetting(key)}
                    className={"relative w-11 h-6 rounded-full transition-colors shrink-0 " + ((settings as any)[key] ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600")}
                  >
                    <span className={"absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform " + ((settings as any)[key] ? "translate-x-5" : "")} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Branding</h3>
            <div className="space-y-4">
              <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-3xl">EF</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Platform Logo</label>
                <button className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 hover:border-purple-500 hover:text-purple-600 transition-colors">Upload Logo</button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Favicon</label>
                <button className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 hover:border-purple-500 hover:text-purple-600 transition-colors">Upload Favicon</button>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Danger Zone</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Irreversible actions. Proceed with caution.</p>
            <button className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors">Reset Platform Settings</button>
          </div>
        </div>
      </div>
    </div>
  )
}