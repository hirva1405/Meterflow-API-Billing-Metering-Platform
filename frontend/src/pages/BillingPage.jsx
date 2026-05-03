import { useEffect, useState } from 'react'
import { CreditCard, FileText, Zap, Star, Building2, Plus } from 'lucide-react'
import DashboardLayout from '../components/ui/DashboardLayout'
import GlassCard from '../components/ui/GlassCard'
import { billingApi } from '../utils/api'
import { useAuth } from '../hooks/useAuth'
import { toast } from '../components/ui/Toast'

const PLANS = [
  {
    name: 'Free',
    emoji: '🌱',
    price: '$0',
    period: '/month',
    features: ['1,000 free requests', '$0.50 per 1k after', '1 API', 'Community support'],
    gradient: 'linear-gradient(135deg, rgba(149,196,125,0.25), rgba(100,180,80,0.12))',
    border: 'rgba(149,196,125,0.35)',
    badge: 'badge-green',
  },
  {
    name: 'Pro',
    emoji: '🌸',
    price: '$0.50',
    period: '/1k requests',
    features: ['Unlimited requests', 'Rate limit controls', '10 APIs', 'Priority support'],
    gradient: 'linear-gradient(135deg, rgba(255,143,171,0.25), rgba(200,100,150,0.12))',
    border: 'rgba(255,143,171,0.45)',
    badge: 'badge-pink',
    popular: true,
  },
  {
    name: 'Enterprise',
    emoji: '🌺',
    price: '$0.20',
    period: '/1k requests',
    features: ['Volume discounts', 'SLA guarantee', 'Unlimited APIs', 'Dedicated support'],
    gradient: 'linear-gradient(135deg, rgba(200,162,200,0.25), rgba(160,120,200,0.12))',
    border: 'rgba(200,162,200,0.45)',
    badge: 'badge-lav',
  },
]

const statusColor = {
  pending: 'badge-peach',
  paid: 'badge-green',
  overdue: 'badge-pink',
}

export default function BillingPage() {
  const { user } = useAuth()
  const [summary, setSummary] = useState(null)
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    Promise.all([
      billingApi.summary(),
      billingApi.invoices(),
    ]).then(([s, inv]) => {
      setSummary(s.data)
      setInvoices(inv.data)
    }).finally(() => setLoading(false))
  }, [])

  const handleGenerateInvoice = async () => {
    setGenerating(true)
    try {
      const r = await billingApi.generateInvoice()
      setInvoices(inv => [r.data, ...inv])
      toast('Invoice generated! 📄', 'success')
    } catch { toast('Failed to generate invoice', 'error') }
    finally { setGenerating(false) }
  }

  const currentPlan = user?.plan ?? 'free'

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8 fade-up">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#4a2035]">Billing 💸</h1>
          <p className="text-[#b47a96] mt-1">Track your usage costs and manage your plan</p>
        </div>
        <button onClick={handleGenerateInvoice} disabled={generating}
          className="btn-bloom flex items-center gap-2">
          {generating
            ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            : <Plus size={15} />}
          Generate Invoice
        </button>
      </div>

      {/* Current bill summary */}
      {!loading && summary && (
        <GlassCard className="mb-8 fade-up">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold text-[#b47a96] uppercase tracking-wider mb-1">Current Month</p>
              <div className="font-display text-4xl font-bold text-[#4a2035]">
                ${((summary.this_month_cost_cents ?? 0) / 100).toFixed(2)}
              </div>
              <p className="text-sm text-[#b47a96] mt-1">
                {(summary.this_month_requests ?? 0).toLocaleString()} requests billed
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="font-display text-2xl font-bold text-[#4a2035]">
                  {(summary.this_month_requests ?? 0).toLocaleString()}
                </div>
                <div className="text-xs text-[#b47a96]">Total Requests</div>
              </div>
              {summary.free_tier_remaining > 0 && (
                <div className="text-center">
                  <div className="font-display text-2xl font-bold text-green-600">
                    {summary.free_tier_remaining.toLocaleString()}
                  </div>
                  <div className="text-xs text-[#b47a96]">Free Remaining</div>
                </div>
              )}
              <div className="text-center">
                <span className={`badge ${statusColor['pending']} text-sm px-3 py-1.5`}>
                  Billing Open
                </span>
                <div className="text-xs text-[#b47a96] mt-1">Status</div>
              </div>
            </div>
          </div>

          {/* Free tier progress */}
          {currentPlan === 'free' && (
            <div className="mt-5 pt-5 border-t border-white/30">
              <div className="flex justify-between text-xs text-[#b47a96] mb-2">
                <span>Free tier usage</span>
                <span>{Math.min(summary.this_month_requests, 1000).toLocaleString()} / 1,000 requests</span>
              </div>
              <div className="w-full h-3 rounded-full" style={{ background: 'rgba(255,143,171,0.15)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min((summary.this_month_requests / 1000) * 100, 100)}%`,
                    background: 'linear-gradient(90deg, #95c47d, #ff8fab)',
                  }}
                />
              </div>
            </div>
          )}
        </GlassCard>
      )}

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {PLANS.map((plan, i) => (
          <div
            key={plan.name}
            className={`glass-card p-6 fade-up fade-up-${i + 1} relative`}
            style={{ border: `1.5px solid ${plan.border}` }}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #ff8fab, #fb6f92)' }}>
                ✨ Most Popular
              </div>
            )}
            <div className="text-3xl mb-3">{plan.emoji}</div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-display text-2xl font-bold text-[#4a2035]">{plan.price}</span>
              <span className="text-xs text-[#b47a96]">{plan.period}</span>
            </div>
            <div className="font-semibold text-[#4a2035] mb-4">{plan.name}</div>
            <ul className="flex flex-col gap-2 mb-5">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-[#8b4a6a]">
                  <span className="text-green-500 text-xs">✓</span> {f}
                </li>
              ))}
            </ul>
            <span className={`badge ${plan.badge} ${currentPlan === plan.name.toLowerCase() ? '' : 'opacity-40'}`}>
              {currentPlan === plan.name.toLowerCase() ? '✓ Current Plan' : plan.name}
            </span>
          </div>
        ))}
      </div>

      {/* Invoice history */}
      <GlassCard className="fade-up fade-up-4">
        <h2 className="font-display font-semibold text-[#4a2035] text-lg mb-5 flex items-center gap-2">
          <FileText size={18} className="text-[#ff8fab]" /> Invoice History
        </h2>
        {invoices.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">📄</div>
            <p className="text-[#b47a96]">No invoices yet. Generate one to get started!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {invoices.map(inv => (
              <div key={inv.id}
                className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.01]"
                style={{ background: 'rgba(255,255,255,0.40)', border: '1px solid rgba(255,255,255,0.60)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255,143,171,0.15)' }}>
                  <CreditCard size={16} className="text-[#ff8fab]" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[#4a2035]">
                    {new Date(inv.period_start).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                  <div className="text-xs text-[#b47a96]">
                    {inv.total_requests.toLocaleString()} requests
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display font-bold text-[#4a2035]">
                    ${(inv.amount_cents / 100).toFixed(2)}
                  </div>
                  <span className={`badge ${statusColor[inv.status]}`}>{inv.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </DashboardLayout>
  )
}
