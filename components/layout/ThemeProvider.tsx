'use client'
import { useTheme } from '@/hooks/useTheme'

export function ThemeToggleButton() {
  const { isDark, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      className="w-10 h-10 rounded-full flex items-center justify-center border"
      style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'var(--gold)' }}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
