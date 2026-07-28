'use client'
import { useState, useEffect, useCallback } from 'react'
import { WordPopover } from './WordPopover'
import { copyToClipboard } from '@/lib/utils'
import type { ArabicWord } from '@/lib/types'

type ArabicSize = 'sm' | 'md' | 'lg'

interface ArabicTextProps {
  texteArabe?: string
  mots: ArabicWord[]
}

export function ArabicText({ texteArabe, mots }: ArabicTextProps) {
  const [size, setSize] = useState<ArabicSize>('md')
  const [popover, setPopover] = useState<{ def: string; x: number; y: number } | null>(null)
  const [copyLabel, setCopyLabel] = useState('Copier le texte')

  useEffect(() => {
    const saved = localStorage.getItem('arabic-size') as ArabicSize | null
    if (saved) setSize(saved)
  }, [])

  function changeSize(s: ArabicSize) {
    setSize(s)
    localStorage.setItem('arabic-size', s)
  }

  function handleWordClick(e: React.MouseEvent, def: string) {
    e.stopPropagation()
    setPopover({ def, x: e.clientX, y: e.clientY })
  }

  function handleWordKeyDown(e: React.KeyboardEvent, def: string) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const rect = (e.target as HTMLElement).getBoundingClientRect()
      setPopover({ def, x: rect.left, y: rect.bottom })
    }
  }

  const closePopover = useCallback(() => setPopover(null), [])

  async function handleCopy() {
    const text = texteArabe ?? mots.map(m => m.mot).join(' ')
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopyLabel('Copié ✓')
      setTimeout(() => setCopyLabel('Copier le texte'), 2000)
    }
  }

  useEffect(() => {
    if (!popover) return
    function handleClickOutside() { setPopover(null) }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [popover])

  const fontSizeMap: Record<ArabicSize, string> = { sm: '1.1rem', md: '1.35rem', lg: '1.65rem' }

  return (
    <div className="card p-6">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2
          className="text-base font-semibold manuscript-margin"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Texte arabe
        </h2>
        <div className="flex items-center gap-3">
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

      {/* Texte structuré — affiché en priorité si disponible */}
      {texteArabe ? (
        <div
          role="region"
          aria-label="Texte arabe"
          dir="rtl"
          style={{
            fontFamily: 'var(--font-arabic)',
            fontSize: fontSizeMap[size],
            lineHeight: 2.2,
            color: 'var(--ink)',
            textAlign: 'right',
          }}
        >
          {parseArabicBlocks(texteArabe).map((block, i) => {
            if (block.type === 'heading') {
              return (
                <p key={i} style={{ fontWeight: 700, marginBottom: '0.15em', marginTop: '0.6em' }}>
                  {block.text}
                </p>
              )
            }
            if (block.type === 'separator') {
              return (
                <p key={i} style={{ fontSize: '0.65em', color: 'var(--ink-soft)', margin: '0.8em 0 0.2em' }}>
                  {block.text}
                </p>
              )
            }
            if (block.type === 'empty') {
              return <div key={i} style={{ height: '0.6em' }} />
            }
            return <p key={i}>{block.text}</p>
          })}
        </div>
      ) : (
        /* Fallback : mots cliquables si pas de texte brut */
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
      )}

      {/* Section analyse mot à mot — disponible quand on a les deux */}
      {texteArabe && mots.length > 0 && (
        <details className="mt-5">
          <summary
            className="text-xs cursor-pointer select-none"
            style={{ color: 'var(--ink-soft)' }}
          >
            Analyse mot à mot ({mots.length} mots)
          </summary>
          <div
            dir="rtl"
            className="mt-3 text-right flex flex-wrap gap-1"
            style={{ fontFamily: 'var(--font-arabic)' }}
          >
            {mots.map((item, i) => (
              <button
                key={`${item.mot}-${i}`}
                className="word-token"
                aria-label={item.mot}
                onClick={(e) => handleWordClick(e, item.def)}
                onKeyDown={(e) => handleWordKeyDown(e, item.def)}
              >
                {item.mot}
              </button>
            ))}
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--ink-soft)' }}>
            Clique sur un mot pour voir sa définition.
          </p>
        </details>
      )}

      {!texteArabe && mots.length > 0 && (
        <p className="text-xs mt-3" style={{ color: 'var(--ink-soft)' }}>
          Clique sur un mot pour voir sa définition.
        </p>
      )}

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

type ArabicBlock =
  | { type: 'heading'; text: string }
  | { type: 'separator'; text: string }
  | { type: 'empty' }
  | { type: 'para'; text: string }

function parseArabicBlocks(text: string): ArabicBlock[] {
  return text.split('\n').map(line => {
    const t = line.trimEnd()
    if (t.startsWith('## ')) return { type: 'heading', text: t.slice(3).trim() }
    if (t.startsWith('# '))  return { type: 'heading', text: t.slice(2).trim() }
    if (t.startsWith('---')) return { type: 'separator', text: t }
    if (t.length === 0)      return { type: 'empty' }
    return { type: 'para', text: t }
  })
}
