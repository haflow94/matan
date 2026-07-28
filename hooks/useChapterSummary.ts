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

  // Retourne l'erreur directement pour éviter le bug de closure React
  async function load(req: ChapterSummaryRequest): Promise<string | null> {
    const key = chapterCacheKey(req.driveUrl, req.chapitreTitre)

    // Vérifier le cache avant tout appel réseau
    const cached = localStorage.getItem(key)
    if (cached) {
      setData(JSON.parse(cached) as ChapterSummaryResponse)
      setStatus('success')
      return null
    }

    setStatus('loading')
    setError(null)

    try {
      const res = await fetch('/api/chapter-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      })

      if (!res.ok) {
        const msg = (await res.json())?.error ?? 'Erreur lors du chargement du résumé'
        setStatus('error')
        setError(msg)
        return msg
      }

      const json = await res.json()
      const chapter = json as ChapterSummaryResponse
      localStorage.setItem(key, JSON.stringify(chapter))
      setData(chapter)
      setStatus('success')
      return null
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Impossible de joindre le serveur'
      setStatus('error')
      setError(msg)
      return msg
    }
  }

  return { status, data, error, load }
}
