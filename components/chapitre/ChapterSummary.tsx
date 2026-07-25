'use client'
import { useState } from 'react'
import { copyToClipboard } from '@/lib/utils'
import type { ChapterSummaryResponse } from '@/lib/types'

interface ChapterSummaryProps {
  data: ChapterSummaryResponse
}

export function ChapterSummary({ data }: ChapterSummaryProps) {
  const [copyArLabel, setCopyArLabel] = useState('Copier')
  const [copyFrLabel, setCopyFrLabel] = useState('Copier')

  async function handleCopy(text: string, setLabel: (l: string) => void) {
    await copyToClipboard(text)
    setLabel('Copié ✓')
    setTimeout(() => setLabel('Copier'), 2000)
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Résumé arabe */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-base font-semibold manuscript-margin"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Résumé — Arabe
          </h2>
          <button
            onClick={() => handleCopy(data.resumeArabe, setCopyArLabel)}
            className="text-xs px-3 py-1.5 rounded-lg"
            style={{ border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--ink)' }}
          >
            {copyArLabel}
          </button>
        </div>
        {/* dir="rtl" localisé sur le paragraphe arabe uniquement */}
        <p
          dir="rtl"
          className="arabic-sm text-right"
          style={{ fontFamily: 'var(--font-arabic)' }}
        >
          {data.resumeArabe}
        </p>
      </div>

      {/* Résumé français */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-base font-semibold manuscript-margin"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Résumé — Français
          </h2>
          <button
            onClick={() => handleCopy(data.resumeFrancais, setCopyFrLabel)}
            className="text-xs px-3 py-1.5 rounded-lg"
            style={{ border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--ink)' }}
          >
            {copyFrLabel}
          </button>
        </div>
        <p
          dir="ltr"
          className="text-[15px] leading-relaxed"
          style={{ color: 'var(--ink-soft)' }}
        >
          {data.resumeFrancais}
        </p>
      </div>
    </div>
  )
}
