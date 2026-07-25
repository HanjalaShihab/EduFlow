import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { institutionApi } from '../../services/api'
import { cn } from '../../lib/utils'
import type { InstitutionSearchResult, CascadingSelectOption } from '../../types'

// ═══════════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════════

type RegistrationStep = 'select' | 'institution' | 'student' | 'teacher' | 'success'

// ─── Zod schemas ──────────────────────────────────────────────────────────────

const institutionSchema = z.object({
  // Institution info
  name: z.string().min(2, 'Institution name is required'),
  type: z.enum(['school', 'college', 'university', 'training_institute']),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(7, 'Phone number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2, 'Country is required'),
  postal_code: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  established_year: z.string().optional(),
  // Admin info
  admin_name: z.string().min(2, 'Administrator name is required'),
  admin_email: z.string().email('Valid email is required'),
  admin_phone: z.string().min(7, 'Phone number is required'),
  admin_password: z.string().min(8, 'Password must be at least 8 characters'),
  admin_password_confirmation: z.string(),
  // Terms
  accept_terms: z.literal(true, { errorMap: () => ({ message: 'You must accept the terms' }) }),
  accept_privacy: z.literal(true, { errorMap: () => ({ message: 'You must accept the privacy policy' }) }),
}).refine((data) => data.admin_password === data.admin_password_confirmation, {
  message: 'Passwords do not match',
  path: ['admin_password_confirmation'],
})

type InstitutionFormData = z.infer<typeof institutionSchema>

const studentPersonalSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  gender: z.string().optional(),
  date_of_birth: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Valid email is required'),
})

type StudentPersonalData = z.infer<typeof studentPersonalSchema>

const studentAccountSchema = z.object({
  student_id: z.string().min(1, 'Student ID is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
})

type StudentAccountData = z.infer<typeof studentAccountSchema>

const teacherSchema = z.object({
  institution_id: z.number({ required_error: 'Please select an institution' }),
  department_id: z.number({ required_error: 'Please select a department' }),
  employee_id: z.string().min(1, 'Employee ID is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(7, 'Phone number is required'),
  name: z.string().min(2, 'Full name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
})

type TeacherFormData = z.infer<typeof teacherSchema>

// ═══════════════════════════════════════════════════════════════════════════════
// Floating Orbs (reused from LoginPage)
// ═══════════════════════════════════════════════════════════════════════════════

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-20"
          style={{
            background: i % 2 === 0 ? '#8b5cf6' : '#14b8a6',
            width: `${150 + i * 80}px`,
            height: `${150 + i * 80}px`,
            left: `${10 + i * 18}%`,
            top: `${5 + (i % 3) * 25}%`,
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 1.5,
          }}
        />
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// Container & Item variants
// ═══════════════════════════════════════════════════════════════════════════════

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
  }),
  hover: { y: -6, scale: 1.02, transition: { duration: 0.3 } },
  tap: { scale: 0.98 },
}

// ═══════════════════════════════════════════════════════════════════════════════
// Step 1: Role selection
// ═══════════════════════════════════════════════════════════════════════════════

interface RoleCard {
  key: RegistrationStep
  icon: string
  title: string
  description: string
  gradient: string
  disabled?: boolean
}

const roleCards: RoleCard[] = [
  {
    key: 'institution',
    icon: '🏫',
    title: 'Institution',
    description: 'Register your school, college, or university.',
    gradient: 'from-purple-600 to-blue-600',
  },
  {
    key: 'student',
    icon: '🎓',
    title: 'Student',
    description: 'Join your institution and access attendance.',
    gradient: 'from-teal-500 to-green-500',
  },
  {
    key: 'teacher',
    icon: '👨‍🏫',
    title: 'Teacher',
    description: 'Create your teacher account using your institution.',
    gradient: 'from-orange-500 to-pink-500',
  },
  {
    key: 'institution' as RegistrationStep,
    icon: '👨‍💼',
    title: 'Platform Staff',
    description: 'Super Admin accounts are created internally only.',
    gradient: 'from-gray-400 to-gray-500',
    disabled: true,
  },
]

function RoleSelection({ onSelect }: { onSelect: (step: RegistrationStep) => void }) {
  return (
    <motion.div
      className="max-w-2xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <div className="mx-auto relative w-16 h-16 mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-teal-500 rounded-2xl animate-pulse-slow" />
          <div className="absolute inset-0.5 bg-white dark:bg-gray-900 rounded-[14px] flex items-center justify-center">
            <svg className="w-9 h-9 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
          Create Your <span className="gradient-text">EduFlow</span> Account
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Who are you? Choose your registration type below.
        </p>
      </motion.div>

      {/* Role cards grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {roleCards.slice(0, 3).map((card, i) => (
          <motion.button
            key={card.key}
            custom={i}
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => onSelect(card.key)}
            className={cn(
              'relative group text-left p-6 rounded-2xl border transition-all duration-300',
              'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm',
              'border-gray-200 dark:border-gray-700',
              'hover:border-purple-300 dark:hover:border-purple-600',
              'hover:shadow-xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/5',
              'focus:outline-none focus:ring-2 focus:ring-purple-500/50'
            )}
          >
            {/* Gradient bar at top */}
            <div className={cn('absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r', card.gradient)} />

            <div className="pt-2">
              <span className="text-4xl block mb-3">{card.icon}</span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5">{card.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{card.description}</p>

              <div className={cn(
                'mt-4 inline-flex items-center gap-1.5 text-sm font-semibold',
                'bg-gradient-to-r bg-clip-text text-transparent',
                card.gradient
              )}>
                Register
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Staff disabled card */}
      <motion.div variants={itemVariants} className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-xs cursor-not-allowed">
          <span>👨‍💼</span>
          Platform Staff — Not publicly available
        </div>
      </motion.div>

      {/* Back link */}
      <motion.div variants={itemVariants} className="text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </motion.div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// Step 2a: Institution Registration Form
// ═══════════════════════════════════════════════════════════════════════════════

function InstitutionForm({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InstitutionFormData>({
    resolver: zodResolver(institutionSchema),
  })

  const onSubmit = async (data: InstitutionFormData) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('type', data.type)
      formData.append('email', data.email)
      formData.append('phone', data.phone)
      formData.append('address', data.address)
      formData.append('city', data.city)
      formData.append('state', data.state)
      formData.append('country', data.country)
      if (data.postal_code) formData.append('postal_code', data.postal_code)
      if (data.website) formData.append('website', data.website)
      formData.append('admin_name', data.admin_name)
      formData.append('admin_email', data.admin_email)
      formData.append('admin_phone', data.admin_phone)
      formData.append('password', data.admin_password)
      formData.append('password_confirmation', data.admin_password_confirmation)

      await institutionApi.register(formData)
      toast.success('Institution registered successfully! Awaiting approval.')
      onSuccess()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = (hasError?: boolean) => cn(
    'block w-full px-3 py-2.5 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 sm:text-sm transition-all duration-200',
    'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm',
    'border-gray-300 dark:border-gray-600',
    'text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500',
    hasError && 'border-red-400 focus:ring-red-400/50 focus:border-red-400'
  )

  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'

  return (
    <motion.div
      className="max-w-2xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <span className="text-5xl block mb-3">🏫</span>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Register Institution</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Register your university, college, school, or training center.
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="gradient-border">
          <div className="glass dark:glass-dark rounded-2xl p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* ── Basic Information ── */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-xs font-bold">1</span>
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Institution Name</label>
                    <input type="text" className={inputClass(!!errors.name)} placeholder="e.g. University of Dhaka" {...register('name')} />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Institution Type</label>
                    <select className={inputClass(!!errors.type)} {...register('type')}>
                      <option value="">Select type</option>
                      <option value="school">School</option>
                      <option value="college">College</option>
                      <option value="university">University</option>
                      <option value="training_institute">Training Center</option>
                    </select>
                    {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Established Year</label>
                    <input type="text" className={inputClass()} placeholder="e.g. 1990" {...register('established_year')} />
                  </div>
                  <div>
                    <label className={labelClass}>Institution Email</label>
                    <input type="email" className={inputClass(!!errors.email)} placeholder="admin@institution.edu" {...register('email')} />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input type="text" className={inputClass(!!errors.phone)} placeholder="+8801700000000" {...register('phone')} />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Website (Optional)</label>
                    <input type="text" className={inputClass()} placeholder="https://www.university.edu" {...register('website')} />
                    {errors.website && <p className="mt-1 text-xs text-red-500">{errors.website.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Country</label>
                    <input type="text" className={inputClass(!!errors.country)} placeholder="Bangladesh" {...register('country')} />
                    {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>State / Division</label>
                    <input type="text" className={inputClass(!!errors.state)} placeholder="Dhaka" {...register('state')} />
                    {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>City</label>
                    <input type="text" className={inputClass(!!errors.city)} placeholder="Dhaka" {...register('city')} />
                    {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Postal Code</label>
                    <input type="text" className={inputClass()} placeholder="1205" {...register('postal_code')} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Full Address</label>
                    <textarea className={cn(inputClass(!!errors.address), 'resize-none')} rows={2} placeholder="Street address, area..." {...register('address')} />
                    {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
                  </div>
                </div>
              </div>

              {/* ── Administrator Info ── */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-xs font-bold">2</span>
                  Institution Administrator
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">This person becomes the first Institution Admin.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Full Name</label>
                    <input type="text" className={inputClass(!!errors.admin_name)} placeholder="Dr. John Smith" {...register('admin_name')} />
                    {errors.admin_name && <p className="mt-1 text-xs text-red-500">{errors.admin_name.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Official Email</label>
                    <input type="email" className={inputClass(!!errors.admin_email)} placeholder="admin@institution.edu" {...register('admin_email')} />
                    {errors.admin_email && <p className="mt-1 text-xs text-red-500">{errors.admin_email.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Phone</label>
                    <input type="text" className={inputClass(!!errors.admin_phone)} placeholder="+8801700000000" {...register('admin_phone')} />
                    {errors.admin_phone && <p className="mt-1 text-xs text-red-500">{errors.admin_phone.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Password</label>
                    <input type="password" className={inputClass(!!errors.admin_password)} placeholder="Min. 8 characters" {...register('admin_password')} />
                    {errors.admin_password && <p className="mt-1 text-xs text-red-500">{errors.admin_password.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Confirm Password</label>
                    <input type="password" className={inputClass(!!errors.admin_password_confirmation)} placeholder="Confirm password" {...register('admin_password_confirmation')} />
                    {errors.admin_password_confirmation && <p className="mt-1 text-xs text-red-500">{errors.admin_password_confirmation.message}</p>}
                  </div>
                </div>
              </div>

              {/* ── Verification ── */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-xs font-bold">3</span>
                  Verification
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded cursor-pointer" {...register('accept_terms')} />
                    <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200">
                      I accept the{' '}
                      <a href="#" className="text-purple-600 hover:text-purple-500 underline">Terms & Conditions</a>
                    </span>
                  </label>
                  {errors.accept_terms && <p className="text-xs text-red-500">{errors.accept_terms.message}</p>}
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded cursor-pointer" {...register('accept_privacy')} />
                    <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200">
                      I accept the{' '}
                      <a href="#" className="text-purple-600 hover:text-purple-500 underline">Privacy Policy</a>
                    </span>
                  </label>
                  {errors.accept_privacy && <p className="text-xs text-red-500">{errors.accept_privacy.message}</p>}
                </div>
              </div>

              {/* ── Actions ── */}
              <div className="flex items-center gap-3 pt-4">
                <button type="button" onClick={onBack} className="btn-secondary flex-1">Back</button>
                <button type="submit" disabled={isSubmitting} className={cn(
                  'flex-[2] py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-300',
                  'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500',
                  'shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30',
                  isSubmitting && 'opacity-75 cursor-not-allowed'
                )}>
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Registering...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Register Institution
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// Step 2b: Student Registration Form
// ═══════════════════════════════════════════════════════════════════════════════

function StudentForm({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const { register: registerUser, isLoading } = useAuth()

  // Institution search
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<InstitutionSearchResult[]>([])
  const [selectedInstitution, setSelectedInstitution] = useState<InstitutionSearchResult | null>(null)
  const [showResults, setShowResults] = useState(false)
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>()

  // Cascading selects
  const [departments, setDepartments] = useState<CascadingSelectOption[]>([])
  const [programs, setPrograms] = useState<CascadingSelectOption[]>([])
  const [semesters, setSemesters] = useState<CascadingSelectOption[]>([])
  const [sections, setSections] = useState<CascadingSelectOption[]>([])

  const [selectedDept, setSelectedDept] = useState('')
  const [selectedProgram, setSelectedProgram] = useState('')
  const [selectedSemester, setSelectedSemester] = useState('')
  const [selectedSection, setSelectedSection] = useState('')

  // Survey tracking
  const [surveyStep, setSurveyStep] = useState<'personal' | 'institution' | 'account' | 'face'>('personal')

  // Personal info form
  const personalForm = useForm<StudentPersonalData>({
    resolver: zodResolver(studentPersonalSchema),
  })

  // Account form
  const accountForm = useForm<StudentAccountData>({
    resolver: zodResolver(studentAccountSchema),
  })

  // Form data accumulator
  const [personalData, setPersonalData] = useState<StudentPersonalData | null>(null)

  // ── Institution search ──────────────────────────────────────────────────
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value)
    if (searchTimeout.current) clearTimeout(searchTimeout.current)

    if (value.length < 2) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await institutionApi.search(value)
        setSearchResults(res.data.data)
        setShowResults(true)
      } catch {
        setSearchResults([])
      }
    }, 300)
  }, [])

  const selectInstitution = (inst: InstitutionSearchResult) => {
    setSelectedInstitution(inst)
    setShowResults(false)
    setSearchTerm(inst.name)
    // Reset cascading selects
    setDepartments([])
    setPrograms([])
    setSemesters([])
    setSections([])
    setSelectedDept('')
    setSelectedProgram('')
    setSelectedSemester('')
    setSelectedSection('')
    // Fetch departments
    institutionApi.departments(inst.id).then(res => setDepartments(res.data.data)).catch(() => {})
  }

  const handleDeptChange = (deptId: string) => {
    setSelectedDept(deptId)
    setPrograms([])
    setSemesters([])
    setSections([])
    setSelectedProgram('')
    setSelectedSemester('')
    setSelectedSection('')
    if (deptId && selectedInstitution) {
      institutionApi.programs(selectedInstitution.id).then(res => setPrograms(res.data.data)).catch(() => {})
    }
  }

  const handleProgramChange = (progId: string) => {
    setSelectedProgram(progId)
    setSemesters([])
    setSections([])
    setSelectedSemester('')
    setSelectedSection('')
    if (progId && selectedInstitution) {
      institutionApi.semesters(selectedInstitution.id).then(res => setSemesters(res.data.data)).catch(() => {})
    }
  }

  const handleSemesterChange = (semId: string) => {
    setSelectedSemester(semId)
    setSections([])
    setSelectedSection('')
    if (semId && selectedInstitution) {
      institutionApi.sections(selectedInstitution.id).then(res => setSections(res.data.data)).catch(() => {})
    }
  }

  // ── Submit handlers ─────────────────────────────────────────────────────
  const handlePersonalSubmit = (data: StudentPersonalData) => {
    setPersonalData(data)
    setSurveyStep('institution')
  }

  const handleAccountSubmit = async (data: StudentAccountData) => {
    if (!personalData || !selectedInstitution) {
      toast.error('Please complete all previous steps.')
      return
    }

    try {
      await registerUser({
        name: `${personalData.first_name} ${personalData.last_name}`,
        email: personalData.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        role: 'student',
        institution_id: selectedInstitution.id,
        student_id: data.student_id,
        department_id: selectedDept ? Number(selectedDept) : undefined,
        program_id: selectedProgram ? Number(selectedProgram) : undefined,
        semester_id: selectedSemester ? Number(selectedSemester) : undefined,
        section_id: selectedSection ? Number(selectedSection) : undefined,
        phone: personalData.phone,
        gender: personalData.gender,
        date_of_birth: personalData.date_of_birth,
      })
      toast.success('Registration submitted! Awaiting institution approval.')
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || 'Registration failed.')
    }
  }

  const inputClass = (hasError?: boolean) => cn(
    'block w-full px-3 py-2.5 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 sm:text-sm transition-all duration-200',
    'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm',
    'border-gray-300 dark:border-gray-600',
    'text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500',
    hasError && 'border-red-400 focus:ring-red-400/50 focus:border-red-400'
  )

  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'
  const stepIndicator = (step: string, label: string) => {
    const steps = ['personal', 'institution', 'account', 'face']
    const currentIdx = steps.indexOf(surveyStep)
    const thisIdx = steps.indexOf(step)
    const isComplete = thisIdx < currentIdx
    const isCurrent = thisIdx === currentIdx

    return (
      <button
        type="button"
        onClick={() => {
          if (isComplete) setSurveyStep(step as any)
        }}
        className={cn(
          'flex items-center gap-2 text-sm font-medium transition-colors',
          isCurrent ? 'text-purple-600 dark:text-purple-400' : isComplete ? 'text-green-600 dark:text-green-400 cursor-pointer hover:text-green-500' : 'text-gray-400 dark:text-gray-600 cursor-default'
        )}
      >
        <span className={cn(
          'flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold border-2 transition-colors',
          isCurrent ? 'border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
          isComplete ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
          'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-600'
        )}>
          {isComplete ? (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : step === 'personal' ? '1' : step === 'institution' ? '2' : step === 'account' ? '3' : '4'}
        </span>
        {label}
      </button>
    )
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <span className="text-5xl block mb-3">🎓</span>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Student Registration</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Join your institution and access attendance.</p>
      </motion.div>

      {/* Step indicator */}
      <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 mb-8 flex-wrap">
        {stepIndicator('personal', 'Personal')}
        <span className="text-gray-300 dark:text-gray-600">→</span>
        {stepIndicator('institution', 'Institution')}
        <span className="text-gray-300 dark:text-gray-600">→</span>
        {stepIndicator('account', 'Account')}
        <span className="text-gray-300 dark:text-gray-600">→</span>
        {stepIndicator('face', 'Face')}
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="gradient-border">
          <div className="glass dark:glass-dark rounded-2xl p-8">
            <AnimatePresence mode="wait">
              {surveyStep === 'personal' && (
                <motion.form
                  key="personal"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={personalForm.handleSubmit(handlePersonalSubmit)}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>First Name</label>
                      <input type="text" className={inputClass(!!personalForm.formState.errors.first_name)} placeholder="John" {...personalForm.register('first_name')} />
                      {personalForm.formState.errors.first_name && <p className="mt-1 text-xs text-red-500">{personalForm.formState.errors.first_name.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Last Name</label>
                      <input type="text" className={inputClass(!!personalForm.formState.errors.last_name)} placeholder="Doe" {...personalForm.register('last_name')} />
                      {personalForm.formState.errors.last_name && <p className="mt-1 text-xs text-red-500">{personalForm.formState.errors.last_name.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Gender (Optional)</label>
                      <select className={inputClass()} {...personalForm.register('gender')}>
                        <option value="">Prefer not to say</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Date of Birth (Optional)</label>
                      <input type="date" className={inputClass()} {...personalForm.register('date_of_birth')} />
                    </div>
                    <div>
                      <label className={labelClass}>Phone</label>
                      <input type="text" className={inputClass(!!personalForm.formState.errors.phone)} placeholder="+8801700000000" {...personalForm.register('phone')} />
                      {personalForm.formState.errors.phone && <p className="mt-1 text-xs text-red-500">{personalForm.formState.errors.phone.message}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Personal Email</label>
                      <input type="email" className={inputClass(!!personalForm.formState.errors.email)} placeholder="john@example.com" {...personalForm.register('email')} />
                      {personalForm.formState.errors.email && <p className="mt-1 text-xs text-red-500">{personalForm.formState.errors.email.message}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-4">
                    <button type="button" onClick={onBack} className="btn-secondary flex-1">Back</button>
                    <button type="submit" className="flex-[2] py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-400 hover:to-green-400 shadow-lg shadow-teal-500/25">
                      Continue →
                    </button>
                  </div>
                </motion.form>
              )}

              {surveyStep === 'institution' && (
                <motion.div
                  key="institution"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Institution Information</h3>

                  {/* Institution Search */}
                  <div className="relative">
                    <label className={labelClass}>Search Institution</label>
                    <input
                      type="text"
                      className={inputClass()}
                      placeholder="Type your institution name..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      onFocus={() => { if (searchResults.length > 0) setShowResults(true) }}
                      onBlur={() => setTimeout(() => setShowResults(false), 200)}
                    />
                    <AnimatePresence>
                      {showResults && searchResults.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-60 overflow-y-auto"
                        >
                          {searchResults.map((inst) => (
                            <button
                              key={inst.id}
                              type="button"
                              className="w-full text-left px-4 py-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
                              onMouseDown={() => selectInstitution(inst)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-teal-100 dark:from-purple-900 dark:to-teal-900 flex items-center justify-center text-lg flex-shrink-0">
                                  {inst.type === 'university' ? '🏛' : inst.type === 'college' ? '🏫' : inst.type === 'school' ? '📚' : '🎯'}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">{inst.name}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{inst.city}, {inst.state}</p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Cascading selects */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className={labelClass}>Department</label>
                      <select className={inputClass()} value={selectedDept} onChange={(e) => handleDeptChange(e.target.value)} disabled={!selectedInstitution}>
                        <option value="">Select Department</option>
                        {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Program</label>
                      <select className={inputClass()} value={selectedProgram} onChange={(e) => handleProgramChange(e.target.value)} disabled={!selectedDept}>
                        <option value="">Select Program</option>
                        {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Semester</label>
                      <select className={inputClass()} value={selectedSemester} onChange={(e) => handleSemesterChange(e.target.value)} disabled={!selectedProgram}>
                        <option value="">Select Semester</option>
                        {semesters.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Section</label>
                      <select className={inputClass()} value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} disabled={!selectedSemester}>
                        <option value="">Select Section</option>
                        {sections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <button type="button" onClick={() => setSurveyStep('personal')} className="btn-secondary flex-1">Back</button>
                    <button
                      type="button"
                      onClick={() => setSurveyStep('account')}
                      disabled={!selectedInstitution || !selectedDept || !selectedProgram || !selectedSemester || !selectedSection}
                      className={cn(
                        'flex-[2] py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-300',
                        'bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-400 hover:to-green-400 shadow-lg shadow-teal-500/25',
                        (!selectedInstitution || !selectedDept || !selectedProgram || !selectedSemester || !selectedSection) && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      Continue →
                    </button>
                  </div>
                </motion.div>
              )}

              {surveyStep === 'account' && (
                <motion.form
                  key="account"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={accountForm.handleSubmit(handleAccountSubmit)}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Setup</h3>
                  <div>
                    <label className={labelClass}>Student ID</label>
                    <input type="text" className={inputClass(!!accountForm.formState.errors.student_id)} placeholder="e.g. STU-2024-001" {...accountForm.register('student_id')} />
                    {accountForm.formState.errors.student_id && <p className="mt-1 text-xs text-red-500">{accountForm.formState.errors.student_id.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Password</label>
                    <input type="password" className={inputClass(!!accountForm.formState.errors.password)} placeholder="Min. 8 characters" {...accountForm.register('password')} />
                    {accountForm.formState.errors.password && <p className="mt-1 text-xs text-red-500">{accountForm.formState.errors.password.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Confirm Password</label>
                    <input type="password" className={inputClass(!!accountForm.formState.errors.password_confirmation)} placeholder="Confirm your password" {...accountForm.register('password_confirmation')} />
                    {accountForm.formState.errors.password_confirmation && <p className="mt-1 text-xs text-red-500">{accountForm.formState.errors.password_confirmation.message}</p>}
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <button type="button" onClick={() => setSurveyStep('institution')} className="btn-secondary flex-1">Back</button>
                    <button type="submit" disabled={isLoading} className={cn(
                      'flex-[2] py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-300',
                      'bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-400 hover:to-green-400 shadow-lg shadow-teal-500/25',
                      isLoading && 'opacity-75 cursor-not-allowed'
                    )}>
                      {isLoading ? 'Registering...' : 'Register →'}
                    </button>
                  </div>
                </motion.form>
              )}

              {surveyStep === 'face' && (
                <motion.div
                  key="face"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 text-center"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Face Enrollment</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Face enrollment helps verify your identity for attendance. You can do this later from your profile.
                  </p>

                  <div className="max-w-xs mx-auto aspect-[3/4] bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center border-2 border-dashed border-purple-300 dark:border-purple-700">
                    <div className="text-center p-6">
                      <span className="text-5xl block mb-3">📷</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Camera access needed</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Front · Left · Right · Blink</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <button type="button" onClick={() => setSurveyStep('account')} className="btn-secondary flex-1">Back</button>
                    <button
                      type="button"
                      onClick={onSuccess}
                      className="flex-[2] py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-400 hover:to-green-400 shadow-lg shadow-teal-500/25"
                    >
                      Skip for now →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// Step 2c: Teacher Registration Form
// ═══════════════════════════════════════════════════════════════════════════════

function TeacherForm({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const { register: registerUser, isLoading } = useAuth()

  // Institution search
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<InstitutionSearchResult[]>([])
  const [selectedInstitution, setSelectedInstitution] = useState<InstitutionSearchResult | null>(null)
  const [showResults, setShowResults] = useState(false)
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>()
  const [departments, setDepartments] = useState<CascadingSelectOption[]>([])
  const [selectedDept, setSelectedDept] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
  })

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value)
    if (searchTimeout.current) clearTimeout(searchTimeout.current)

    if (value.length < 2) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await institutionApi.search(value)
        setSearchResults(res.data.data)
        setShowResults(true)
      } catch {
        setSearchResults([])
      }
    }, 300)
  }, [])

  const selectInstitution = (inst: InstitutionSearchResult) => {
    setSelectedInstitution(inst)
    setShowResults(false)
    setSearchTerm(inst.name)
    setValue('institution_id', inst.id)
    setDepartments([])
    setSelectedDept('')
    institutionApi.departments(inst.id).then(res => setDepartments(res.data.data)).catch(() => {})
  }

  const onSubmit = async (data: TeacherFormData) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        role: 'teacher',
        institution_id: data.institution_id,
        department_id: data.department_id,
        employee_id: data.employee_id,
        phone: data.phone,
      })
      toast.success('Teacher registration submitted! Awaiting approval.')
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || 'Registration failed.')
    }
  }

  const inputClass = (hasError?: boolean) => cn(
    'block w-full px-3 py-2.5 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 sm:text-sm transition-all duration-200',
    'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm',
    'border-gray-300 dark:border-gray-600',
    'text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500',
    hasError && 'border-red-400 focus:ring-red-400/50 focus:border-red-400'
  )

  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'

  return (
    <motion.div
      className="max-w-2xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <span className="text-5xl block mb-3">👨‍🏫</span>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Teacher Registration</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create your teacher account.</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="gradient-border">
          <div className="glass dark:glass-dark rounded-2xl p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Institution Search */}
              <div className="relative">
                <label className={labelClass}>Search Institution</label>
                <input
                  type="text"
                  className={inputClass()}
                  placeholder="Type your institution name..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => { if (searchResults.length > 0) setShowResults(true) }}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                />
                <AnimatePresence>
                  {showResults && searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-60 overflow-y-auto"
                    >
                      {searchResults.map((inst) => (
                        <button
                          key={inst.id}
                          type="button"
                          className="w-full text-left px-4 py-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
                          onMouseDown={() => selectInstitution(inst)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900 dark:to-pink-900 flex items-center justify-center text-lg flex-shrink-0">
                              {inst.type === 'university' ? '🏛' : inst.type === 'college' ? '🏫' : '📚'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{inst.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{inst.city}, {inst.state}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Department */}
              <div>
                <label className={labelClass}>Department</label>
                <select className={inputClass(!!errors.department_id)} {...register('department_id', { valueAsNumber: true })} disabled={!selectedInstitution}>
                  <option value="">Select Department</option>
                  {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
                {errors.department_id && <p className="mt-1 text-xs text-red-500">{errors.department_id.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Employee ID</label>
                  <input type="text" className={inputClass(!!errors.employee_id)} placeholder="e.g. EMP-2024-001" {...register('employee_id')} />
                  {errors.employee_id && <p className="mt-1 text-xs text-red-500">{errors.employee_id.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input type="text" className={inputClass(!!errors.name)} placeholder="Dr. John Smith" {...register('name')} />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Official Email</label>
                  <input type="email" className={inputClass(!!errors.email)} placeholder="john@institution.edu" {...register('email')} />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input type="text" className={inputClass(!!errors.phone)} placeholder="+8801700000000" {...register('phone')} />
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Password</label>
                  <input type="password" className={inputClass(!!errors.password)} placeholder="Min. 8 characters" {...register('password')} />
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Confirm Password</label>
                  <input type="password" className={inputClass(!!errors.password_confirmation)} placeholder="Confirm password" {...register('password_confirmation')} />
                  {errors.password_confirmation && <p className="mt-1 text-xs text-red-500">{errors.password_confirmation.message}</p>}
                </div>
              </div>

              {/* Face Enrollment (Optional) */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Enable face enrollment (recommended for faster attendance)</span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button type="button" onClick={onBack} className="btn-secondary flex-1">Back</button>
                <button type="submit" disabled={isLoading} className={cn(
                  'flex-[2] py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-300',
                  'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400 shadow-lg shadow-orange-500/25',
                  isLoading && 'opacity-75 cursor-not-allowed'
                )}>
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Registering...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Register as Teacher
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// Step 3: Success screen
// ═══════════════════════════════════════════════════════════════════════════════

function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      className="max-w-md mx-auto text-center space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center animate-bounce-gentle">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Registration Successful!</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Your account has been submitted for review. You will receive a notification once it has been approved.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
        <p className="text-sm text-green-700 dark:text-green-300">
          ✅ Our team will review your application. Please check your email for updates.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col gap-3">
        <Link
          to="/login"
          className="inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 shadow-lg shadow-purple-500/25 transition-all duration-300"
        >
          Go to Login
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
        <button
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          Register another account
        </button>
      </motion.div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main RegisterPage
// ═══════════════════════════════════════════════════════════════════════════════

export default function RegisterPage() {
  const [step, setStep] = useState<RegistrationStep>('select')

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorations */}
      <FloatingOrbs />
      <div className="absolute inset-0 grid-bg opacity-50" />

      <div className="relative w-full max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <RoleSelection onSelect={setStep} />
            </motion.div>
          )}

          {step === 'institution' && (
            <motion.div
              key="institution"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <InstitutionForm onBack={() => setStep('select')} onSuccess={() => setStep('success')} />
            </motion.div>
          )}

          {step === 'student' && (
            <motion.div
              key="student"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StudentForm onBack={() => setStep('select')} onSuccess={() => setStep('success')} />
            </motion.div>
          )}

          {step === 'teacher' && (
            <motion.div
              key="teacher"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TeacherForm onBack={() => setStep('select')} onSuccess={() => setStep('success')} />
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SuccessScreen onReset={() => setStep('select')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

