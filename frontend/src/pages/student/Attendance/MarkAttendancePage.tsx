import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { attendanceApi } from '../../../services/api'
import { cn } from '../../../lib/utils'

type Step = 'instructions' | 'face_verification' | 'keyword' | 'result'

interface AttendanceResult {
  success: boolean
  message: string
  status?: string
  confidence?: number
}

const instructions = [
  { step: 1, title: 'Face Verification', description: 'Look directly into the camera when prompted. Ensure good lighting and no obstructions.' },
  { step: 2, title: 'Liveness Detection', description: 'Follow on-screen instructions (blink, smile, or turn head slightly) to prove you are present.' },
  { step: 3, title: 'Enter Keyword', description: 'Type the keyword announced by your teacher. It is case-insensitive.' },
  { step: 4, title: 'Confirmation', description: 'Review your attendance result. You will receive a confirmation message.' },
]

export default function MarkAttendancePage() {
  const { id: sessionId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<Step>('instructions')
  const [keyword, setKeyword] = useState('')
  const [result, setResult] = useState<AttendanceResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [faceVerified, setFaceVerified] = useState(false)
  const [livenessPassed, setLivenessPassed] = useState(false)
  const [faceConfidence] = useState(0.92)
  const [livenessScore] = useState(0.88)

  const handleStartAttendance = () => {
    setCurrentStep('face_verification')
    // Simulate face verification
    setTimeout(() => {
      setFaceVerified(true)
      setTimeout(() => {
        setLivenessPassed(true)
        setCurrentStep('keyword')
      }, 1500)
    }, 2000)
  }

  const handleSubmitKeyword = async () => {
    if (!keyword.trim() || !sessionId) return

    setSubmitting(true)
    try {
      const res = await attendanceApi.mark({
        session_id: parseInt(sessionId),
        keyword: keyword.trim(),
        face_image: 'captured_image_placeholder',
        liveness_data: {
          liveness_passed: livenessPassed,
          liveness_score: livenessScore,
          face_confidence: faceConfidence,
        },
      })

      setResult({
        success: true,
        message: res.data?.message || 'Attendance recorded successfully!',
        status: 'present',
        confidence: faceConfidence,
      })
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to mark attendance.'
      let status = 'error'
      if (errMsg.toLowerCase().includes('keyword')) status = 'wrong_keyword'
      else if (errMsg.toLowerCase().includes('face')) status = 'face_failed'
      else if (errMsg.toLowerCase().includes('already')) status = 'already_submitted'
      else if (errMsg.toLowerCase().includes('closed')) status = 'session_closed'
      else if (errMsg.toLowerCase().includes('review')) status = 'pending_review'

      setResult({
        success: false,
        message: errMsg,
        status,
      })
    } finally {
      setSubmitting(false)
      setCurrentStep('result')
    }
  }

  const handleRetry = () => {
    setCurrentStep('instructions')
    setKeyword('')
    setResult(null)
    setFaceVerified(false)
    setLivenessPassed(false)
  }

  const renderInstructions = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mark Attendance</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Follow the steps below to mark your attendance.</p>
      </div>

      <div className="space-y-3">
        {instructions.map(inst => (
          <div key={inst.step} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{inst.step}</span>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{inst.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{inst.description}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleStartAttendance}
        className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
      >
        Start Attendance
      </button>
    </div>
  )

  const renderFaceVerification = () => (
    <div className="text-center space-y-6">
      <div className="w-48 h-48 mx-auto rounded-full border-4 border-purple-300 dark:border-purple-700 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
        {faceVerified && livenessPassed ? (
          <div className="text-center">
            <span className="text-5xl">✓</span>
            <p className="text-green-600 dark:text-green-400 font-medium mt-2">Verified</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="h-12 w-12 mx-auto rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
            <p className="text-gray-500 dark:text-gray-400 mt-4">
              {faceVerified ? 'Checking liveness...' : 'Detecting face...'}
            </p>
          </div>
        )}
      </div>

      {faceVerified && livenessPassed && (
        <div className="space-y-2">
          <div className="flex justify-center gap-4 text-sm">
            <span className="text-green-600 dark:text-green-400">Face Confidence: {(faceConfidence * 100).toFixed(0)}%</span>
            <span className="text-green-600 dark:text-green-400">Liveness: {(livenessScore * 100).toFixed(0)}%</span>
          </div>
          <button
            onClick={() => setCurrentStep('keyword')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  )

  const renderKeyword = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Enter Keyword</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Type the keyword announced by your teacher.</p>
      </div>

      <div className="max-w-sm mx-auto">
        <input
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="Enter attendance keyword..."
          className="w-full px-4 py-3 text-center text-lg font-bold tracking-widest uppercase border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
          autoFocus
          onKeyDown={e => e.key === 'Enter' && handleSubmitKeyword()}
        />
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
          Keyword is case-insensitive. Spaces will be trimmed automatically.
        </p>
      </div>

      <div className="flex gap-3 justify-center">
        <button
          onClick={() => setCurrentStep('face_verification')}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmitKeyword}
          disabled={!keyword.trim() || submitting}
          className={cn(
            'px-6 py-2 rounded-lg font-medium transition-colors',
            keyword.trim() && !submitting
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          )}
        >
          {submitting ? 'Submitting...' : 'Submit Attendance'}
        </button>
      </div>
    </div>
  )

  const renderResult = () => {
    if (!result) return null

    const getResultIcon = () => {
      switch (result.status) {
        case 'present': return '🎉'
        case 'already_submitted': return 'ℹ️'
        case 'session_closed': return '🔒'
        case 'face_failed': return '😞'
        case 'wrong_keyword': return '🔑'
        case 'pending_review': return '⏳'
        default: return '❌'
      }
    }

    const getResultColors = () => {
      if (result.success) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      if (result.status === 'pending_review') return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
      return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    }

    return (
      <div className={cn('rounded-xl border p-6 text-center space-y-4', getResultColors())}>
        <div className="text-6xl">{getResultIcon()}</div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {result.success ? 'Attendance Recorded!' : result.status === 'already_submitted' ? 'Already Submitted' :
           result.status === 'session_closed' ? 'Session Closed' : result.status === 'face_failed' ? 'Face Verification Failed' :
           result.status === 'wrong_keyword' ? 'Keyword Incorrect' : result.status === 'pending_review' ? 'Manual Review Required' : 'Attendance Failed'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">{result.message}</p>

        {result.status === 'present' && result.confidence && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Confidence Score: {(result.confidence * 100).toFixed(0)}%
          </div>
        )}

        <div className="flex gap-3 justify-center pt-2">
          {!result.success && (
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          )}
          <button
            onClick={() => navigate('/student/attendance')}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {result.success ? 'Back to Sessions' : 'Cancel'}
          </button>
          {result.success && (
            <button
              onClick={() => navigate('/student/attendance/history')}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              View History
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2">
          {(['instructions', 'face_verification', 'keyword', 'result'] as Step[]).map((step, idx) => {
            const stepNames = ['Instructions', 'Face Verification', 'Keyword', 'Result']
            const isActive = currentStep === step
            const isCompleted = ['instructions', 'face_verification', 'keyword', 'result'].indexOf(currentStep) > idx
            return (
              <div key={step} className="flex items-center">
                <div className={cn(
                  'flex items-center gap-2',
                  isActive ? 'text-purple-600 dark:text-purple-400' : isCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
                )}>
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                    isActive ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                    isCompleted ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                    'bg-gray-100 dark:bg-gray-700 text-gray-500'
                  )}>
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <span className="text-xs font-medium hidden sm:inline">{stepNames[idx]}</span>
                </div>
                {idx < 3 && (
                  <div className={cn(
                    'w-8 h-0.5 mx-1',
                    isCompleted ? 'bg-green-400' : 'bg-gray-300 dark:bg-gray-600'
                  )} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {currentStep === 'instructions' && renderInstructions()}
        {currentStep === 'face_verification' && renderFaceVerification()}
        {currentStep === 'keyword' && renderKeyword()}
        {currentStep === 'result' && renderResult()}
      </div>
    </div>
  )
}
