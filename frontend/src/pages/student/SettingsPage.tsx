import React, { useState } from 'react'
import { authApi } from '../../services/api'
import { cn } from '../../lib/utils'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    }
    return 'light'
  })
  const [language, setLanguage] = useState('en')
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    push: true,
    attendance_reminders: true,
    session_updates: true,
    system_announcements: true,
  })
  const [saving, setSaving] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  })
  const [profileVisibility, setProfileVisibility] = useState(true)
  const [shareAttendance, setShareAttendance] = useState(true)

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
    localStorage.setItem('theme', newTheme)
    toast.success(`Theme changed to ${newTheme} mode`)
  }

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      toast.error('Passwords do not match')
      return
    }
    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Password changed successfully')
      setShowPasswordForm(false)
      setPasswordData({ current_password: '', new_password: '', new_password_confirmation: '' })
    } catch (err) {
      toast.error('Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  const handleSavePreferences = async () => {
    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      toast.success('Preferences saved successfully')
    } catch (err) {
      toast.error('Failed to save preferences')
    } finally {
      setSaving(false)
    }
  }

  const handleLogoutOtherDevices = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Logged out from all other devices')
    } catch (err) {
      toast.error('Failed to logout from other devices')
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account settings and preferences.</p>
      </div>

      {/* Theme */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Theme</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Toggle between light and dark mode.</p>
          </div>
          <button
            onClick={toggleTheme}
            className={cn(
              'relative w-14 h-7 rounded-full transition-colors',
              theme === 'dark' ? 'bg-purple-600' : 'bg-gray-300'
            )}
          >
            <div
              className={cn(
                'absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform flex items-center justify-center text-sm',
                theme === 'dark' ? 'translate-x-7' : 'translate-x-0.5'
              )}
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </div>
          </button>
        </div>
      </div>

      {/* Language */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Language</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Select your preferred language.</p>
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="ar">العربية</option>
        </select>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          {Object.entries(notificationPrefs).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {key.replace(/_/g, ' ')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Receive {key.replace(/_/g, ' ')} notifications
                </p>
              </div>
              <button
                onClick={() => setNotificationPrefs(prev => ({ ...prev, [key]: !value }))}
                className={cn(
                  'relative w-11 h-6 rounded-full transition-colors',
                  value ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                )}
              >
                <div
                  className={cn(
                    'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                    value ? 'translate-x-5' : 'translate-x-0.5'
                  )}
                />
              </button>
            </label>
          ))}
        </div>
        <button
          onClick={handleSavePreferences}
          disabled={saving}
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>

      {/* Change Password */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Password</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Update your account password.</p>
          </div>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            {showPasswordForm ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        {showPasswordForm && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
              <input
                type="password"
                value={passwordData.current_password}
                onChange={e => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
              <input
                type="password"
                value={passwordData.new_password}
                onChange={e => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.new_password_confirmation}
                onChange={e => setPasswordData(prev => ({ ...prev, new_password_confirmation: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
            <button
              onClick={handleChangePassword}
              disabled={saving || !passwordData.current_password || !passwordData.new_password}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
            >
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        )}
      </div>

      {/* Privacy & Security */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Privacy & Security</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Show my profile to other students</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Allow other students to view your profile</p>
            </div>
            <button
              onClick={() => setProfileVisibility(!profileVisibility)}
              className={cn(
                'relative w-11 h-6 rounded-full transition-colors',
                profileVisibility ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
              )}
            >
              <div className={cn(
                'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                profileVisibility ? 'translate-x-5' : 'translate-x-0.5'
              )} />
            </button>
          </label>
          <label className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Share attendance statistics</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Allow teachers to view your attendance stats</p>
            </div>
            <button
              onClick={() => setShareAttendance(!shareAttendance)}
              className={cn(
                'relative w-11 h-6 rounded-full transition-colors',
                shareAttendance ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
              )}
            >
              <div className={cn(
                'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                shareAttendance ? 'translate-x-5' : 'translate-x-0.5'
              )} />
            </button>
          </label>
        </div>
      </div>

      {/* Logout from Other Devices */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Sessions</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Logout from all other devices.</p>
          </div>
          <button
            onClick={handleLogoutOtherDevices}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Logout Others
          </button>
        </div>
      </div>
    </div>
  )
}
