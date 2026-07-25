'use client'
import { useState, useEffect, useCallback } from 'react'
import { WordPopover } from './WordPopover'
import { copyToClipboard } from '@/lib/utils'
import type { ArabicWord } from '@/lib/types'

// Tailles disponibles pour le texte arabe
type ArabicSize = 'sm' | 'md' | 'lg'

interface ArabicTextProps {
  mots: ArabicWord[]
}

// Composant principal : affiche le texte arabe avec mots cliquables
// dir="rtl" est posé uniquement sur le conteneur du texte, pas sur un parent
export function ArabicText({ mots }: ArabicTextProps) {
  const [size, setSize] = useState<ArabicSize>('md')
  const [popover, setPopover] = useState<{ def: string; x: number; y: number } | null>(null)
  const [copyLabel, setCopyLabel] = useState('Copier le texte')

  // Charger la préférence de taille depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('arabic-size') as ArabicSize | null
    if (saved) setSize(saved)
  }, [])

  // Persister la taille choisie
  function changeSize(s: ArabicSize) {
    setSize(s)
    localStorage.setItem('arabic-size', s)
  }

  // Ouvrir le popover au clic sur un mot
  function handleWordClick(e: React.MouseEvent, def: string) {
    e.stopPropagation()
    setPopover({ def, x: e.clientX, y: e.clientY })
  }

  // Ouvrir le popover au clavier (Enter ou Espace)
  function handleWordKeyDown(e: React.KeyboardEvent, def: string) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const rect = (e.target as HTMLElement).getBoundingClientRect()
      setPopover({ def, x: rect.left, y: rect.bottom })
    }
  }

  const closePopover = useCallback(() => setPopover(null), [])

  // Copier tous les mots dans le presse-papier
  async function handleCopy() {
    const text = mots.map(m => m.mot).join(' ')
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopyLabel('Copié ✓')
      setTimeout(() => setCopyLabel('Copier le texte'), 2000)
    }
  }

  // Fermer le popover en cliquant à l'extérieur
  useEffect(() => {
    if (!popover) return
    function handleClickOutside() { setPopover(null) }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [popover])

  return (
    <div className="card p-6">
      {/* En-tête avec titre et contrôles */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2
          className="text-base font-semibold manuscript-margin"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Texte arabe
        </h2>
        <div className="flex items-center gap-3">
          {/* Contrôles de taille A- / A / A+ */}
          <div className="flex items-center gap-1">
            {(['sm', 'md', 'lg'] as ArabicSize[]).map((s, i) => (
              <button
                key={s}
                onClick={() => changeSize(s)}
                aria-label={`Taille ${['petite', 'normale', 'grande'][i]}`}
                aria-pressed={size === s}
                className="px-2 py-1 rounded text-xs"
                style={{
                  background: size === s ? 'var(--teal-soft)' : 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  color: 'var(--ink)',
                }}
              >
                {['A-', 'A', 'A+'][i]}
              </button>
            ))}
          </div>
          {/* Bouton copier */}
          <button
            onClick={handleCopy}
            className="text-xs px-3 py-1.5 rounded-lg"
            style={{
              border: '1px solid var(--border)',
              background: 'var(--surface-2)',
              color: 'var(--ink)',
            }}
          >
            {copyLabel}
          </button>
        </div>
      </div>

      {/* Conteneur RTL — dir="rtl" localisé sur ce seul élément */}
      <div
        role="region"
        aria-label="Texte arabe"
        dir="rtl"
        className={`arabic-${size} text-right`}
        style={{ fontFamily: 'var(--font-arabic)', color: 'var(--ink)' }}
      >
        {mots.map((item, i) => (
          <button
            key={`${item.mot}-${i}`}
            className="word-token"
            aria-label={item.mot}
            onClick={(e) => handleWordClick(e, item.def)}
            onKeyDown={(e) => handleWordKeyDown(e, item.def)}
          >
            {item.mot}{' '}
          </button>
        ))}
      </div>

      <p className="text-xs mt-3" style={{ color: 'var(--ink-soft)' }}>
        Clique sur un mot pour voir sa définition.
      </p>

      {/* Popover position:fixed pour éviter le clipping du card */}
      {popover && (
        <WordPopover
          definition={popover.def}
          x={popover.x}
          y={popover.y}
          onClose={closePopover}
        />
      )}
    </div>
  )
}
