import React, { useState } from "react"

interface Ticket {
  id: number
  subject: string
  institution: string
  status: "open" | "in_progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "critical"
  created_at: string
  description: string
}

const initialTickets: Ticket[] = [
  { id: 1, subject: "Face recognition not working", institution: "Springfield University", status: "open", priority: "high", created_at: "2024-01-15T10:30:00", description: "Multiple students unable to verify their identity during attendance sessions." },
  { id: 2, subject: "Billing inquiry", institution: "Riverside College", status: "in_progress", priority: "medium", created_at: "2024-01-14T14:20:00", description: "Requesting invoice for December 2023 subscription." },
  { id: 3, subject: "Integration help", institution: "Tech Institute", status: "open", priority: "low", created_at: "2024-01-13T09:15:00", description: "Need help integrating with their existing student information system." },
  { id: 4, subject: "System outage", institution: "Greenwood School", status: "resolved", priority: "critical", created_at: "2024-01-12T08:00:00", description: "System was down for 2 hours during peak attendance time." },
  { id: 5, subject: "Feature request: QR code", institution: "Harbor Academy", status: "closed", priority: "low", created_at: "2024-01-11T16:45:00", description: "Requesting QR code generation for easier attendance marking." },
]

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

const statusColors: Record<string, string> = {
  open: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  resolved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  closed: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
}

export default function SupportPage() {
  const [tickets] = useState<Ticket[]>(initialTickets)
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredTickets = statusFilter === "all" ? tickets : tickets.filter((t) => t.status === statusFilter)
  const openCount = tickets.filter((t) => t.status === "open" || t.status === "in_progress").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Support</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage support tickets and institution inquiries</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            {openCount} Open
          </span>
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Tickets</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Open", count: tickets.filter((t) => t.status === "open").length, color: "bg-yellow-500" },
          { label: "In Progress", count: tickets.filter((t) => t.status === "in_progress").length, color: "bg-blue-500" },
          { label: "Resolved", count: tickets.filter((t) => t.status === "resolved").length, color: "bg-green-500" },
          { label: "Total", count: tickets.length, color: "bg-purple-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
            <p className={"text-2xl font-bold mt-1 " + (s.label === "Total" ? "text-gray-900 dark:text-white" : "text-gray-900 dark:text-white")}>{s.count}</p>
          </div>
        ))}
      </div>

      {/* Ticket List */}
      <div className="space-y-3">
        {filteredTickets.map((ticket) => (
          <div key={ticket.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:border-purple-300 dark:hover:border-purple-700 transition-colors cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{ticket.subject}</h3>
                  <span className={"inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize " + priorityColors[ticket.priority]}>{ticket.priority}</span>
                  <span className={"inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize " + statusColors[ticket.status]}>{ticket.status.replace("_", " ")}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{ticket.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>{ticket.institution}</span>
                  <span>{new Date(ticket.created_at).toLocaleString()}</span>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        ))}
        {filteredTickets.length === 0 && (
          <div className="text-center text-gray-500 py-12">No tickets found</div>
        )}
      </div>
    </div>
  )
}