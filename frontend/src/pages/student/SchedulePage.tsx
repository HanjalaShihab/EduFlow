import React, { useState } from 'react'
import { cn, formatTime } from '../../lib/utils'

interface ScheduleItem {
  id: number
  course_name: string
  teacher_name: string
  room: string
  day: string
  start_time: string
  end_time: string
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const mockSchedule: ScheduleItem[] = [
  { id: 1, course_name: 'Mathematics 101', teacher_name: 'Dr. Smith', room: 'Room 201', day: 'Monday', start_time: '2024-01-15T08:00:00', end_time: '2024-01-15T09:30:00' },
  { id: 2, course_name: 'Physics 101', teacher_name: 'Prof. Johnson', room: 'Room 305', day: 'Monday', start_time: '2024-01-15T10:00:00', end_time: '2024-01-15T11:30:00' },
  { id: 3, course_name: 'Computer Science', teacher_name: 'Dr. Williams', room: 'Lab 1', day: 'Monday', start_time: '2024-01-15T13:00:00', end_time: '2024-01-15T14:30:00' },
  { id: 4, course_name: 'English Literature', teacher_name: 'Prof. Davis', room: 'Room 102', day: 'Tuesday', start_time: '2024-01-16T08:00:00', end_time: '2024-01-16T09:30:00' },
  { id: 5, course_name: 'Mathematics 101', teacher_name: 'Dr. Smith', room: 'Room 201', day: 'Tuesday', start_time: '2024-01-16T10:00:00', end_time: '2024-01-16T11:30:00' },
  { id: 6, course_name: 'History', teacher_name: 'Prof. Miller', room: 'Room 405', day: 'Wednesday', start_time: '2024-01-17T08:00:00', end_time: '2024-01-17T09:30:00' },
  { id: 7, course_name: 'Physics 101', teacher_name: 'Prof. Johnson', room: 'Lab 2', day: 'Wednesday', start_time: '2024-01-17T10:00:00', end_time: '2024-01-17T12:00:00' },
  { id: 8, course_name: 'Computer Science', teacher_name: 'Dr. Williams', room: 'Lab 1', day: 'Thursday', start_time: '2024-01-18T08:00:00', end_time: '2024-01-18T09:30:00' },
  { id: 9, course_name: 'English Literature', teacher_name: 'Prof. Davis', room: 'Room 102', day: 'Thursday', start_time: '2024-01-18T10:00:00', end_time: '2024-01-18T11:30:00' },
  { id: 10, course_name: 'Mathematics 101', teacher_name: 'Dr. Smith', room: 'Room 201', day: 'Friday', start_time: '2024-01-19T08:00:00', end_time: '2024-01-19T09:30:00' },
  { id: 11, course_name: 'History', teacher_name: 'Prof. Miller', room: 'Room 405', day: 'Friday', start_time: '2024-01-19T10:00:00', end_time: '2024-01-19T11:30:00' },
  { id: 12, course_name: 'Physics 101', teacher_name: 'Prof. Johnson', room: 'Room 305', day: 'Saturday', start_time: '2024-01-20T08:00:00', end_time: '2024-01-20T09:30:00' },
]

export default function SchedulePage() {
  const [currentDay] = useState(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[new Date().getDay()]
  })

  const isToday = (day: string) => day === currentDay

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Weekly Schedule</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Today is <span className="font-medium text-purple-600 dark:text-purple-400">{currentDay}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {daysOfWeek.map(day => {
          const daySessions = mockSchedule.filter(s => s.day === day)
          const today = isToday(day)

          return (
            <div
              key={day}
              className={cn(
                'rounded-xl border overflow-hidden',
                today
                  ? 'border-purple-300 dark:border-purple-700 ring-2 ring-purple-200 dark:ring-purple-800'
                  : 'border-gray-200 dark:border-gray-700'
              )}
            >
              <div className={cn(
                'px-4 py-3 font-semibold text-sm',
                today
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              )}>
                <div className="flex items-center justify-between">
                  <span>{day}</span>
                  {today && (
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Today</span>
                  )}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 space-y-2 min-h-[200px]">
                {daySessions.length === 0 ? (
                  <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">No classes</p>
                ) : (
                  daySessions.map(session => (
                    <div
                      key={session.id}
                      className={cn(
                        'p-2 rounded-lg text-xs border',
                        today
                          ? 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/10'
                          : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                      )}
                    >
                      <p className="font-medium text-gray-900 dark:text-white truncate">{session.course_name}</p>
                      <p className="text-gray-500 dark:text-gray-400 mt-0.5">{session.teacher_name}</p>
                      <div className="flex items-center justify-between mt-1 text-gray-400 dark:text-gray-500">
                        <span>{session.room}</span>
                        <span>{formatTime(session.start_time)} - {formatTime(session.end_time)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
