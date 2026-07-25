import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    present: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    late: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    absent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    excused: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    pending_review: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    verified: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  }

  return statusColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
}

export function getConfidenceLabel(score: number): { label: string; color: string } {
  if (score >= 0.8) return { label: 'High', color: 'text-green-600' }
  if (score >= 0.5) return { label: 'Medium', color: 'text-yellow-600' }
  return { label: 'Low', color: 'text-red-600' }
}

export function calculateAttendanceRate(present: number, total: number): number {
  if (total === 0) return 0
  return Math.round((present / total) * 100)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}
