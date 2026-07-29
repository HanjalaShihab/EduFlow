import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import LandingPage from './pages/LandingPage'
import HowItWorks from './pages/HowItWorks'
import About from './pages/About'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import InstitutionAdminDashboard from './pages/institution/DashboardPage'
import TeacherDashboard from './pages/teacher/DashboardPage'
import StudentDashboard from './pages/student/DashboardPage'
import SuperAdminLayout from './components/SuperAdminLayout'

// Eagerly import critical Super Admin pages (most visited) to avoid white flash on first load
import SuperAdminDashboard from './pages/admin/DashboardPage'
import SuperAdminInstitutions from './pages/admin/InstitutionsPage'

// Lazy load remaining Super Admin pages for better performance
const SuperAdminRegistrations = React.lazy(() => import('./pages/admin/RegistrationsPage'))
const SuperAdminUsers = React.lazy(() => import('./pages/admin/UsersPage'))
const SuperAdminSubscriptions = React.lazy(() => import('./pages/admin/SubscriptionsPage'))
const SuperAdminAnalytics = React.lazy(() => import('./pages/admin/AnalyticsPage'))
const SuperAdminAIMonitoring = React.lazy(() => import('./pages/admin/AIMonitoringPage'))
const SuperAdminSupport = React.lazy(() => import('./pages/admin/SupportPage'))
const SuperAdminNotifications = React.lazy(() => import('./pages/admin/NotificationsPage'))
const SuperAdminAuditLogs = React.lazy(() => import('./pages/admin/AuditLogsPage'))
const SuperAdminSystemHealth = React.lazy(() => import('./pages/admin/SystemHealthPage'))
const SuperAdminSecurity = React.lazy(() => import('./pages/admin/SecurityPage'))
const SuperAdminSettings = React.lazy(() => import('./pages/admin/SettingsPage'))
const SuperAdminRoles = React.lazy(() => import('./pages/admin/RolesPage'))
const SuperAdminBackup = React.lazy(() => import('./pages/admin/BackupPage'))
const SuperAdminReports = React.lazy(() => import('./pages/admin/ReportsPage'))
const SuperAdminApiKeys = React.lazy(() => import('./pages/admin/ApiKeysPage'))

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="h-12 w-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
  </div>
)

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" replace />

  return <>{children}</>
}

interface PublicRouteProps {
  children: React.ReactNode
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth()

  if (!isLoading && user) {
    const dashboardMap: Record<string, string> = {
      platform_admin: '/admin/dashboard',
      institution_admin: '/institution/dashboard',
      teacher: '/teacher/dashboard',
      student: '/student/dashboard',
    }
    return <Navigate to={dashboardMap[user.role] || '/login'} replace />
  }

  return <>{children}</>
}

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/about" element={<About />} />

      {/* Super Admin (Platform Admin) routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['platform_admin']}>
          <Suspense fallback={<PageLoader />}>
            <SuperAdminLayout />
          </Suspense>
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        <Route path="institutions" element={<SuperAdminInstitutions />} />
        <Route path="registrations" element={<SuperAdminRegistrations />} />
        <Route path="users" element={<SuperAdminUsers />} />
        <Route path="subscriptions" element={<SuperAdminSubscriptions />} />
        <Route path="analytics" element={<SuperAdminAnalytics />} />
        <Route path="ai-monitoring" element={<SuperAdminAIMonitoring />} />
        <Route path="support" element={<SuperAdminSupport />} />
        <Route path="notifications" element={<SuperAdminNotifications />} />
        <Route path="audit-logs" element={<SuperAdminAuditLogs />} />
        <Route path="system-health" element={<SuperAdminSystemHealth />} />
        <Route path="security" element={<SuperAdminSecurity />} />
        <Route path="settings" element={<SuperAdminSettings />} />
        <Route path="roles" element={<SuperAdminRoles />} />
        <Route path="backup" element={<SuperAdminBackup />} />
        <Route path="reports" element={<SuperAdminReports />} />
        <Route path="api-keys" element={<SuperAdminApiKeys />} />
      </Route>

        {/* Legacy platform admin redirect */}
        <Route path="/platform/dashboard" element={
          <ProtectedRoute allowedRoles={['platform_admin']}>
            <Navigate to="/admin/dashboard" replace />
          </ProtectedRoute>
        } />

        {/* Institution Admin dashboard */}
        <Route path="/institution/dashboard" element={
          <ProtectedRoute allowedRoles={['institution_admin']}>
            <InstitutionAdminDashboard />
          </ProtectedRoute>
        } />

        {/* Teacher dashboard */}
        <Route path="/teacher/dashboard" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherDashboard />
          </ProtectedRoute>
        } />

        {/* Student dashboard */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />

{/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  )
}

export default App
