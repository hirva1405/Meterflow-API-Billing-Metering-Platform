import { useEffect, useState } from 'react'
import { Plus, Copy, Trash2, Key, CheckCircle, X } from 'lucide-react'
import DashboardLayout from '../components/ui/DashboardLayout'
import GlassCard from '../components/ui/GlassCard'
import { apisApi, keysApi } from '../utils/api'
import { toast } from '../components/ui/Toast'

export default function KeysPage() {
  const [apis, setApis] = useState([])
  const [selectedApi, setSelectedApi] = useState(null)
  const [keys, setKeys] = useState([])
  const [loadingApis, setLoadingApis] = useState(true)
  const [loadingKeys, setLoadingKeys] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState('Default Key')
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    apisApi.list().then(r => {
      setApis(r.data)
      if (r.data.length > 0) setSelectedApi(r.data[0])
    }).finally(() => setLoadingApis(false))
  }, [])

  useEffect(() => {
    if (!selectedApi) return
    setLoadingKeys(true)
    keysApi.list(selectedApi.id).then(r => setKeys(r.data)).finally(() => setLoadingKeys(false))
  }, [selectedApi])

  const copyKey = (key, id) => {
    navigator.clipboard.writeText(key)
    setCopiedId(id)
    toast('API key copied! 🔑', 'success')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleCreate = async () => {
    if (!selectedApi) return
    try {
      const r = await keysApi.create(selectedApi.id, { name: newKeyName })
      toast('Key generated! 🌸', 'success')
      setKeys(k => [r.data, ...k])
      setShowModal(false)
      setNewKeyName('Default Key')
    } catch { toast('Failed to create key', 'error') }
  }

  const handleRevoke = async (keyId, name) => {
    if (!confirm(`Revoke key "${name}"?`)) return
    try {
      await keysApi.revoke(selectedApi.id, keyId)
      toast('Key revoked', 'info')
      setKeys(k => k.filter(x => x.id !== keyId))
    } catch { toast('Failed to revoke', 'error') }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8 fade-up">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#4a2035]">API Keys 🔑</h1>
          <p className="text-[#b47a96] mt-1">Generate and manage access keys for your APIs</p>
        </div>
        {selectedApi && (
          <button onClick={() => setShowModal(true)} className="btn-bloom flex items-center gap-2">
            <Plus size={16} /> Generate Key
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* API Selector */}
        <div className="xl:col-span-1 fade-up">
          <GlassCard className="p-4">
            <h3 className="font-semibold text-[#4a2035] text-sm mb-3">Select API</h3>
            {loadingApis ? (
              <div className="text-[#b47a96] text-sm text-center py-4">Loading...</div>
            ) : apis.length === 0 ? (
              <div className="text-[#b47a96] text-sm text-center py-4">No APIs yet. Create one first!</div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {apis.map(api => (
                  <button
                    key={api.id}
                    onClick={() => setSelectedApi(api)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all w-full"
                    style={selectedApi?.id === api.id ? {
                      background: 'linear-gradient(135deg, rgba(255,143,171,0.25), rgba(255,143,171,0.10))',
                      border: '1px solid rgba(255,143,171,0.35)',
                    } : {
                      background: 'rgba(255,255,255,0.35)',
                      border: '1px solid rgba(255,255,255,0.55)',
                    }}
                  >
                    <Key size={14} className="text-[#ff8fab] flex-shrink-0" />
                    <div className="overflow-hidden">
                      <div className="text-sm font-medium text-[#4a2035] truncate">{api.name}</div>
                      <div className="text-xs text-[#b47a96]">{api.total_keys ?? 0} keys</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Keys list */}
        <div className="xl:col-span-3 fade-up fade-up-1">
          {!selectedApi ? (
            <GlassCard className="text-center py-16">
              <div className="text-5xl mb-3">🗝️</div>
              <p className="text-[#b47a96]">Select an API to manage its keys</p>
            </GlassCard>
          ) : loadingKeys ? (
            <div className="text-center py-20 text-[#b47a96]">Loading keys...</div>
          ) : keys.length === 0 ? (
            <GlassCard className="text-center py-16">
              <div className="text-5xl mb-3">🌱</div>
              <h3 className="font-display text-lg font-semibold text-[#4a2035] mb-2">No keys yet</h3>
              <p className="text-[#b47a96] mb-5">Generate your first API key for <strong>{selectedApi.name}</strong></p>
              <button onClick={() => setShowModal(true)} className="btn-bloom">Generate Key</button>
            </GlassCard>
          ) : (
            <div className="flex flex-col gap-3">
              {keys.map((k, i) => (
                <div key={k.id}
                  className={`glass-card p-5 fade-up fade-up-${(i % 5) + 1}`}
                  style={{ borderRadius: 18 }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ background: k.is_active ? 'rgba(149,196,125,0.25)' : 'rgba(255,143,171,0.20)' }}>
                        <Key size={14} className={k.is_active ? 'text-green-600' : 'text-rose-400'} />
                      </div>
                      <div>
                        <span className="font-semibold text-[#4a2035] text-sm">{k.name}</span>
                        <div className="flex gap-2 mt-0.5">
                          <span className={`badge ${k.is_active ? 'badge-green' : 'badge-pink'}`}>
                            {k.is_active ? '● Active' : '○ Revoked'}
                          </span>
                          {k.expires_at && (
                            <span className="badge badge-peach">
                              Expires {new Date(k.expires_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {k.is_active && (
                      <button
                        onClick={() => handleRevoke(k.id, k.name)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-rose-100/50"
                        style={{ border: '1px solid rgba(255,143,171,0.25)' }}>
                        <Trash2 size={13} className="text-rose-400" />
                      </button>
                    )}
                  </div>

                  {/* Key display */}
                  <div className="flex items-center gap-2 p-3 rounded-xl mb-3"
                    style={{ background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.65)' }}>
                    <code className="font-mono text-xs text-[#8b4a6a] flex-1 truncate">{k.key}</code>
                    <button
                      onClick={() => copyKey(k.key, k.id)}
                      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-rose-100/50"
                    >
                      {copiedId === k.id
                        ? <CheckCircle size={14} className="text-green-500" />
                        : <Copy size={14} className="text-[#b47a96]" />
                      }
                    </button>
                  </div>

                  <div className="flex gap-4 text-xs text-[#b47a96]">
                    <span>📊 {k.total_requests.toLocaleString()} requests</span>
                    {k.last_used_at && (
                      <span>🕐 Last used {new Date(k.last_used_at).toLocaleDateString()}</span>
                    )}
                    <span>📅 Created {new Date(k.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Generate modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(74,32,53,0.25)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-card p-8 w-full max-w-md fade-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-[#4a2035]">🔑 Generate API Key</h2>
              <button onClick={() => setShowModal(false)} className="text-[#b47a96]"><X size={20} /></button>
            </div>
            <p className="text-sm text-[#b47a96] mb-5">
              Generating key for: <strong className="text-[#4a2035]">{selectedApi?.name}</strong>
            </p>
            <div className="mb-6">
              <label className="text-xs font-semibold text-[#8b4a6a] mb-1.5 block uppercase tracking-wide">Key Name</label>
              <input className="input-floral" placeholder="e.g. Production, Testing"
                value={newKeyName} onChange={e => setNewKeyName(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={handleCreate} className="btn-bloom flex-1 flex items-center justify-center gap-2">
                <Key size={15} /> Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
