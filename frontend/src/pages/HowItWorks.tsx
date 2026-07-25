import React from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

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

interface StepDetailProps {
  number: string
  title: string
  subtitle: string
  description: string
  details: string[]
  icon: React.ReactNode
  imageSide: 'left' | 'right'
}

const steps: StepDetailProps[] = [
  {
    number: '01',
    title: 'Institution Onboarding',
    subtitle: 'Get your institution set up',
    description: 'Getting started with EduFlow is simple. Your institution administrator completes a one-time setup to configure your institution profile, departments, programs, and courses.',
    details: [
      'Register your institution with basic details',
      'Configure departments, programs, and courses',
      'Set up academic calendar and semesters',
      'Invite teachers and staff members',
      'Integrate with existing SIS if needed',
      'Customize attendance policies and rules',
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008z" />
      </svg>
    ),
    imageSide: 'left',
  },
  {
    number: '02',
    title: 'Teacher Session Creation',
    subtitle: 'Teachers create attendance sessions',
    description: 'Teachers have full control over attendance sessions. They can create sessions for their classes, set time windows, and generate unique keywords that students must use.',
    details: [
      'Log in to teacher dashboard',
      'Select course and section from schedule',
      'Set attendance session time window',
      'System generates unique session keyword',
      'Keyword is announced in classroom',
      'Session appears on student dashboards',
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
      </svg>
    ),
    imageSide: 'right',
  },
  {
    number: '03',
    title: 'Student Attendance Marking',
    subtitle: 'Quick and secure attendance marking',
    description: 'Students mark their attendance through a two-step verification process. First, they enter the session keyword announced by their teacher, then complete a quick face verification using their device camera.',
    details: [
      'Open active session from student dashboard',
      'Enter the keyword announced in class',
      'Camera activates for face verification',
      'Liveness detection ensures real presence',
      'Face is matched against enrolled records',
      'Attendance is instantly recorded',
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    imageSide: 'left',
  },
  {
    number: '04',
    title: 'AI Face Recognition',
    subtitle: 'Powered by advanced AI technology',
    description: 'Behind the scenes, our AI engine processes each attendance attempt through multiple verification layers. We use state-of-the-art face recognition and liveness detection to ensure accuracy and prevent fraud.',
    details: [
      'Face detection using InsightFace AI',
      'Face encoding extraction and comparison',
      'Liveness check (blink, smile, movement)',
      'Confidence scoring for each match',
      'Low-confidence matches flagged for review',
      'All data encrypted and securely stored',
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    imageSide: 'right',
  },
  {
    number: '05',
    title: 'Review & Verification',
    subtitle: 'Manual review for edge cases',
    description: 'Not all attendance attempts are perfect. Our system automatically flags low-confidence matches for manual review by the teacher, ensuring no student is incorrectly marked absent.',
    details: [
      'Low-confidence matches flagged automatically',
      'Teacher reviews flagged records in dashboard',
      'Compare face images side by side',
      'Approve or reject with one click',
      'Add notes for audit trail',
      'Automated notifications sent to students',
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    imageSide: 'left',
  },
  {
    number: '06',
    title: 'Analytics & Reports',
    subtitle: 'Data-driven insights',
    description: 'EduFlow provides comprehensive analytics and reporting tools. Track attendance trends, generate compliance reports, and export data in multiple formats.',
    details: [
      'Real-time attendance dashboard',
      'Daily, weekly, monthly reports',
      'Export to PDF and Excel formats',
      'Trend analysis and insights',
      'Individual student attendance history',
      'Department and course-level analytics',
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    imageSide: 'right',
  },
]

const faqs = [
  {
    q: 'How long does it take to set up EduFlow for my institution?',
    a: 'Most institutions are fully operational within 2-3 days. Our onboarding team guides you through every step, from initial registration to student enrollment and teacher training.',
  },
  {
    q: 'What devices are supported for face verification?',
    a: 'EduFlow works on any device with a camera - smartphones, tablets, laptops, and desktops. Our web-based platform works across all modern browsers without any app installation.',
  },
  {
    q: 'How accurate is the face recognition in low light?',
    a: 'Our AI models are trained on diverse datasets including low-light conditions. The system maintains 99.9% accuracy across various lighting environments and angles.',
  },
  {
    q: 'Can students mark attendance from home?',
    a: 'Students can only mark attendance within the time window set by their teacher and must be physically present in class. The keyword is announced in class and the session is location-aware.',
  },
  {
    q: 'What happens if a student forgets their face is not recognized?',
    a: 'Low-confidence matches are flagged for teacher review. The teacher can manually verify the student identity and approve or reject the attendance record.',
  },
  {
    q: 'Is my institution data secure?',
    a: 'Yes, we employ enterprise-grade security. All data is encrypted at rest and in transit. Face encodings are stored securely and never shared with third parties. We are FERPA and GDPR compliant.',
  },
]

function StepDetail({ step, index }: { step: StepDetailProps; index: number }) {
  const isLeft = step.imageSide === 'left'
  
  return (
    <ScrollReveal delay={index * 0.1}>
      <div className={`flex flex-col ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center`}>
        {/* Content */}
        <div className="flex-1">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {step.number}
            </div>
            <div>
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">{step.subtitle}</span>
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">{step.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{step.description}</p>
          <ul className="space-y-3">
            {step.details.map((detail) => (
              <li key={detail} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-100 to-teal-100 dark:from-purple-900/30 dark:to-teal-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Visual */}
        <div className="flex-1 w-full">
          <div className="relative p-8 rounded-3xl bg-gradient-to-br from-purple-50 to-teal-50 dark:from-gray-800 dark:to-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl">
            <div className={`flex items-center justify-center ${isLeft ? 'lg:justify-end' : 'lg:justify-start'}`}>
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center text-white shadow-2xl">
                {step.icon}
              </div>
            </div>
            {/* Decorative dots */}
            <div className="grid grid-cols-6 gap-3 mt-8">
              {[...Array(24)].map((_, i) => (
                <div
                  key={i}
                  className={`w-full aspect-square rounded-xl ${
                    i % 3 === 0
                      ? 'bg-purple-200 dark:bg-purple-800'
                      : i % 3 === 1
                      ? 'bg-teal-200 dark:bg-teal-800'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
            {/* Decorative number */}
            <div className="absolute bottom-6 right-8 text-8xl font-bold text-gray-200 dark:text-gray-700 select-none opacity-50">
              {step.number}
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  )
}

function FAQItem({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div className={`rounded-2xl border transition-all duration-300 ${
      isOpen
        ? 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 shadow-lg'
        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md'
    }`}>
      <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="text-base font-semibold text-gray-900 dark:text-white pr-4">{question}</span>
        <motion.svg
          className={`w-5 h-5 flex-shrink-0 ${isOpen ? 'text-purple-600' : 'text-gray-400'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{answer}</p>
      </motion.div>
    </div>
  )
}

export default function HowItWorks() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 dark:bg-purple-900/20 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-teal-300 dark:bg-teal-900/20 rounded-full blur-3xl opacity-40" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-8"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </motion.div>
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            How{' '}
            <span className="gradient-text">EduFlow</span> Works
          </motion.h1>
          <motion.p
            className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            From institution setup to attendance tracking and analytics, here&apos;s a
            complete walkthrough of how EduFlow transforms attendance management.
          </motion.p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 md:space-y-32">
          {steps.map((step, index) => (
            <StepDetail key={step.number} step={step} index={index} />
          ))}
        </div>
      </section>

      {/* Technology Section */}
      <section className="relative py-24 bg-gradient-to-br from-purple-600 to-teal-600 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Powered by cutting-edge technology
            </h2>
            <p className="text-lg text-purple-100 mb-10 max-w-2xl mx-auto">
              Our platform leverages state-of-the-art AI models and a robust multi-tenant architecture
              to deliver a seamless and secure attendance management experience.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'InsightFace AI', desc: 'Face Recognition' },
                { label: 'ONNX Runtime', desc: 'Model Inference' },
                { label: 'Laravel 12', desc: 'Backend API' },
                { label: 'React 18', desc: 'Frontend' },
                { label: 'PostgreSQL', desc: 'Database' },
                { label: 'Redis', desc: 'Caching' },
                { label: 'Docker', desc: 'Containerization' },
                { label: 'WebRTC', desc: 'Camera Access' },
              ].map((tech) => (
                <motion.div
                  key={tech.label}
                  className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="font-semibold text-white text-sm">{tech.label}</div>
                  <div className="text-xs text-purple-200 mt-1">{tech.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently asked{' '}
                <span className="gradient-text">questions</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Everything you need to know about EduFlow&apos;s attendance system.
              </p>
            </div>
          </ScrollReveal>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <ScrollReveal key={index} delay={index * 0.05}>
                <FAQItem
                  question={faq.q}
                  answer={faq.a}
                  isOpen={openFaq === index}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 gradient-bg">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to simplify attendance management?
            </h2>
            <p className="text-lg text-purple-100 mb-8 max-w-xl mx-auto">
              Join hundreds of institutions already using EduFlow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-purple-700 font-semibold text-base hover:bg-gray-100 transition-all shadow-xl"
              >
                Get Started Free
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-all"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-white">EduFlow</span>
            </div>
            <p className="text-sm">&copy; {new Date().getFullYear()} EduFlow. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/" className="text-sm hover:text-white transition-colors">Home</Link>
              <Link to="/about" className="text-sm hover:text-white transition-colors">About</Link>
              <a href="#" className="text-sm hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-sm hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

