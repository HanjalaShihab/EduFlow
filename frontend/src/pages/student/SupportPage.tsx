import React, { useState } from 'react'
import { cn, formatDateTime } from '../../lib/utils'
import toast from 'react-hot-toast'

interface Ticket {
  id: number
  subject: string
  message: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  created_at: string
  updated_at: string
  replies: { message: string; created_at: string; is_admin: boolean }[]
}

const mockTickets: Ticket[] = [
  {
    id: 1,
    subject: 'Attendance issue - Marked absent incorrectly',
    message: 'I was present for Mathematics 101 on Monday but I was marked absent. Please review.',
    status: 'in_progress',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    replies: [
      { message: 'We are reviewing your attendance record. We will get back to you shortly.', created_at: new Date(Date.now() - 86400000).toISOString(), is_admin: true },
    ],
  },
  {
    id: 2,
    subject: 'Face enrollment not working',
    message: 'I am unable to enroll my face. The camera opens but then closes immediately.',
    status: 'open',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    replies: [],
  },
]

const statusColors: Record<string, string> = {
  open: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  resolved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  closed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets)
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [expandedTicket, setExpandedTicket] = useState<number | null>(null)
  const [newTicket, setNewTicket] = useState({ subject: '', message: '' })
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.message.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const ticket: Ticket = {
        id: tickets.length + 1,
        subject: newTicket.subject,
        message: newTicket.message,
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        replies: [],
      }
      setTickets(prev => [ticket, ...prev])
      setNewTicket({ subject: '', message: '' })
      setShowNewTicket(false)
      toast.success('Support ticket created successfully')
    } catch (err) {
      toast.error('Failed to create ticket')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReply = async (ticketId: number) => {
    if (!replyText.trim()) return

    setSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setTickets(prev => prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            replies: [...t.replies, { message: replyText, created_at: new Date().toISOString(), is_admin: false }],
            updated_at: new Date().toISOString(),
          }
        }
        return t
      }))
      setReplyText('')
      toast.success('Reply added')
    } catch (err) {
      toast.error('Failed to add reply')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    return (
      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium capitalize', statusColors[status])}>
        {status.replace('_', ' ')}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Support</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Contact support and manage your tickets.</p>
        </div>
        <button
          onClick={() => setShowNewTicket(!showNewTicket)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          {showNewTicket ? 'Cancel' : 'New Ticket'}
        </button>
      </div>

      {/* New Ticket Form */}
      {showNewTicket && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create Support Ticket</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
              <input
                type="text"
                value={newTicket.subject}
                onChange={e => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Brief description of your issue"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea
                value={newTicket.message}
                onChange={e => setNewTicket(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                placeholder="Describe your issue in detail..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleCreateTicket}
                disabled={submitting || !newTicket.subject || !newTicket.message}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Ticket'}
              </button>
              <label className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                Attach files
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tickets List */}
      {tickets.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Support Tickets</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">You haven't created any support tickets yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map(ticket => (
            <div key={ticket.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">{ticket.subject}</h3>
                    {getStatusBadge(ticket.status)}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Created {formatDateTime(ticket.created_at)} · {ticket.replies.length} reply(s)
                  </p>
                </div>
                <svg
                  className={cn('w-5 h-5 text-gray-400 transition-transform', expandedTicket === ticket.id && 'rotate-180')}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {expandedTicket === ticket.id && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <p className="text-sm text-gray-900 dark:text-white">{ticket.message}</p>
                  </div>

                  {ticket.replies.map((reply, idx) => (
                    <div key={idx} className={cn('p-3 rounded-lg', reply.is_admin ? 'bg-purple-50 dark:bg-purple-900/10 ml-8' : 'bg-gray-50 dark:bg-gray-700/50')}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn('text-xs font-medium', reply.is_admin ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400')}>
                          {reply.is_admin ? 'Support Agent' : 'You'}
                        </span>
                        <span className="text-xs text-gray-400">{formatDateTime(reply.created_at)}</span>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white">{reply.message}</p>
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
                      onKeyDown={e => e.key === 'Enter' && handleReply(ticket.id)}
                    />
                    <button
                      onClick={() => handleReply(ticket.id)}
                      disabled={submitting || !replyText.trim()}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
