'use client'
import { useEffect, useRef } from 'react'

interface WordPopoverProps {
  definition: string
  x: number
  y: number
  onClose: () => void
}

// Popover positionné en fixed pour éviter le clipping du card overflow:hidden
export function WordPopover({ definition, x, y, onClose }: WordPopoverProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Fermeture via la touche Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Calculer la position pour rester dans le viewport
  const left = Math.min(x, window.innerWidth - 320)
  const maxW = Math.min(window.innerWidth - 32, 320)

  return (
    <div
      ref={ref}
      role="tooltip"
      aria-live="polite"
      dir="ltr"
      className="fixed z-50 text-sm rounded-lg shadow-lg p-3"
      style={{
        left,
        top: y + 12,
        maxWidth: maxW,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        color: 'var(--ink)',
      }}
    >
      {definition}
    </div>
  )
}
