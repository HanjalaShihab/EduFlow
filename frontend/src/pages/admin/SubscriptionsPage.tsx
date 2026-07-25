import React, { useState, useEffect } from "react"
import { superAdminApi } from "../../services/api"

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["Up to 100 students", "5 teachers", "Basic attendance tracking", "Email support"],
    color: "bg-gray-500",
    popular: false,
  },
  {
    name: "Starter",
    price: "$99",
    period: "/month",
    features: ["Up to 500 students", "20 teachers", "Face recognition attendance", "Basic analytics", "Priority email support"],
    color: "bg-blue-500",
    popular: false,
  },
  {
    name: "Professional",
    price: "$249",
    period: "/month",
    features: ["Up to 2,000 students", "100 teachers", "Advanced face recognition", "Full analytics & reports", "AI-powered insights", "Phone & email support"],
    color: "bg-purple-500",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: ["Unlimited students", "Unlimited teachers", "Custom integrations", "Dedicated support manager", "SLA guarantee", "On-premise deployment"],
    color: "bg-teal-500",
    popular: false,
  },
]

export default function SubscriptionsPage() {
  const [institutions, setInstitutions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await superAdminApi.listInstitutions({ per_page: 100 })
        setInstitutions(res.data.data || [])
      } catch (err) {
        console.error("Failed to fetch institutions:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getPlanStats = (plan: string) => {
    const count = institutions.filter((i: any) => (i.subscription_plan || "Free").toLowerCase() === plan.toLowerCase()).length
    return count
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-10 w-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription Plans</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage institution subscription plans and billing</p>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLANS.map((plan) => {
          const count = getPlanStats(plan.name)
          return (
            <div
              key={plan.name}
              className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 transition-all ${
                selectedPlan === plan.name
                  ? "border-purple-500 shadow-lg"
                  : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
              } p-6`}
              onClick={() => setSelectedPlan(plan.name)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-teal-500 text-white text-xs font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <div className={`w-12 h-12 rounded-lg ${plan.color} flex items-center justify-center mx-auto mb-3`}>
                  <span className="text-white font-bold text-lg">{plan.name.charAt(0)}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{plan.period}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {count} institution{count !== 1 ? "s" : ""}
                </p>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* Institution subscription table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Institution Plans</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Institution</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expires</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {institutions.slice(0, 20).map((inst: any) => (
                <tr key={inst.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center text-white font-bold text-xs">
                        {(inst.name || "I").charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{inst.name}</p>
                        <p className="text-xs text-gray-500">{inst.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                      {inst.subscription_plan || "Free"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      inst.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}>
                      {inst.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {inst.subscription_expires_at
                      ? new Date(inst.subscription_expires_at).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium">
                      Change Plan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
