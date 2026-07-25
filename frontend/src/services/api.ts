import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse, InstitutionSearchResult, CascadingSelectOption } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor for auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add institution header if available
    const institutionId = localStorage.getItem('institution_id')
    if (institutionId) {
      config.headers['X-Institution-Id'] = institutionId
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError<ApiResponse>) => {
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user')
          localStorage.removeItem('institution_id')
          window.location.href = '/login'
          break
        case 403:
          console.error('Access denied:', data?.message)
          break
        case 422:
          console.error('Validation error:', data?.errors)
          break
        case 429:
          console.error('Rate limit exceeded:', data?.message)
          break
        case 500:
          console.error('Server error:', data?.message)
          break
      }
    } else if (error.request) {
      console.error('Network error: Please check your connection')
    }

    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post<ApiResponse>('/auth/login', credentials),
  register: (data: {
    name: string
    email: string
    password: string
    password_confirmation: string
    role: string
    institution_id?: number
  }) => api.post<ApiResponse>('/auth/register', data),
  logout: () => api.post<ApiResponse>('/auth/logout'),
  user: () => api.get<ApiResponse>('/auth/user'),
}

// Institution API
export const institutionApi = {
  list: (params?: Record<string, any>) =>
    api.get<ApiResponse>('/institutions', { params }),
  show: (id: number) =>
    api.get<ApiResponse>(`/institutions/${id}`),
  register: (data: FormData) =>
    api.post<ApiResponse>('/institutions/register', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  search: (query: string) =>
    api.get<{ data: InstitutionSearchResult[] }>('/institutions/search', { params: { q: query } }),
  departments: (institutionId: number) =>
    api.get<{ data: CascadingSelectOption[] }>(`/institutions/${institutionId}/departments`),
  programs: (institutionId: number) =>
    api.get<{ data: CascadingSelectOption[] }>(`/institutions/${institutionId}/programs`),
  semesters: (institutionId: number) =>
    api.get<{ data: CascadingSelectOption[] }>(`/institutions/${institutionId}/semesters`),
  sections: (institutionId: number) =>
    api.get<{ data: CascadingSelectOption[] }>(`/institutions/${institutionId}/sections`),
  update: (id: number, data: Record<string, any>) =>
    api.put<ApiResponse>(`/institutions/${id}`, data),
  approve: (id: number) =>
    api.post<ApiResponse>(`/institutions/${id}/approve`),
  reject: (id: number, reason?: string) =>
    api.post<ApiResponse>(`/institutions/${id}/reject`, { reason }),
  suspend: (id: number) =>
    api.post<ApiResponse>(`/institutions/${id}/suspend`),
}

// Department API
export const departmentApi = {
  list: (institutionId: number, params?: Record<string, any>) =>
    api.get<ApiResponse>(`/institutions/${institutionId}/departments`, { params }),
  create: (institutionId: number, data: Record<string, any>) =>
    api.post<ApiResponse>(`/institutions/${institutionId}/departments`, data),
  update: (institutionId: number, id: number, data: Record<string, any>) =>
    api.put<ApiResponse>(`/institutions/${institutionId}/departments/${id}`, data),
  delete: (institutionId: number, id: number) =>
    api.delete<ApiResponse>(`/institutions/${institutionId}/departments/${id}`),
}

// Program API
export const programApi = {
  list: (institutionId: number, params?: Record<string, any>) =>
    api.get<ApiResponse>(`/institutions/${institutionId}/programs`, { params }),
  create: (institutionId: number, data: Record<string, any>) =>
    api.post<ApiResponse>(`/institutions/${institutionId}/programs`, data),
  update: (institutionId: number, id: number, data: Record<string, any>) =>
    api.put<ApiResponse>(`/institutions/${institutionId}/programs/${id}`, data),
  delete: (institutionId: number, id: number) =>
    api.delete<ApiResponse>(`/institutions/${institutionId}/programs/${id}`),
}

// Course API
export const courseApi = {
  list: (params?: Record<string, any>) =>
    api.get<ApiResponse>('/courses', { params }),
  show: (id: number) =>
    api.get<ApiResponse>(`/courses/${id}`),
  create: (data: Record<string, any>) =>
    api.post<ApiResponse>('/courses', data),
  update: (id: number, data: Record<string, any>) =>
    api.put<ApiResponse>(`/courses/${id}`, data),
  delete: (id: number) =>
    api.delete<ApiResponse>(`/courses/${id}`),
}

// Section API
export const sectionApi = {
  list: (params?: Record<string, any>) =>
    api.get<ApiResponse>('/sections', { params }),
  show: (id: number) =>
    api.get<ApiResponse>(`/sections/${id}`),
  create: (data: Record<string, any>) =>
    api.post<ApiResponse>('/sections', data),
  update: (id: number, data: Record<string, any>) =>
    api.put<ApiResponse>(`/sections/${id}`, data),
  delete: (id: number) =>
    api.delete<ApiResponse>(`/sections/${id}`),
}

// Student API
export const studentApi = {
  list: (params?: Record<string, any>) =>
    api.get<ApiResponse>('/students', { params }),
  show: (id: number) =>
    api.get<ApiResponse>(`/students/${id}`),
  approve: (id: number) =>
    api.post<ApiResponse>(`/students/${id}/approve`),
  reject: (id: number, reason?: string) =>
    api.post<ApiResponse>(`/students/${id}/reject`, { reason }),
  pending: (params?: Record<string, any>) =>
    api.get<ApiResponse>('/students/pending', { params }),
}

// Teacher API
export const teacherApi = {
  list: (params?: Record<string, any>) =>
    api.get<ApiResponse>('/teachers', { params }),
  show: (id: number) =>
    api.get<ApiResponse>(`/teachers/${id}`),
  create: (data: Record<string, any>) =>
    api.post<ApiResponse>('/teachers', data),
}

// Attendance API
export const attendanceApi = {
  sessions: {
    list: (params?: Record<string, any>) =>
      api.get<ApiResponse>('/attendance/sessions', { params }),
    show: (id: number) =>
      api.get<ApiResponse>(`/attendance/sessions/${id}`),
    create: (data: Record<string, any>) =>
      api.post<ApiResponse>('/attendance/sessions', data),
    update: (id: number, data: Record<string, any>) =>
      api.put<ApiResponse>(`/attendance/sessions/${id}`, data),
    end: (id: number) =>
      api.post<ApiResponse>(`/attendance/sessions/${id}/end`),
    active: (params?: Record<string, any>) =>
      api.get<ApiResponse>('/attendance/sessions/active', { params }),
  },
  keywords: {
    generate: (sessionId: number) =>
      api.post<ApiResponse>(`/attendance/sessions/${sessionId}/keyword/generate`),
    regenerate: (sessionId: number) =>
      api.post<ApiResponse>(`/attendance/sessions/${sessionId}/keyword/regenerate`),
  },
  mark: (data: {
    session_id: number
    keyword: string
    face_image?: string
    liveness_data?: Record<string, any>
  }) => api.post<ApiResponse>('/attendance/mark', data),
  records: {
    list: (params?: Record<string, any>) =>
      api.get<ApiResponse>('/attendance/records', { params }),
    myHistory: (params?: Record<string, any>) =>
      api.get<ApiResponse>('/attendance/records/my', { params }),
    show: (id: number) =>
      api.get<ApiResponse>(`/attendance/records/${id}`),
  },
  reviews: {
    pending: (params?: Record<string, any>) =>
      api.get<ApiResponse>('/attendance/reviews/pending', { params }),
    approve: (id: number, notes?: string) =>
      api.post<ApiResponse>(`/attendance/reviews/${id}/approve`, { notes }),
    reject: (id: number, notes?: string) =>
      api.post<ApiResponse>(`/attendance/reviews/${id}/reject`, { notes }),
    resubmit: (id: number, notes?: string) =>
      api.post<ApiResponse>(`/attendance/reviews/${id}/resubmit`, { notes }),
  },
}

// Face API
export const faceApi = {
  enroll: (data: FormData) =>
    api.post<ApiResponse>('/face/enroll', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  verify: (data: FormData) =>
    api.post<ApiResponse>('/face/verify', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  status: () =>
    api.get<ApiResponse>('/face/status'),
}

// Report API
export const reportApi = {
  daily: (params?: Record<string, any>) =>
    api.get<ApiResponse>('/reports/daily', { params }),
  weekly: (params?: Record<string, any>) =>
    api.get<ApiResponse>('/reports/weekly', { params }),
  monthly: (params?: Record<string, any>) =>
    api.get<ApiResponse>('/reports/monthly', { params }),
  byStudent: (studentId: number, params?: Record<string, any>) =>
    api.get<ApiResponse>(`/reports/student/${studentId}`, { params }),
  byCourse: (courseId: number, params?: Record<string, any>) =>
    api.get<ApiResponse>(`/reports/course/${courseId}`, { params }),
  exportPdf: (params?: Record<string, any>) =>
    api.get<ApiResponse>('/reports/export/pdf', {
      params,
      responseType: 'blob',
    }),
  exportExcel: (params?: Record<string, any>) =>
    api.get<ApiResponse>('/reports/export/excel', {
      params,
      responseType: 'blob',
    }),
}

// Dashboard API
export const dashboardApi = {
  stats: () =>
    api.get<ApiResponse>('/dashboard/stats'),
}

// Super Admin (Platform Admin) API
export const superAdminApi = {
  // Dashboard
  dashboardStats: () => api.get<{ data: any }>('/admin/dashboard/stats'),
  dashboardCharts: () => api.get<{ data: any }>('/admin/dashboard/charts'),
  recentActivities: () => api.get<{ data: any[] }>('/admin/dashboard/activities'),

  // Institutions
  listInstitutions: (params?: Record<string, any>) =>
    api.get('/admin/institutions', { params }),
  pendingRegistrations: (params?: Record<string, any>) =>
    api.get('/admin/institutions/pending', { params }),
  getInstitution: (id: number) =>
    api.get<{ data: any }>(`/admin/institutions/${id}`),
  updateInstitution: (id: number, data: Record<string, any>) =>
    api.put(`/admin/institutions/${id}`, data),
  approveInstitution: (id: number) =>
    api.post(`/admin/institutions/${id}/approve`),
  rejectInstitution: (id: number, reason?: string) =>
    api.post(`/admin/institutions/${id}/reject`, { reason }),
  suspendInstitution: (id: number) =>
    api.post(`/admin/institutions/${id}/suspend`),
  reactivateInstitution: (id: number) =>
    api.post(`/admin/institutions/${id}/reactivate`),
  deleteInstitution: (id: number) =>
    api.delete(`/admin/institutions/${id}`),
  institutionStats: (id: number) =>
    api.get<{ data: any }>(`/admin/institutions/${id}/stats`),

  // Users
  listUsers: (params?: Record<string, any>) =>
    api.get('/admin/users', { params }),
  getUser: (id: number) =>
    api.get<{ data: any }>(`/admin/users/${id}`),
  suspendUser: (id: number) =>
    api.post(`/admin/users/${id}/suspend`),
  activateUser: (id: number) =>
    api.post(`/admin/users/${id}/activate`),
  deleteUser: (id: number) =>
    api.delete(`/admin/users/${id}`),

  // Audit Logs
  auditLogs: (params?: Record<string, any>) =>
    api.get('/admin/audit-logs', { params }),

  // System Health
  systemHealth: () => api.get<{ data: any }>('/admin/system-health'),

  // Analytics
  analytics: (params?: Record<string, any>) =>
    api.get<{ data: any }>('/admin/analytics', { params }),
}

export default api
