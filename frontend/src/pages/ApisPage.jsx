import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit3, Power, Flower2, X } from 'lucide-react'
import DashboardLayout from '../components/ui/DashboardLayout'
import GlassCard from '../components/ui/GlassCard'
import { apisApi } from '../utils/api'
import { toast } from '../components/ui/Toast'

const DEFAULT_FORM = {
  name: '', description: '', endpoint_url: '',
  rate_limit_per_minute: 60, rate_limit_per_day: 10000,
  price_per_1k_requests: 0.50,
}

export default function ApisPage() {
  const [apis, setApis] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)

  const load = () => apisApi.list().then(r => setApis(r.data)).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await apisApi.create(form)
      toast('API created! 🌸', 'success')
      setShowModal(false)
      setForm(DEFAULT_FORM)
      load()
    } catch (err) {
      toast(err.response?.data?.detail || 'Failed to create', 'error')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await apisApi.delete(id)
      toast(`"${name}" deleted`, 'info')
      load()
    } catch { toast('Failed to delete', 'error') }
  }

  const handleToggle = async (api) => {
    try {
      await apisApi.update(api.id, { is_active: !api.is_active })
      toast(`API ${!api.is_active ? 'activated' : 'deactivated'}`, 'success')
      load()
    } catch { toast('Update failed', 'error') }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8 fade-up">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#4a2035]">My APIs 🌺</h1>
          <p className="text-[#b47a96] mt-1">Create and manage your API products</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-bloom flex items-center gap-2">
          <Plus size={16} /> New API
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#b47a96]">Loading your APIs...</div>
      ) : apis.length === 0 ? (
        <GlassCard className="text-center py-16 fade-up">
          <div className="text-6xl mb-4">🌱</div>
          <h2 className="font-display text-xl font-semibold text-[#4a2035] mb-2">No APIs yet</h2>
          <p className="text-[#b47a96] mb-6">Plant your first API to start tracking usage and billing</p>
          <button onClick={() => setShowModal(true)} className="btn-bloom">
            <Plus size={15} /> Create your first API
          </button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {apis.map((api, i) => (
            <div key={api.id} className={`glass-card p-5 fade-up fade-up-${(i % 5) + 1}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(255,143,171,0.35), rgba(200,162,200,0.25))' }}>
                    <Flower2 size={16} className="text-[#ff8fab]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#4a2035] text-sm leading-tight">{api.name}</div>
                    <span className={`badge mt-0.5 ${api.is_active ? 'badge-green' : 'badge-pink'}`}>
                      {api.is_active ? '● Active' : '○ Off'}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#b47a96] mb-4 line-clamp-2 min-h-[2rem]">
                {api.description || 'No description provided'}
              </p>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { label: 'Rate Limit', value: `${api.rate_limit_per_minute}/min` },
                  { label: 'Daily Limit', value: `${api.rate_limit_per_day.toLocaleString()}/day` },
                  { label: 'Price', value: `$${api.price_per_1k_requests}/1k` },
                  { label: 'Today', value: `${api.total_requests_today ?? 0} reqs` },
                ].map(stat => (
                  <div key={stat.label} className="rounded-xl p-2.5"
                    style={{ background: 'rgba(255,255,255,0.40)', border: '1px solid rgba(255,255,255,0.55)' }}>
                    <div className="text-[10px] text-[#b47a96] uppercase tracking-wide">{stat.label}</div>
                    <div className="font-mono text-sm font-medium text-[#4a2035]">{stat.value}</div>
                  </div>
                ))}
              </div>

              {api.endpoint_url && (
                <div className="api-key-chip mb-4 text-xs truncate">
                  🔗 {api.endpoint_url}
                </div>
              )}

              <div className="flex gap-2 border-t border-white/40 pt-3">
                <button
                  onClick={() => handleToggle(api)}
                  className="flex-1 btn-ghost text-xs py-2 flex items-center justify-center gap-1.5"
                >
                  <Power size={13} />
                  {api.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDelete(api.id, api.name)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-rose-100/50"
                  style={{ border: '1px solid rgba(255,143,171,0.25)' }}
                >
                  <Trash2 size={14} className="text-rose-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(74, 32, 53, 0.25)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-card p-8 w-full max-w-lg fade-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-[#4a2035]">🌸 Create New API</h2>
              <button onClick={() => setShowModal(false)} className="text-[#b47a96] hover:text-[#4a2035]">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-[#8b4a6a] mb-1.5 block uppercase tracking-wide">API Name *</label>
                <input className="input-floral" placeholder="e.g. Weather API" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#8b4a6a] mb-1.5 block uppercase tracking-wide">Description</label>
                <textarea className="input-floral" rows={2} placeholder="What does this API do?"
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#8b4a6a] mb-1.5 block uppercase tracking-wide">Endpoint URL</label>
                <input className="input-floral font-mono text-sm" placeholder="https://your-api.com/v1"
                  value={form.endpoint_url} onChange={e => setForm(f => ({ ...f, endpoint_url: e.target.value }))} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#8b4a6a] mb-1.5 block uppercase tracking-wide">Rate/min</label>
                  <input className="input-floral font-mono" type="number" min={1}
                    value={form.rate_limit_per_minute}
                    onChange={e => setForm(f => ({ ...f, rate_limit_per_minute: +e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#8b4a6a] mb-1.5 block uppercase tracking-wide">Rate/day</label>
                  <input className="input-floral font-mono" type="number" min={1}
                    value={form.rate_limit_per_day}
                    onChange={e => setForm(f => ({ ...f, rate_limit_per_day: +e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#8b4a6a] mb-1.5 block uppercase tracking-wide">$/1k reqs</label>
                  <input className="input-floral font-mono" type="number" min={0} step={0.01}
                    value={form.price_per_1k_requests}
                    onChange={e => setForm(f => ({ ...f, price_per_1k_requests: +e.target.value }))} />
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-bloom flex-1 flex items-center justify-center gap-2">
                  {saving ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Plus size={15} />}
                  Create API
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
