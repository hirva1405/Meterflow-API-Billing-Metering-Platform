import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Code2, Key, BarChart2, CreditCard,
  LogOut, Flower2, Zap
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const NAV = [
  { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/apis', icon: <Code2 size={18} />, label: 'My APIs' },
  { to: '/keys', icon: <Key size={18} />, label: 'API Keys' },
  { to: '/usage', icon: <BarChart2 size={18} />, label: 'Usage' },
  { to: '/billing', icon: <CreditCard size={18} />, label: 'Billing' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar w-64 min-h-screen flex flex-col px-4 py-6 fixed left-0 top-0 bottom-0 z-20">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="w-9 h-9 rounded-2xl flex items-center justify-center float"
          style={{ background: 'linear-gradient(135deg, #ff8fab, #fb6f92)' }}>
          <Flower2 size={18} className="text-white" />
        </div>
        <div>
          <div className="font-display font-bold text-[#4a2035] text-lg leading-none">MeterFlow</div>
          <div className="text-[10px] text-[#b47a96] font-mono tracking-wider mt-0.5">API BILLING</div>
        </div>
      </div>

      {/* User pill */}
      {user && (
        <div className="glass-dark px-3 py-2.5 mb-6 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #ffb347, #ff8fab)' }}>
            {user.full_name?.[0]?.toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-semibold text-[#4a2035] truncate">{user.full_name}</div>
            <div className="text-xs text-[#b47a96] truncate">{user.email}</div>
          </div>
          <span className="badge badge-pink ml-auto capitalize">{user.plan}</span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-white/30">
        <div className="flex items-center gap-2 px-2 py-1">
          <Zap size={12} className="text-yellow-400" />
          <span className="text-xs text-[#b47a96]">All systems blooming 🌸</span>
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-item text-[#c44d7b] hover:bg-rose-50/40 w-full"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
