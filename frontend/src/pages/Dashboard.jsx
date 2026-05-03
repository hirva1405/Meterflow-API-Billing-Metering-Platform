import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Code2, Key, TrendingUp, DollarSign, Activity, ArrowRight, Flower2 } from 'lucide-react'
import DashboardLayout from '../components/ui/DashboardLayout'
import StatCard from '../components/ui/StatCard'
import GlassCard from '../components/ui/GlassCard'
import { useAuth } from '../hooks/useAuth'
import { usageApi, billingApi, apisApi } from '../utils/api'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [usage, setUsage] = useState(null)
  const [billing, setBilling] = useState(null)
  const [apis, setApis] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      usageApi.stats(),
      billingApi.summary(),
      apisApi.list(),
    ]).then(([u, b, a]) => {
      setUsage(u.data)
      setBilling(b.data)
      setApis(a.data)
    }).finally(() => setLoading(false))
  }, [])

  const stats = [
    {
      icon: '🌐',
      label: 'Total Requests',
      value: loading ? '...' : (usage?.total_requests ?? 0).toLocaleString(),
      sub: `${usage?.requests_today ?? 0} today`,
      gradient: 'linear-gradient(135deg, rgba(255,143,171,0.4), rgba(251,111,146,0.2))',
      delay: 0.05,
    },
    {
      icon: '🔑',
      label: 'My APIs',
      value: loading ? '...' : apis.length,
      sub: `${apis.filter(a => a.is_active).length} active`,
      gradient: 'linear-gradient(135deg, rgba(200,162,200,0.4), rgba(180,130,200,0.2))',
      delay: 0.12,
    },
    {
      icon: '⚡',
      label: 'Success Rate',
      value: loading ? '...' : `${usage?.success_rate ?? 100}%`,
      sub: `${usage?.avg_response_time_ms ?? 0}ms avg`,
      gradient: 'linear-gradient(135deg, rgba(149,196,125,0.4), rgba(100,180,80,0.2))',
      delay: 0.19,
    },
    {
      icon: '💸',
      label: 'This Month',
      value: loading ? '...' : `$${((billing?.this_month_cost_cents ?? 0) / 100).toFixed(2)}`,
      sub: `${(billing?.this_month_requests ?? 0).toLocaleString()} requests`,
      gradient: 'linear-gradient(135deg, rgba(255,179,71,0.4), rgba(255,130,50,0.2))',
      delay: 0.26,
    },
  ]

  const chartData = usage?.requests_by_day ?? []

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 fade-up">
        <h1 className="font-display text-3xl font-bold text-[#4a2035]">
          Good morning, {user?.full_name?.split(' ')[0]} 🌸
        </h1>
        <p className="text-[#b47a96] mt-1">Here's what's blooming in your API garden today</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Chart + Quick actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Usage chart */}
        <GlassCard className="xl:col-span-2 fade-up fade-up-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-semibold text-[#4a2035] text-lg">Request Volume</h2>
              <p className="text-xs text-[#b47a96]">Last 7 days</p>
            </div>
            <span className="badge badge-pink">
              <Activity size={10} /> Live
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff8fab" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#ff8fab" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(255,143,171,0.3)',
                  borderRadius: 12,
                  backdropFilter: 'blur(12px)',
                  fontFamily: 'DM Sans',
                }}
              />
              <Area
                type="monotone"
                dataKey="requests"
                stroke="#fb6f92"
                strokeWidth={2.5}
                fill="url(#pinkGrad)"
                dot={{ fill: '#fb6f92', r: 4 }}
                activeDot={{ r: 6, fill: '#ff8fab' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Quick actions */}
        <GlassCard className="fade-up fade-up-3">
          <h2 className="font-display font-semibold text-[#4a2035] text-lg mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Create New API', icon: <Code2 size={16} />, to: '/apis', color: '#ff8fab' },
              { label: 'Generate API Key', icon: <Key size={16} />, to: '/keys', color: '#c8a2c8' },
              { label: 'View Analytics', icon: <TrendingUp size={16} />, to: '/usage', color: '#95c47d' },
              { label: 'Billing Details', icon: <DollarSign size={16} />, to: '/billing', color: '#ffb347' },
            ].map(item => (
              <button
                key={item.to}
                onClick={() => navigate(item.to)}
                className="flex items-center gap-3 p-3 rounded-2xl text-left transition-all hover:scale-[1.02]"
                style={{ background: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.55)' }}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: `${item.color}33`, color: item.color }}>
                  {item.icon}
                </div>
                <span className="text-sm font-medium text-[#4a2035] flex-1">{item.label}</span>
                <ArrowRight size={14} className="text-[#b47a96]" />
              </button>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Recent APIs */}
      {apis.length > 0 && (
        <GlassCard className="fade-up fade-up-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-[#4a2035] text-lg">Your APIs</h2>
            <button onClick={() => navigate('/apis')} className="text-xs text-[#ff8fab] font-medium hover:underline">
              View all →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {apis.slice(0, 3).map(api => (
              <div key={api.id}
                onClick={() => navigate('/apis')}
                className="p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.02]"
                style={{ background: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.55)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Flower2 size={14} className="text-[#ff8fab]" />
                  <span className="font-semibold text-sm text-[#4a2035]">{api.name}</span>
                  <span className={`badge ml-auto ${api.is_active ? 'badge-green' : 'badge-pink'}`}>
                    {api.is_active ? '● Active' : '○ Off'}
                  </span>
                </div>
                <p className="text-xs text-[#b47a96] line-clamp-1 mb-3">{api.description || 'No description'}</p>
                <div className="flex gap-3 text-xs text-[#8b4a6a]">
                  <span>🔑 {api.total_keys ?? 0} keys</span>
                  <span>⚡ {api.rate_limit_per_minute}/min</span>
                  <span>💸 ${api.price_per_1k_requests}/1k</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </DashboardLayout>
  )
}
