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

const teamMembers = [
  { name: 'Dr. Alex Rodriguez', role: 'CEO & Co-Founder', bio: 'Former professor with 15+ years in edtech. Passionate about using AI to solve educational challenges.', avatar: 'AR' },
  { name: 'Sarah Chen', role: 'CTO & Co-Founder', bio: 'AI researcher and full-stack engineer. Previously led ML teams at major tech companies.', avatar: 'SC' },
  { name: 'Marcus Thompson', role: 'Head of Product', bio: 'Product strategist with experience building SaaS platforms used by millions of students worldwide.', avatar: 'MT' },
  { name: 'Priya Sharma', role: 'Head of AI Research', bio: 'Computer vision PhD specializing in face recognition and liveness detection technologies.', avatar: 'PS' },
  { name: 'James Wilson', role: 'VP of Engineering', bio: 'Scalability expert who has architected systems serving 50M+ users across multiple continents.', avatar: 'JW' },
  { name: 'Emily Nakamura', role: 'Head of Customer Success', bio: 'Dedicated to ensuring every institution gets maximum value from our platform from day one.', avatar: 'EN' },
]

const milestones = [
  { year: '2020', title: 'The Idea', description: 'EduFlow was conceived when our founders recognized the inefficiencies in traditional attendance systems during their academic careers.' },
  { year: '2021', title: 'Seed Funding', description: 'Raised $2M seed round to build the core platform. Began development of AI face recognition and liveness detection systems.' },
  { year: '2022', title: 'Beta Launch', description: 'Launched beta with 10 partner institutions. Processed over 50,000 attendance records with 99.7% accuracy.' },
  { year: '2023', title: 'Public Launch', description: 'Opened platform to all institutions. Reached 100+ institutions and 10,000+ students within the first quarter.' },
  { year: '2024', title: 'Enterprise Growth', description: 'Expanded to support large universities with multi-campus deployments. Launched advanced analytics and reporting features.' },
  { year: '2025', title: 'Global Expansion', description: 'Expanding to international markets with multi-language support and regional compliance certifications.' },
]

const values = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Security First',
    description: 'We prioritize the security and privacy of student data above all else, employing enterprise-grade encryption and compliance measures.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Innovation',
    description: 'We continuously push the boundaries of what is possible with AI technology to deliver the most advanced attendance solution.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: 'Community Focus',
    description: 'We believe in building products that serve the educational community and making a positive impact on learning outcomes.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Reliability',
    description: 'Our platform maintains 99.9% uptime and processes millions of attendance records with consistent accuracy and speed.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
      </svg>
    ),
    title: 'Simplicity',
    description: 'Despite the complex AI technology behind the scenes, we make attendance management simple and intuitive for everyone.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 3.75v4.5m0-4.5h-4.5m4.5 0l-6 6m3 12c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z" />
      </svg>
    ),
    title: 'Customer Support',
    description: 'We provide exceptional support with dedicated account managers and 24/7 assistance for all our enterprise customers.',
  },
]

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

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <FloatingOrbs />
          <div className="absolute inset-0 grid-bg opacity-30" />
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
            Our mission is to make{' '}
            <span className="gradient-text">attendance effortless</span>
          </motion.h1>
          <motion.p
            className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            We are a team of educators, engineers, and AI researchers on a mission to
            eliminate the administrative burden of attendance tracking so educators can
            focus on what matters most — teaching.
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Story</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-teal-500 rounded-full mx-auto" />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="max-w-none space-y-6">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                EduFlow was born in 2020 when our founders, Dr. Alex Rodriguez and Sarah Chen,
                recognized a fundamental problem in education: traditional attendance systems were
                broken. They were time-consuming, prone to errors, and vulnerable to fraud.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                As a professor, Alex spent countless hours manually taking attendance and
                reconciling paper records. Sarah, an AI engineer, realized that the same
                computer vision technology used in security systems could revolutionize
                how attendance is managed in educational institutions.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                They assembled a team of world-class engineers and AI researchers to build
                a platform that combines cutting-edge face recognition, liveness detection,
                and keyword verification into a seamless attendance management system.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                Today, EduFlow serves over 100 institutions and has processed over 1 million
                attendance records with 99.9% accuracy. But we are just getting started.
                Our vision is to become the global standard for attendance management in
                education.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-16 bg-gradient-to-r from-purple-600 via-purple-700 to-teal-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: '99.9%', label: 'Accuracy Rate' },
              { value: '100+', label: 'Institutions' },
              { value: '10K+', label: 'Students' },
              { value: '1M+', label: 'Attendances' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</div>
                <p className="mt-2 text-sm text-purple-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Our{' '}
                <span className="gradient-text">Values</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                These core principles guide everything we do at EduFlow, from product development
                to customer support.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <ScrollReveal key={value.title} delay={index * 0.1}>
                <div className="group p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover-card">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{value.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Meet the{' '}
                <span className="gradient-text">Team</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                We are a passionate team of innovators dedicated to transforming education
                through technology.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <ScrollReveal key={member.name} delay={index * 0.1}>
                <div className="group p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover-card text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {member.avatar}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{member.bio}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Our{' '}
                <span className="gradient-text">Journey</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Key milestones in our mission to transform attendance management.
              </p>
            </div>
          </ScrollReveal>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-teal-500 to-purple-500 hidden md:block" />
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <ScrollReveal key={milestone.year} delay={index * 0.1}>
                  <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                    <div className="md:w-32 flex-shrink-0">
                      <div className="inline-flex items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
                          {milestone.year.slice(-2)}
                        </div>
                        <span className="text-lg font-bold gradient-text md:hidden">{milestone.year}</span>
                      </div>
                    </div>
                    <div className="flex-1 pt-2">
                      <span className="text-lg font-bold gradient-text hidden md:block mb-2">{milestone.year}</span>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{milestone.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
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
              Ready to join the future of attendance?
            </h2>
            <p className="text-lg text-purple-100 mb-8 max-w-xl mx-auto">
              Start your journey with EduFlow today and transform how your institution manages attendance.
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
                to="/how-it-works"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-all"
              >
                See How It Works
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
              <Link to="/how-it-works" className="text-sm hover:text-white transition-colors">How It Works</Link>
              <a href="#" className="text-sm hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-sm hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

