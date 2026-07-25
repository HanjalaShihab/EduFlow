import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../lib/utils'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

// ─── Floating Orbs ─────────────────────────────────────────────────────────────
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

// ─── Container variants for staggered children ────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
  },
}

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data)
      toast.success('Login successful!')
    } catch (error: any) {
      toast.error(error.message || 'Login failed.')
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorations */}
      <FloatingOrbs />
      <div className="absolute inset-0 grid-bg opacity-50" />

      <motion.div
        className="relative max-w-md w-full space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back link */}
        <motion.div variants={itemVariants} className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="mx-auto relative w-16 h-16 mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-teal-500 rounded-2xl animate-pulse-slow" />
            <div className="absolute inset-0.5 bg-white dark:bg-gray-900 rounded-[14px] flex items-center justify-center">
              <svg
                className="w-9 h-9 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome to <span className="gradient-text">EduFlow</span>
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </motion.div>

        {/* Glass Card */}
        <motion.div variants={itemVariants}>
          <div className="gradient-border">
            <div className="glass dark:glass-dark rounded-2xl p-8">
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                        />
                      </svg>
                    </div>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      className={cn(
                        'block w-full pl-10 pr-3 py-2.5 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 sm:text-sm transition-all duration-200',
                        'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm',
                        'border-gray-300 dark:border-gray-600',
                        'text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500',
                        errors.email && 'border-red-400 focus:ring-red-400/50 focus:border-red-400'
                      )}
                      placeholder="Enter your email"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                      {errors.email.message}
                    </motion.p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                        />
                      </svg>
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      className={cn(
                        'block w-full pl-10 pr-10 py-2.5 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 sm:text-sm transition-all duration-200',
                        'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm',
                        'border-gray-300 dark:border-gray-600',
                        'text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500',
                        errors.password && 'border-red-400 focus:ring-red-400/50 focus:border-red-400'
                      )}
                      placeholder="Enter your password"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                      {errors.password.message}
                    </motion.p>
                  )}
                </div>

                {/* Remember me & Forgot password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                      Remember me
                    </span>
                  </label>
                  <a
                    href="#"
                    className="text-sm font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                  >
                    Forgot your password?
                  </a>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    'group relative w-full flex justify-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-300 overflow-hidden',
                    'bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400',
                    'shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30',
                    isLoading && 'opacity-75 cursor-not-allowed'
                  )}
                >
                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 bg-white/20 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity" />

                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Sign in
                      <svg
                        className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="mt-8 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-500 dark:text-gray-400 rounded-full">
                    New to EduFlow?
                  </span>
                </div>
              </div>

              {/* Register link */}
              <div className="mt-6 text-center">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors group"
                >
                  Create an account
                  <svg
                    className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick access roles */}
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">Quick access for:</p>
          <div className="flex justify-center gap-3 flex-wrap">
            {[
              { role: 'Platform Admin', color: 'from-purple-500 to-purple-600' },
              { role: 'Institution Admin', color: 'from-teal-400 to-teal-500' },
              { role: 'Teacher', color: 'from-purple-400 to-teal-400' },
              { role: 'Student', color: 'from-teal-500 to-purple-500' },
            ].map((item) => (
              <span
                key={item.role}
                className={cn(
                  'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                  'bg-gradient-to-r text-white opacity-80 hover:opacity-100 transition-opacity cursor-default',
                  item.color
                )}
              >
                {item.role}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

