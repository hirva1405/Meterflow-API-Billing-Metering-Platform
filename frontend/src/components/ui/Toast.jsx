import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

const toastQueue = []
let listeners = []

export function toast(message, type = 'success') {
  const id = Date.now()
  toastQueue.push({ id, message, type })
  listeners.forEach(fn => fn([...toastQueue]))
  setTimeout(() => {
    const idx = toastQueue.findIndex(t => t.id === id)
    if (idx !== -1) toastQueue.splice(idx, 1)
    listeners.forEach(fn => fn([...toastQueue]))
  }, 3500)
}

const icons = {
  success: <CheckCircle size={16} className="text-green-500" />,
  error: <AlertCircle size={16} className="text-rose-500" />,
  info: <Info size={16} className="text-blue-400" />,
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    listeners.push(setToasts)
    return () => { listeners = listeners.filter(l => l !== setToasts) }
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className="glass-card flex items-center gap-3 px-4 py-3 text-sm fade-up min-w-[240px] max-w-xs"
          style={{ borderRadius: 14 }}
        >
          {icons[t.type]}
          <span className="text-[#4a2035] font-medium flex-1">{t.message}</span>
        </div>
      ))}
    </div>
  )
}
