import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import type { Toast } from '../types'

interface ToastContextValue {
  showToast: (type: Toast['type'], message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} })
export const useToast = () => useContext(ToastContext)

const ICONS = {
  success: CheckCircle,
  error:   XCircle,
  info:    Info,
  warning: AlertTriangle,
}

const STYLES: Record<Toast['type'], { border: string; bg: string; color: string }> = {
  success: { border: 'rgba(16,185,129,0.35)',  bg: 'rgba(16,185,129,0.08)',   color: '#10b981' },
  error:   { border: 'rgba(239,68,68,0.35)',   bg: 'rgba(239,68,68,0.08)',    color: '#ef4444' },
  info:    { border: 'rgba(183,93,105,0.35)',  bg: 'rgba(183,93,105,0.08)',   color: '#B75D69' },
  warning: { border: 'rgba(245,158,11,0.35)',  bg: 'rgba(245,158,11,0.08)',   color: '#f59e0b' },
}

function ToastItem({ toast, onRemove }: { toast: Toast & { exiting?: boolean }; onRemove: (id: string) => void }) {
  const Icon = ICONS[toast.type]
  const st = STYLES[toast.type]
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl max-w-sm w-full shadow-lg pointer-events-auto backdrop-blur-md
        ${toast.exiting ? 'animate-toast-out' : 'animate-toast-in'}`}
      style={{
        background: st.bg,
        border: `1px solid ${st.border}`,
        backdropFilter: 'blur(16px)',
      }}
      role="alert"
      aria-live="polite"
    >
      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: st.color }} />
      <p className="flex-1 text-sm font-medium dark-transition" style={{ fontFamily: "'DM Sans', sans-serif", color: 'var(--text-primary)' }}>
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Array<Toast & { exiting?: boolean }>>([])

  const showToast = useCallback((type: Toast['type'], message: string, duration = 4500) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev.slice(-4), { id, type, message, duration }])

    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t))
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 350)
    }, duration)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t))
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 350)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none" role="status" aria-live="polite">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
