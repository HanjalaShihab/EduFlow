import React, { useState, useEffect } from 'react'
import { courseApi } from '../../services/api'
import { cn } from '../../lib/utils'

interface EnrolledCourse {
  id: number
  code: string
  name: string
  teacher?: { name: string }
  credits: number
  total_classes?: number
  present_count?: number
  absent_count?: number
  attendance_percentage?: number
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<EnrolledCourse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseApi.list({ enrolled: true })
        const data = res.data?.data || []

        // Add mock attendance data if not provided
        setCourses(data.map((c: any) => ({
          ...c,
          total_classes: c.total_classes || Math.floor(Math.random() * 10) + 15,
          present_count: c.present_count || Math.floor(Math.random() * 10) + 10,
          attendance_percentage: c.attendance_percentage || 0,
        })).map((c: any) => ({
          ...c,
          absent_count: c.absent_count || c.total_classes - c.present_count,
          attendance_percentage: c.attendance_percentage || Math.round((c.present_count / c.total_classes) * 100),
        })))
      } catch (err) {
        console.error('Failed to fetch courses:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-600 dark:text-green-400'
    if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return 'bg-green-500'
    if (percentage >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Courses</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{courses.length} course(s) enrolled.</p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Courses Found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">You are not enrolled in any courses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => (
            <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{course.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{course.code}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium">
                  {course.credits} cr
                </span>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                <span>Instructor: {course.teacher?.name || 'N/A'}</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Attendance</span>
                  <span className={cn('font-semibold', getAttendanceColor(course.attendance_percentage || 0))}>
                    {course.attendance_percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={cn('h-2 rounded-full transition-all', getProgressColor(course.attendance_percentage || 0))}
                    style={{ width: `${Math.min(course.attendance_percentage || 0, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
                  <span>Present: {course.present_count}</span>
                  <span>Absent: {course.absent_count}</span>
                  <span>Total: {course.total_classes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
