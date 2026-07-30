// User types
export type UserRole = 'platform_admin' | 'institution_admin' | 'teacher' | 'student'

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  role: UserRole
  institution_id: number | null
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: User
  token: string
  message: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  role: UserRole
  institution_id?: number
  student_id?: string
  department_id?: number
  program_id?: number
  semester_id?: number
  section_id?: number
  phone?: string
  gender?: string
  date_of_birth?: string
  position?: string
  first_name?: string
  last_name?: string
  employee_id?: string
  institution_email?: string
}

export interface InstitutionSearchResult {
  id: number
  name: string
  slug: string
  code: string
  city: string
  state: string
  type: string
  logo: string | null
}

export interface CascadingSelectOption {
  id: number
  name: string
  code: string
  semester_number?: number
  course_id?: number
}

// Institution types
export interface Institution {
  id: number
  name: string
  slug: string
  code: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  country: string
  zip_code: string
  website: string
  type: 'school' | 'college' | 'university' | 'training_institute'
  status: 'pending' | 'active' | 'suspended' | 'rejected'
  max_students: number
  max_teachers: number
  subscription_plan: string
  subscription_expires_at: string | null
  verified_at: string | null
  created_at: string
  updated_at: string
}

// Department types
export interface Department {
  id: number
  institution_id: number
  name: string
  code: string
  description: string | null
  head_of_department_id: number | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// Program types
export interface Program {
  id: number
  institution_id: number
  department_id: number
  name: string
  code: string
  duration_years: number
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// Semester types
export interface Semester {
  id: number
  institution_id: number
  program_id: number
  name: string
  code: string
  semester_number: number
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Course types
export interface Course {
  id: number
  institution_id: number
  program_id: number
  semester_id: number
  name: string
  code: string
  credits: number
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// Section types
export interface Section {
  id: number
  institution_id: number
  course_id: number
  teacher_id: number
  name: string
  code: string
  room: string
  capacity: number
  schedule: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Attendance types
export type AttendanceStatus = 'present' | 'late' | 'absent' | 'excused' | 'pending_review' | 'rejected'

export interface AttendanceSession {
  id: number
  institution_id: number
  course_id: number
  section_id: number
  teacher_id: number
  start_time: string
  end_time: string
  attendance_window_minutes: number
  status: 'active' | 'completed' | 'cancelled'
  total_students: number
  present_count: number
  late_count: number
  absent_count: number
  pending_review_count: number
  created_at: string
  updated_at: string
}

export interface AttendanceRecord {
  id: number
  institution_id: number
  attendance_session_id: number
  student_id: number
  status: AttendanceStatus
  confidence_score: number | null
  liveness_score: number | null
  face_image_url: string | null
  keyword_entered: string | null
  keyword_matched: boolean
  marked_at: string | null
  reviewed_by: number | null
  reviewed_at: string | null
  review_notes: string | null
  created_at: string
  updated_at: string
  student?: User
}

// Face types
export interface FaceEnrollData {
  images: {
    front: File
    left: File
    right: File
    blink: File
    smile: File
    head_movement: File
  }
}

export interface FaceVerificationData {
  image: File
}

export interface FaceVerificationResult {
  verified: boolean
  confidence_score: number
  liveness_score: number
  message: string
}

// Dashboard types
export interface DashboardStats {
  total_students: number
  total_teachers: number
  total_courses: number
  total_sections: number
  today_attendance_rate: number
  weekly_attendance_rate: number
  monthly_attendance_rate: number
  pending_registrations: number
  pending_reviews: number
  active_sessions: number
}

export interface AttendanceReport {
  date: string
  total: number
  present: number
  late: number
  absent: number
  excused: number
  pending_review: number
  rate: number
}

// Notification types
export interface Notification {
  id: number
  type: string
  title: string
  message: string
  read_at: string | null
  created_at: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}
