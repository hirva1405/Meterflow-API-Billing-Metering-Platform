import { useEffect, useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import { Activity, Clock, CheckCircle, TrendingUp } from 'lucide-react'
import DashboardLayout from '../components/ui/DashboardLayout'
import GlassCard from '../components/ui/GlassCard'
import StatCard from '../components/ui/StatCard'
import { usageApi } from '../utils/api'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass p-3 rounded-xl text-sm" style={{ border: '1px solid rgba(255,143,171,0.3)' }}>
      <div className="text-[#8b4a6a] font-medium mb-1">{label}</div>
      <div className="font-semibold text-[#4a2035]">{payload[0].value} requests</div>
    </div>
  )
}

export default function UsagePage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    usageApi.stats().then(r => setStats(r.data)).finally(() => setLoading(false))
  }, [])

  const statCards = [
    {
      icon: '🌐', label: 'Total Requests', delay: 0.05,
      value: loading ? '...' : (stats?.total_requests ?? 0).toLocaleString(),
      sub: 'All time',
      gradient: 'linear-gradient(135deg, rgba(255,143,171,0.35), rgba(251,111,146,0.15))',
    },
    {
      icon: '⚡', label: 'This Month', delay: 0.12,
      value: loading ? '...' : (stats?.requests_this_month ?? 0).toLocaleString(),
      sub: `${stats?.requests_today ?? 0} today`,
      gradient: 'linear-gradient(135deg, rgba(200,162,200,0.35), rgba(160,120,200,0.15))',
    },
    {
      icon: '🕐', label: 'Avg Response', delay: 0.19,
      value: loading ? '...' : `${stats?.avg_response_time_ms ?? 0}ms`,
      sub: 'Average latency',
      gradient: 'linear-gradient(135deg, rgba(255,179,71,0.35), rgba(220,140,40,0.15))',
    },
    {
      icon: '✅', label: 'Success Rate', delay: 0.26,
      value: loading ? '...' : `${stats?.success_rate ?? 100}%`,
      sub: 'HTTP 2xx responses',
      gradient: 'linear-gradient(135deg, rgba(149,196,125,0.35), rgba(100,170,80,0.15))',
    },
  ]

  return (
    <DashboardLayout>
      <div className="mb-8 fade-up">
        <h1 className="font-display text-3xl font-bold text-[#4a2035]">Usage Analytics 📊</h1>
        <p className="text-[#b47a96] mt-1">Deep insights into your API consumption patterns</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Area chart */}
        <GlassCard className="fade-up fade-up-2">
          <h2 className="font-display font-semibold text-[#4a2035] text-lg mb-1">Daily Request Volume</h2>
          <p className="text-xs text-[#b47a96] mb-5">Last 7 days</p>
          {loading ? (
            <div className="h-48 flex items-center justify-center text-[#b47a96]">Loading chart...</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={stats?.requests_by_day ?? []}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff8fab" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#ff8fab" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="requests"
                  stroke="#fb6f92" strokeWidth={2.5}
                  fill="url(#areaGrad)"
                  dot={{ fill: '#fb6f92', r: 5 }}
                  activeDot={{ r: 7 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </GlassCard>

        {/* Bar chart */}
        <GlassCard className="fade-up fade-up-3">
          <h2 className="font-display font-semibold text-[#4a2035] text-lg mb-1">Bar Comparison</h2>
          <p className="text-xs text-[#b47a96] mb-5">Request count per day</p>
          {loading ? (
            <div className="h-48 flex items-center justify-center text-[#b47a96]">Loading chart...</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats?.requests_by_day ?? []}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffb347" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#ff8fab" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="requests" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </GlassCard>
      </div>

      {/* Breakdown */}
      <GlassCard className="fade-up fade-up-4">
        <h2 className="font-display font-semibold text-[#4a2035] text-lg mb-5">Usage Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'This Hour', value: stats?.requests_this_hour ?? 0, icon: <Clock size={16} />, color: '#ff8fab' },
            { label: 'Today', value: stats?.requests_today ?? 0, icon: <Activity size={16} />, color: '#ffb347' },
            { label: 'This Month', value: stats?.requests_this_month ?? 0, icon: <TrendingUp size={16} />, color: '#c8a2c8' },
            { label: 'All Time', value: stats?.total_requests ?? 0, icon: <CheckCircle size={16} />, color: '#95c47d' },
          ].map(item => (
            <div key={item.label} className="text-center p-5 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.40)', border: '1px solid rgba(255,255,255,0.60)' }}>
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl mx-auto mb-3"
                style={{ background: `${item.color}25`, color: item.color }}>
                {item.icon}
              </div>
              <div className="font-display text-2xl font-bold text-[#4a2035]">
                {item.value.toLocaleString()}
              </div>
              <div className="text-xs text-[#b47a96] mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </DashboardLayout>
  )
}
