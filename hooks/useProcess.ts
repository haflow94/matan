'use client'
import { useState } from 'react'
import type { ProcessRequest, ProcessResponse } from '@/lib/types'

// États possibles du hook
type Status = 'idle' | 'loading' | 'success' | 'error'

/**
 * Hook qui appelle /api/process et gère les états idle/loading/success/error.
 * Persiste le dernier driveUrl dans sessionStorage pour pré-remplir le formulaire.
 */
export function useProcess() {
  const [status, setStatus] = useState<Status>('idle')
  const [data, setData] = useState<ProcessResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function process(req: ProcessRequest) {
    setStatus('loading')
    setError(null)

    // Persistance du dernier lien Drive utilisé
    sessionStorage.setItem('lastDriveUrl', req.driveUrl)

    try {
      const res = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      })
      const json = await res.json()

      if (!res.ok) {
        // Erreur métier retournée par l'API (ex: DRIVE_ACCESS_DENIED)
        setStatus('error')
        setError(json.error ?? 'Erreur inconnue')
        return
      }

      setData(json as ProcessResponse)
      setStatus('success')
    } catch {
      // Erreur réseau ou serveur injoignable
      setStatus('error')
      setError('Impossible de joindre le serveur')
    }
  }

  return { status, data, error, process }
}
