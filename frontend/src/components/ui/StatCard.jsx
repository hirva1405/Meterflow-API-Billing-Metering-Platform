export default function StatCard({ icon, label, value, sub, gradient, delay = 0 }) {
  return (
    <div
      className="stat-card p-5 fade-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-sm"
          style={{ background: gradient }}
        >
          {icon}
        </div>
      </div>
      <div className="font-display text-2xl font-bold text-[#4a2035] leading-tight">
        {value}
      </div>
      <div className="text-sm font-medium text-[#8b4a6a] mt-0.5">{label}</div>
      {sub && <div className="text-xs text-[#b47a96] mt-1">{sub}</div>}
    </div>
  )
}
