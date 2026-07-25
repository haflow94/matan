'use client'
// Hook pour charger le résumé d'un chapitre — cache localStorage + appel /api/chapter-summary
import { useState } from 'react'
import type { ChapterSummaryRequest, ChapterSummaryResponse } from '@/lib/types'
import { chapterCacheKey } from '@/lib/utils'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function useChapterSummary() {
  const [status, setStatus] = useState<Status>('idle')
  const [data, setData] = useState<ChapterSummaryResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function load(req: ChapterSummaryRequest) {
    const key = chapterCacheKey(req.driveUrl, req.chapitreTitre)

    // Vérifier le cache avant tout appel réseau
    const cached = localStorage.getItem(key)
    if (cached) {
      setData(JSON.parse(cached) as ChapterSummaryResponse)
      setStatus('success')
      return
    }

    setStatus('loading')
    setError(null)

    try {
      const res = await fetch('/api/chapter-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      })
      const json = await res.json()
      if (!res.ok) {
        setStatus('error')
        setError(json.error ?? 'Erreur inconnue')
        return
      }
      const chapter = json as ChapterSummaryResponse
      localStorage.setItem(key, JSON.stringify(chapter))
      setData(chapter)
      setStatus('success')
    } catch {
      setStatus('error')
      setError('Impossible de joindre le serveur')
    }
  }

  return { status, data, error, load }
}
