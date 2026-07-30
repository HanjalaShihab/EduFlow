import React, { useState, useEffect } from 'react'
import { attendanceApi, reportApi } from '../../../services/api'
import { cn, formatDate, formatDateTime, getStatusColor } from '../../../lib/utils'

interface HistoryRecord {
  id: number
  course?: { name: string }
  teacher?: { name: string }
  attendance_session?: { course?: { name: string }; teacher?: { name: string } }
  marked_at: string
  status: string
  face_confidence: number | null
  liveness_score: number | null
  keyword_matched: boolean
  face_matched: boolean
  manual_review_status?: string | null
}

export default function AttendanceHistoryPage() {
  const [records, setRecords] = useState<HistoryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    date: '',
    course: '',
    teacher: '',
    status: '',
  })
  const [exporting, setExporting] = useState<'pdf' | 'csv' | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const params: Record<string, any> = {}
        if (filters.date) params.date = filters.date
        if (filters.course) params.course = filters.course
        if (filters.teacher) params.teacher = filters.teacher
        if (filters.status) params.status = filters.status

        const res = await attendanceApi.records.myHistory(params)
        setRecords(res.data?.data || [])
      } catch (err) {
        console.error('Failed to fetch history:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [filters])

  const handleExport = async (format: 'pdf' | 'csv') => {
    setExporting(format)
    try {
      const params: Record<string, any> = { format }
      if (filters.date) params.date = filters.date
      if (filters.course) params.course = filters.course
      if (filters.status) params.status = filters.status

      const res = format === 'pdf'
        ? await reportApi.exportPdf(params)
        : await reportApi.exportExcel(params)

      // Download the blob
      const blob = new Blob([res.data], { type: format === 'pdf' ? 'application/pdf' : 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `attendance-history.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(`Failed to export as ${format}:`, err)
    } finally {
      setExporting(null)
    }
  }

  const getCourseName = (record: HistoryRecord) => {
    return record.course?.name || record.attendance_session?.course?.name || 'Unknown Course'
  }

  const getTeacherName = (record: HistoryRecord) => {
    return record.teacher?.name || record.attendance_session?.teacher?.name || 'Unknown'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-10 w-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance History</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View all your attendance records.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('pdf')}
            disabled={exporting === 'pdf'}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {exporting === 'pdf' ? 'Exporting...' : 'Export PDF'}
          </button>
          <button
            onClick={() => handleExport('csv')}
            disabled={exporting === 'csv'}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {exporting === 'csv' ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={e => setFilters(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course</label>
            <input
              type="text"
              placeholder="Filter by course..."
              value={filters.course}
              onChange={e => setFilters(prev => ({ ...prev, course: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teacher</label>
            <input
              type="text"
              placeholder="Filter by teacher..."
              value={filters.teacher}
              onChange={e => setFilters(prev => ({ ...prev, teacher: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
              <option value="pending_review">Pending Review</option>
              <option value="rejected">Rejected</option>
              <option value="excused">Excused</option>
            </select>
          </div>
        </div>
      </div>

      {/* Records Table */}
      {records.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Records Found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">No attendance records match your filters.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Teacher</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Face Match</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Keyword</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Confidence</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {records.map(record => (
                  <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{getCourseName(record)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{getTeacherName(record)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{formatDate(record.marked_at)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {record.marked_at ? new Date(record.marked_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(record.status))}>
                        {record.status?.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'inline-flex items-center gap-1 text-xs font-medium',
                        record.face_matched ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      )}>
                        {record.face_matched ? '✓' : '✗'} {record.face_matched ? 'Matched' : 'Failed'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'inline-flex items-center gap-1 text-xs font-medium',
                        record.keyword_matched ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      )}>
                        {record.keyword_matched ? '✓' : '✗'} {record.keyword_matched ? 'Matched' : 'Failed'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {record.face_confidence ? `${(record.face_confidence * 100).toFixed(0)}%` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {record.manual_review_status ? (
                        <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(record.manual_review_status))}>
                          {record.manual_review_status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
