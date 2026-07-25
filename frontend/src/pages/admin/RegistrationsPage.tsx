import React, { useState, useEffect } from "react"
import { superAdminApi } from "../../services/api"

export default function RegistrationsPage() {
  const [institutions, setInstitutions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await superAdminApi.pendingRegistrations()
        setInstitutions(res.data.data || [])
      } catch (err) {
        console.error("Failed to fetch pending registrations:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPending()
  }, [])

  const handleApprove = async (id: number) => {
    try {
      await superAdminApi.approveInstitution(id)
      setInstitutions((prev) => prev.filter((inst) => inst.id !== id))
    } catch (err) {
      console.error("Failed to approve:", err)
    }
  }

  const handleReject = async (id: number) => {
    if (!window.confirm("Reject this registration request?")) return
    try {
      await superAdminApi.rejectInstitution(id)
      setInstitutions((prev) => prev.filter((inst) => inst.id !== id))
    } catch (err) {
      console.error("Failed to reject:", err)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Registration Requests</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review and manage new institution onboarding requests</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-10 w-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
        </div>
      ) : institutions.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Pending Requests</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">All institution registration requests have been reviewed. New requests will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {institutions.map((inst: any) => (
            <div key={inst.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                    {(inst.name || "I").charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{inst.name}</h3>
                    <p className="text-sm text-gray-500">{inst.email}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span className="capitalize">{inst.type?.replace("_", " ")}</span>
                      <span>{inst.city}, {inst.state}</span>
                      <span>Code: {inst.code}</span>
                    </div>
                    {inst.registration_notes && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        {inst.registration_notes}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-400">
                      Registered: {new Date(inst.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(inst.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(inst.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}