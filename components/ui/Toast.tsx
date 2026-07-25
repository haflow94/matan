'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

type ToastType = 'success' | 'error'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (type === 'success') {
      // Succès : fermeture auto 2s
      timerRef.current = setTimeout(onClose, 2000)
    }
    // Erreur : pas d'auto-dismiss, fermeture manuelle uniquement
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [type, onClose])

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm"
      style={{
        background: type === 'error' ? 'var(--teal-deep)' : 'var(--teal)',
        color: 'var(--cream)',
        border: '1px solid var(--gold)',
        minWidth: '16rem',
        maxWidth: 'calc(100vw - 2rem)',
      }}
    >
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        aria-label="Fermer la notification"
        className="shrink-0 w-6 h-6 flex items-center justify-center rounded hover:opacity-75"
      >
        ✕
      </button>
    </div>
  )
}

interface ToastState {
  message: string
  type: ToastType
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null)

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type })
  }, [])

  const closeToast = useCallback(() => setToast(null), [])

  return { toast, showToast, closeToast }
}
