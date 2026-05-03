import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flower2, Eye, EyeOff, Sparkles } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import FloatingPetals from '../components/ui/FloatingPetals'
import { toast } from '../components/ui/Toast'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ email: '', password: '', full_name: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        await register(form.email, form.password, form.full_name)
      }
      toast('Welcome to MeterFlow! 🌸', 'success')
      navigate('/dashboard')
    } catch (err) {
      const detail = err.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-floral min-h-screen flex items-center justify-center relative overflow-hidden">
      <FloatingPetals count={20} />

      <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full opacity-30 float-slow"
        style={{ background: 'radial-gradient(circle, #ffb347, transparent 70%)' }} />
      <div className="absolute bottom-[-60px] left-[-60px] w-72 h-72 rounded-full opacity-25 float"
        style={{ background: 'radial-gradient(circle, #ff8fab, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8 fade-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl mb-4 float"
            style={{ background: 'linear-gradient(135deg, #ff8fab, #fb6f92)' }}>
            <Flower2 size={28} className="text-white" />
          </div>
          <h1 className="font-display text-4xl font-bold text-[#4a2035]">
            Meter<span className="shimmer-text">Flow</span>
          </h1>
          <p className="text-[#b47a96] mt-1.5 text-sm">Usage-Based API Billing Platform</p>
        </div>

        <div className="glass-card p-8 fade-up fade-up-1">
          <div className="flex gap-1 p-1 rounded-2xl mb-7"
            style={{ background: 'rgba(255,143,171,0.10)' }}>
            {['login', 'register'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                style={mode === m ? {
                  background: 'linear-gradient(135deg, #ff8fab, #fb6f92)',
                  color: 'white',
                  boxShadow: '0 4px 14px rgba(255,143,171,0.40)'
                } : { color: '#8b4a6a' }}
              >
                {m === 'login' ? '🌸 Sign In' : '✨ Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'register' && (
              <div className="fade-up">
                <label className="text-xs font-semibold text-[#8b4a6a] mb-1.5 block uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  className="input-floral"
                  type="text"
                  placeholder="Your full name"
                  value={form.full_name}
                  onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                  required
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-[#8b4a6a] mb-1.5 block uppercase tracking-wide">
                Email
              </label>
              <input
                className="input-floral"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#8b4a6a] mb-1.5 block uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  className="input-floral pr-11"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b47a96] hover:text-[#ff8fab] transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-rose-500 bg-rose-50/60 border border-rose-200/60 rounded-xl px-3 py-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-bloom w-full py-3 text-base mt-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles size={16} />
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#b47a96] mt-5 fade-up fade-up-2">
          🌸 Inspired by Stripe · RapidAPI · AWS API Gateway
        </p>
      </div>
    </div>
  )
}