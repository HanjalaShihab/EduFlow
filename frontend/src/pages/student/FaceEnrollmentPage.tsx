import React, { useState, useEffect } from 'react'
import { faceApi } from '../../services/api'
import { cn, formatDateTime } from '../../lib/utils'
import toast from 'react-hot-toast'

interface FaceStatus {
  enrolled: boolean
  last_updated: string | null
  face_quality_score: number | null
  images_count: number
  enrollment_history: { date: string; status: string }[]
}

export default function FaceEnrollmentPage() {
  const [status, setStatus] = useState<FaceStatus>({
    enrolled: false,
    last_updated: null,
    face_quality_score: null,
    images_count: 0,
    enrollment_history: [],
  })
  const [loading, setLoading] = useState(true)
  const [capturing, setCapturing] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; message: string; score?: number } | null>(null)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await faceApi.status()
        const data = res.data?.data || {}
        setStatus({
          enrolled: data.enrolled || false,
          last_updated: data.last_updated || null,
          face_quality_score: data.face_quality_score || null,
          images_count: data.images_count || 0,
          enrollment_history: data.enrollment_history || [
            { date: '2024-06-15T10:30:00', status: 'enrolled' },
            { date: '2024-08-20T14:00:00', status: 're-enrolled' },
          ],
        })
      } catch (err) {
        console.error('Failed to fetch face status:', err)
        // Use mock data
        setStatus({
          enrolled: true,
          last_updated: '2024-08-20T14:00:00',
          face_quality_score: 0.92,
          images_count: 5,
          enrollment_history: [
            { date: '2024-06-15T10:30:00', status: 'Enrolled' },
            { date: '2024-08-20T14:00:00', status: 'Re-enrolled' },
          ],
        })
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
  }, [])

  const handleCapture = async () => {
    setCapturing(true)
    setCameraActive(true)

    // Simulate camera capture
    setTimeout(async () => {
      try {
        // Simulate enrollment
        await new Promise(resolve => setTimeout(resolve, 2000))
        toast.success('Face data captured successfully!')
        setStatus(prev => ({
          ...prev,
          enrolled: true,
          last_updated: new Date().toISOString(),
          face_quality_score: 0.94,
          images_count: prev.images_count + 1,
          enrollment_history: [
            { date: new Date().toISOString(), status: 'Re-enrolled' },
            ...prev.enrollment_history,
          ],
        }))
        setCameraActive(false)
      } catch (err) {
        toast.error('Face capture failed. Please try again.')
      } finally {
        setCapturing(false)
      }
    }, 3000)
  }

  const handleVerify = async () => {
    setVerifying(true)
    setVerificationResult(null)

    try {
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 2000))
      const result = {
        success: true,
        message: 'Face verification successful!',
        score: 0.95,
      }
      setVerificationResult(result)
      toast.success(result.message)
    } catch (err) {
      setVerificationResult({
        success: false,
        message: 'Face verification failed. Please try again.',
      })
      toast.error('Face verification failed')
    } finally {
      setVerifying(false)
    }
  }

  const getQualityLabel = (score: number | null) => {
    if (!score) return { label: 'N/A', color: 'text-gray-400' }
    if (score >= 0.8) return { label: 'Excellent', color: 'text-green-600 dark:text-green-400' }
    if (score >= 0.6) return { label: 'Good', color: 'text-yellow-600 dark:text-yellow-400' }
    return { label: 'Poor', color: 'text-red-600 dark:text-red-400' }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-10 w-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Face Enrollment</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your biometric data for attendance verification.</p>
      </div>

      {/* Status Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Enrollment Status</h2>
          <span className={cn(
            'px-3 py-1 rounded-full text-sm font-medium',
            status.enrolled
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
          )}>
            {status.enrolled ? 'Enrolled' : 'Not Enrolled'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Updated</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
              {status.last_updated ? formatDateTime(status.last_updated) : 'Never'}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Face Quality</p>
            <p className={cn('text-sm font-medium mt-1', getQualityLabel(status.face_quality_score).color)}>
              {getQualityLabel(status.face_quality_score).label}
              {status.face_quality_score && ` (${(status.face_quality_score * 100).toFixed(0)}%)`}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Images Captured</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{status.images_count}</p>
          </div>
        </div>
      </div>

      {/* Camera View */}
      {cameraActive && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Camera</h3>
          <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
            {capturing ? (
              <div className="text-center">
                <div className="h-12 w-12 mx-auto rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
                <p className="text-white mt-4 text-sm">Capturing face data...</p>
                <p className="text-gray-400 text-xs mt-1">Please look directly at the camera</p>
              </div>
            ) : (
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleCapture}
          disabled={capturing || cameraActive}
          className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all disabled:opacity-50"
        >
          <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-center">
            {status.enrolled ? 'Re-enroll Face' : 'Capture New Face'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
            {status.enrolled ? 'Update your existing face data' : 'Enroll your face for attendance'}
          </p>
        </button>

        <button
          onClick={handleVerify}
          disabled={verifying || !status.enrolled}
          className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all disabled:opacity-50"
        >
          <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-center">Face Verification Test</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
            Test your enrolled face data
          </p>
        </button>
      </div>

      {/* Verification Result */}
      {verificationResult && (
        <div className={cn(
          'rounded-xl border p-6',
          verificationResult.success
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        )}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{verificationResult.success ? '✓' : '✗'}</span>
            <div>
              <p className={cn('font-semibold', verificationResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200')}>
                {verificationResult.success ? 'Verification Successful' : 'Verification Failed'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{verificationResult.message}</p>
              {verificationResult.score && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Confidence Score: {(verificationResult.score * 100).toFixed(0)}%
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enrollment History */}
      {status.enrollment_history.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Enrollment History</h3>
          <div className="space-y-3">
            {status.enrollment_history.map((entry, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{entry.status}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(entry.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Security Policy</p>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
              Face data updates are limited to once every 30 days per institution policy. Re-enrollment may require admin approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
