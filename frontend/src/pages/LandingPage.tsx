import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────
interface StatItem {
  value: string
  label: string
  suffix: string
}

interface FeatureItem {
  title: string
  description: string
  icon: React.ReactNode
  gradient: string
}

interface StepItem {
  number: string
  title: string
  description: string
  icon: React.ReactNode
}

interface TestimonialItem {
  name: string
  role: string
  institution: string
  avatar: string
  content: string
  rating: number
}

interface PricingPlan {
  name: string
  price: number
  period: string
  description: string
  features: string[]
  highlighted: boolean
  cta: string
  gradient: string
}

interface FAQItem {
  question: string
  answer: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const stats: StatItem[] = [
  { value: '99.9', label: 'Accuracy Rate', suffix: '%' },
  { value: '10', label: 'Students Covered', suffix: 'K+' },
  { value: '100', label: 'Institutions', suffix: '+' },
  { value: '1', label: 'Attendances Marked', suffix: 'M+' },
]

const features: FeatureItem[] = [
  {
    title: 'Face Recognition',
    description: 'High-accuracy face matching using InsightFace AI for secure and frictionless attendance marking in real-time.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    title: 'Liveness Detection',
    description: 'Advanced anti-spoofing with blink, smile, and head movement detection to prevent fraudulent attempts effectively.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    gradient: 'from-teal-400 to-teal-500',
  },
  {
    title: 'Keyword Verification',
    description: 'Teachers generate unique session keywords announced in class as an additional attendance verification layer.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
      </svg>
    ),
    gradient: 'from-purple-400 to-teal-400',
  },
  {
    title: 'Real-time Analytics',
    description: 'Live attendance tracking with comprehensive reports and insights for teachers and administrators.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    gradient: 'from-teal-500 to-purple-500',
  },
  {
    title: 'Multi-tenant SaaS',
    description: 'Fully multi-tenant architecture supporting schools, colleges, universities, and training institutes of all sizes.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008z" />
      </svg>
    ),
    gradient: 'from-purple-600 to-teal-500',
  },
  {
    title: 'Automated Reports',
    description: 'Daily, weekly, and monthly attendance reports with PDF and Excel export for institutional compliance needs.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    gradient: 'from-teal-400 to-purple-600',
  },
]

const steps: StepItem[] = [
  {
    number: '01',
    title: 'Create Session',
    description: 'Teachers create an attendance session for their class with a specified time window and parameters.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Generate Keyword',
    description: 'A unique keyword is generated for the session and announced verbally in the classroom to students.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Mark Attendance',
    description: 'Students mark attendance by entering the keyword and completing a quick face verification process.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Review & Analyze',
    description: 'Teachers review low-confidence matches and access detailed attendance analytics and reports.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
]

const testimonials: TestimonialItem[] = [
  {
    name: 'Dr. Sarah Mitchell',
    role: 'Principal',
    institution: 'Riverside Academy',
    avatar: 'SM',
    content: 'EduFlow has revolutionized our attendance system. The face recognition is incredibly accurate and our students love the seamless experience.',
    rating: 5,
  },
  {
    name: 'Prof. James Chen',
    role: 'Head of IT',
    institution: 'Tech Valley University',
    avatar: 'JC',
    content: 'The multi-tenant architecture made deployment across our campus incredibly smooth. The analytics dashboard gives us insights we never had before.',
    rating: 5,
  },
  {
    name: 'Maria Rodriguez',
    role: 'Administrator',
    institution: 'Global Learning Institute',
    avatar: 'MR',
    content: 'We reduced attendance marking time by 85%. The liveness detection gives us confidence that the system is secure against any kind of fraud.',
    rating: 5,
  },
  {
    name: 'Dr. Ahmed Hassan',
    role: 'Dean of Academics',
    institution: 'Al-Mustaqbal University',
    avatar: 'AH',
    content: 'The automated reporting feature alone saves us hours every week. PDF and Excel exports make compliance reporting effortless.',
    rating: 5,
  },
]

const pricingPlans: PricingPlan[] = [
  {
    name: 'Starter',
    price: 0,
    period: 'month',
    description: 'Perfect for small institutions getting started with digital attendance.',
    features: [
      'Up to 100 students',
      'Basic face recognition',
      'Manual reports',
      'Email support',
      '1 teacher account',
      'Basic analytics',
    ],
    highlighted: false,
    cta: 'Get Started Free',
    gradient: 'from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700',
  },
  {
    name: 'Professional',
    price: 49,
    period: 'month',
    description: 'Ideal for growing institutions that need advanced features and analytics.',
    features: [
      'Up to 1,000 students',
      'Advanced face recognition',
      'Liveness detection',
      'Keyword verification',
      'Real-time analytics',
      'Automated reports',
      'Priority support',
      'API access',
    ],
    highlighted: true,
    cta: 'Start Free Trial',
    gradient: 'from-purple-500 to-teal-500',
  },
  {
    name: 'Enterprise',
    price: 149,
    period: 'month',
    description: 'For large institutions with multiple departments and complex requirements.',
    features: [
      'Unlimited students',
      'Everything in Professional',
      'Multi-campus support',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom reporting',
      'SSO & SAML',
      '24/7 phone support',
    ],
    highlighted: false,
    cta: 'Contact Sales',
    gradient: 'from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700',
  },
]

const faqs: FAQItem[] = [
  {
    question: 'How accurate is the face recognition system?',
    answer: 'Our face recognition system achieves 99.9% accuracy using state-of-the-art InsightFace AI models. It works reliably across different lighting conditions, angles, and even with accessories like glasses or masks.',
  },
  {
    question: 'Is the system secure against fraud?',
    answer: 'Yes, we employ multiple layers of security including liveness detection (blink, smile, head movement detection), keyword verification, and confidence-based review system to prevent any fraudulent attempts.',
  },
  {
    question: 'Can it integrate with existing school systems?',
    answer: 'Absolutely! EduFlow offers REST API access and can integrate with most Student Information Systems (SIS), Learning Management Systems (LMS), and other educational software.',
  },
  {
    question: 'What kind of support do you provide?',
    answer: 'We provide tiered support based on your plan. Starter plans get email support, Professional gets priority support, and Enterprise customers have a dedicated account manager with 24/7 phone support.',
  },
  {
    question: 'How long does implementation take?',
    answer: 'Most institutions are fully set up within 2-3 days. Our team handles the initial configuration, and we provide comprehensive documentation and training materials for your staff.',
  },
  {
    question: 'Is my data safe and compliant?',
    answer: 'Yes, we are fully compliant with FERPA, GDPR, and other data protection regulations. All face encodings are encrypted at rest and in transit, and we never share your data with third parties.',
  },
]

// ─── Components ───────────────────────────────────────────────────────────────

// ─── Animated Counter ──────────────────────────────────────────────────────────
function AnimatedCounter({ value, suffix, decimals = 0 }: { value: string; suffix: string; decimals?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const target = parseFloat(value.replace(/[^0-9.-]/g, ''))

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 2000
    const step = Math.max(1, Math.floor(target / (duration / 16)))
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, target])

  return (
    <div ref={ref}>
      <motion.span
        className="text-4xl sm:text-5xl font-bold gradient-text"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ type: 'spring', stiffness: 100, damping: 10 }}
      >
        {count.toFixed(decimals)}{suffix}
      </motion.span>
    </div>
  )
}

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

// ─── AnimatedGrid ──────────────────────────────────────────────────────────────
function AnimatedGrid() {
  return (
    <div className="absolute inset-0 grid-bg opacity-50" />
  )
}

// ─── ScrollReveal ──────────────────────────────────────────────────────────────
function ScrollReveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ─── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-dark shadow-lg' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-teal-500 rounded-xl animate-pulse-slow" />
              <div className="absolute inset-0.5 bg-white dark:bg-gray-900 rounded-[10px] flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <span className="text-xl font-bold">
              <span className="gradient-text">EduFlow</span>
            </span>
          </motion.div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Features', href: '#features', isHash: true },
              { label: 'How It Works', href: '/how-it-works', isHash: false },
              { label: 'Pricing', href: '#pricing', isHash: true },
              { label: 'About', href: '/about', isHash: false },
            ].map((link) =>
              link.isHash ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors animated-border pb-0.5"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors animated-border pb-0.5"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Desktop buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 text-sm font-medium text-white rounded-full bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden glass-dark"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
              {[
                { label: 'Features', href: '#features', isHash: true },
                { label: 'How It Works', href: '/how-it-works', isHash: false },
                { label: 'Pricing', href: '#pricing', isHash: true },
                { label: 'About', href: '/about', isHash: false },
              ].map((link) =>
                link.isHash ? (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="pt-3 space-y-3">
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center px-4 py-3 text-base font-medium text-white rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const [titleComplete, setTitleComplete] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setTitleComplete(true), 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      <FloatingOrbs />
      <AnimatedGrid />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-teal-100 dark:from-purple-900/30 dark:to-teal-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-8 border border-purple-200 dark:border-purple-800"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              AI-Powered Attendance Management
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Transform the way you
              <span className="block mt-2">
                <span className="text-gradient-animate">Track Attendance</span>
              </span>
            </motion.h1>

            <motion.p
              className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              EduFlow combines <span className="text-purple-600 dark:text-purple-400 font-semibold">face recognition</span>,{' '}
              <span className="text-teal-600 dark:text-teal-400 font-semibold">liveness detection</span>, and{' '}
              <span className="text-purple-600 dark:text-purple-400 font-semibold">keyword verification</span>{' '}
              to provide the most secure and efficient attendance management system for modern educational institutions.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link
                to="/register"
                className="group relative inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-full bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300"
              >
                <span>Get Started Free</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <div className="absolute inset-0 rounded-full bg-white/20 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-gray-700 dark:text-gray-200 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                See How It Works
              </Link>
            </motion.div>

            <motion.div
              className="mt-12 flex items-center gap-6 justify-center lg:justify-start text-sm text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {[
                { icon: '✓', text: 'No credit card' },
                { icon: '✓', text: 'Free trial' },
                { icon: '✓', text: '24/7 Support' },
              ].map((item) => (
                <span key={item.text} className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-100 to-teal-100 dark:from-purple-900/30 dark:to-teal-900/30 flex items-center justify-center text-xs text-purple-600 dark:text-purple-400 font-bold">
                    {item.icon}
                  </span>
                  {item.text}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right mockup */}
          <motion.div
            className="hidden lg:flex items-center justify-center"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              {/* Main mockup card */}
              <motion.div
                className="relative w-[400px] h-[500px] rounded-3xl bg-white dark:bg-gray-800 shadow-2xl shadow-purple-500/10 border border-gray-200 dark:border-gray-700 p-6 overflow-hidden"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Mockup header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="text-xs font-medium text-gray-400">Attendance Dashboard</div>
                </div>

                {/* Mockup content */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold">JD</div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">John Doe</div>
                      <div className="text-xs text-gray-500">Present - 98% confidence</div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>

                  {[
                    { name: 'Sarah Smith', status: 'Present', confidence: '95%', color: 'green' },
                    { name: 'Mike Johnson', status: 'Late', confidence: '87%', color: 'yellow' },
                    { name: 'Emma Wilson', status: 'Present', confidence: '99%', color: 'green' },
                    { name: 'Alex Brown', status: 'Pending Review', confidence: '72%', color: 'purple' },
                  ].map((student) => (
                    <div key={student.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                        student.color === 'green' ? 'from-teal-400 to-green-500' :
                        student.color === 'yellow' ? 'from-yellow-400 to-orange-500' :
                        'from-purple-400 to-purple-500'
                      } flex items-center justify-center text-white text-sm font-bold`}>
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{student.name}</div>
                        <div className="text-xs text-gray-500">{student.status} - {student.confidence} confidence</div>
                      </div>
                      <div className={`w-6 h-6 rounded-full bg-${student.color}-100 dark:bg-${student.color}-900/30 flex items-center justify-center`}>
                        <svg className={`w-4 h-4 text-${student.color}-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom bar */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-500 to-teal-500 text-white">
                    <div className="text-sm font-medium">Today&apos;s Attendance</div>
                    <div className="text-lg font-bold">94%</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating card 1 */}
              <motion.div
                className="absolute -top-8 -right-8 w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-xl flex items-center justify-center text-white"
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold">99.9%</div>
                  <div className="text-xs opacity-80">Accuracy</div>
                </div>
              </motion.div>

              {/* Floating card 2 */}
              <motion.div
                className="absolute -bottom-8 -left-8 w-28 h-28 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-500 shadow-xl flex items-center justify-center text-white"
                animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold">85%</div>
                  <div className="text-xs opacity-80">Faster</div>
                </div>
              </motion.div>

              {/* Scanning line animation */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-teal-500 opacity-60 rounded-full"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                style={{ filter: 'blur(2px)' }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="text-xs text-gray-400 dark:text-gray-500">Scroll to explore</span>
        <motion.div
          className="w-5 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-start justify-center p-1"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-2.5 rounded-full bg-gradient-to-b from-purple-500 to-teal-500"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

// ─── Stats Section ────────────────────────────────────────────────────────────
function StatsSection() {
  return (
    <section className="relative py-16 bg-gradient-to-r from-purple-600 via-purple-700 to-teal-600 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="mt-2 text-sm text-purple-200">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Features Section ──────────────────────────────────────────────────────────
function FeaturesSection() {
  const controls = useAnimation()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) controls.start('visible')
  }, [controls, isInView])

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
  }

  return (
    <section id="features" className="relative py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-teal-200 dark:bg-teal-900/20 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6"
              whileHover={{ scale: 1.05 }}
            >
              ✨ Features
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Everything you need for{' '}
              <span className="gradient-text">modern attendance</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Powerful features designed for educational institutions of all sizes.
              From face recognition to automated reports, we&apos;ve got you covered.
            </p>
          </div>
        </ScrollReveal>

        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="group relative"
            >
              <div className="relative p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover-card h-full">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                  {feature.icon}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feature.description}</p>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 via-teal-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:via-teal-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none" />

                {/* Index number */}
                <div className="absolute top-4 right-4 text-4xl font-bold text-gray-100 dark:text-gray-800 select-none">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── How It Works Preview Section ─────────────────────────────────────────────
function HowItWorksPreview() {
  return (
    <section className="relative py-24 bg-white dark:bg-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              className="inline-flex items-center px-3 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm font-medium mb-6"
              whileHover={{ scale: 1.05 }}
            >
              🔄 How It Works
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Simple{' '}
              <span className="gradient-text">4-step process</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get started with EduFlow in minutes. Our streamlined process makes attendance management effortless.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <ScrollReveal key={step.number} delay={index * 0.15}>
              <div className="relative text-center group">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5">
                    <div className="h-full bg-gradient-to-r from-purple-400 to-teal-400 relative">
                      <motion.div
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 border-t-2 border-r-2 border-purple-400 rotate-45"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </div>
                  </div>
                )}

                {/* Step number icon */}
                <motion.div
                  className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center shadow-lg shadow-purple-500/20 relative group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 5 }}
                >
                  <span className="text-white text-xl font-bold">{step.number}</span>
                </motion.div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{step.description}</p>

                {/* Learn more link */}
                {index === steps.length - 1 && (
                  <Link
                    to="/how-it-works"
                    className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
                  >
                    Learn more
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials Section ──────────────────────────────────────────────────────
function TestimonialsSection() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative py-24 bg-gradient-to-br from-purple-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-200 dark:bg-purple-900/10 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6"
              whileHover={{ scale: 1.05 }}
            >
              💬 Testimonials
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Trusted by{' '}
              <span className="gradient-text">educators worldwide</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              See what institutions are saying about their experience with EduFlow.
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto">
          <div className="relative min-h-[320px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                className="absolute inset-0"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <div className="relative p-8 md:p-12 rounded-3xl bg-white dark:bg-gray-800 shadow-xl shadow-purple-500/5 border border-gray-200 dark:border-gray-700">
                  {/* Quote */}
                  <div className="text-6xl text-purple-200 dark:text-purple-800 leading-none mb-4">&ldquo;</div>
                  <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 leading-relaxed mb-8">
                    {testimonials[current].content}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < testimonials[current].rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                      {testimonials[current].avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{testimonials[current].name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonials[current].role}, {testimonials[current].institution}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation dots */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === current
                    ? 'w-8 h-3 bg-gradient-to-r from-purple-600 to-teal-500'
                    : 'w-3 h-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Pricing Section ───────────────────────────────────────────────────────────
function PricingSection() {
  const [yearly, setYearly] = useState(false)

  return (
    <section id="pricing" className="relative py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              className="inline-flex items-center px-3 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm font-medium mb-6"
              whileHover={{ scale: 1.05 }}
            >
              💎 Pricing
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Simple, transparent{' '}
              <span className="gradient-text">pricing</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Choose the plan that fits your institution&apos;s needs. No hidden fees.
            </p>

            {/* Toggle */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={`text-sm font-medium ${!yearly ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Monthly</span>
              <button
                type="button"
                onClick={() => setYearly(!yearly)}
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                  yearly ? 'bg-gradient-to-r from-purple-600 to-teal-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <motion.div
                  className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow"
                  animate={{ x: yearly ? 28 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
              <span className={`text-sm font-medium ${yearly ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                Yearly
                <span className="ml-1.5 text-xs text-teal-500 font-semibold">Save 20%</span>
              </span>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <ScrollReveal key={plan.name} delay={index * 0.15}>
              <div className={`relative rounded-2xl p-8 h-full ${
                plan.highlighted
                  ? 'bg-gradient-to-b from-purple-600 to-teal-600 text-white shadow-2xl shadow-purple-500/20 scale-105 md:scale-110'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 shadow-lg'
              }`}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white text-purple-600 text-xs font-bold shadow-lg">
                    MOST POPULAR
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-2 ${plan.highlighted ? 'text-white' : ''}`}>{plan.name}</h3>
                  <p className={`text-sm ${plan.highlighted ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : ''}`}>
                      ${yearly ? (plan.price * 10).toFixed(0) : plan.price}
                    </span>
                    <span className={`text-sm ${plan.highlighted ? 'text-purple-100' : 'text-gray-500'}`}>
                      /{yearly ? 'year' : plan.period}
                    </span>
                  </div>
                  {plan.price === 0 && (
                    <p className={`text-xs mt-1 ${plan.highlighted ? 'text-purple-100' : 'text-gray-400'}`}>
                      No credit card required
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        plan.highlighted ? 'text-teal-200' : 'text-teal-500'
                      }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={`text-sm ${plan.highlighted ? 'text-purple-50' : 'text-gray-600 dark:text-gray-300'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-white text-purple-600 hover:bg-gray-100 shadow-lg'
                      : 'bg-gradient-to-r from-purple-600 to-teal-500 text-white hover:from-purple-500 hover:to-teal-400 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FAQ Section ───────────────────────────────────────────────────────────────
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="relative py-24 bg-white dark:bg-gray-800 overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <motion.div
              className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6"
              whileHover={{ scale: 1.05 }}
            >
              ❓ FAQ
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Frequently asked{' '}
              <span className="gradient-text">questions</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <ScrollReveal key={index} delay={index * 0.05}>
              <motion.div
                className={`rounded-2xl border ${
                  openIndex === index
                    ? 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                } transition-colors duration-300`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-base font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  <motion.svg
                    className={`w-5 h-5 flex-shrink-0 ${
                      openIndex === index ? 'text-purple-600' : 'text-gray-400'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA Section ───────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 gradient-bg opacity-90" />
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to transform your <br />
            <span className="text-yellow-200">attendance management?</span>
          </h2>
          <p className="text-lg text-purple-100 mb-10 max-w-2xl mx-auto">
            Join hundreds of institutions already using EduFlow to make attendance tracking
            secure, efficient, and automated. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-purple-700 font-semibold text-base hover:bg-gray-100 transition-all shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20"
            >
              Get Started Free
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-all"
            >
              Learn More
            </Link>
          </div>
          <div className="mt-10 flex items-center justify-center gap-6 text-sm text-purple-200">
            {[
              '🚀 No credit card required',
              '🔒 SSL Encrypted',
              '✅ 14-day free trial',
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5">{item}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-teal-500 rounded-xl animate-pulse-slow" />
                <div className="absolute inset-0.5 bg-gray-950 rounded-[10px] flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
              <span className="text-lg font-bold">
                <span className="gradient-text">EduFlow</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 max-w-md leading-relaxed mb-6">
              AI-powered attendance management system for educational institutions.
              Making attendance tracking secure, efficient, and automated with cutting-edge technology.
            </p>
            <div className="flex items-center gap-4">
              {['twitter', 'github', 'linkedin', 'youtube'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-br from-purple-600 to-teal-500 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                  aria-label={social}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Platform</h4>
            <ul className="space-y-3">
              {['Features', 'How It Works', 'Pricing', 'FAQ'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-sm hover:text-white transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Company</h4>
            <ul className="space-y-3">
              {['About', 'Blog', 'Careers', 'Press'].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase()}`} className="text-sm hover:text-white transition-colors duration-200">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Support</h4>
            <ul className="space-y-3">
              {['Documentation', 'API Reference', 'Contact Us', 'Status'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-white transition-colors duration-200">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} EduFlow. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Terms', 'Privacy', 'Cookies'].map((link) => (
              <a key={link} href="#" className="text-sm text-gray-500 hover:text-white transition-colors duration-200">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Main Landing Page ─────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksPreview />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  )
}

