'use client'
import { useState } from 'react'
import type { ProcessResponse } from '@/lib/types'

type Status = 'idle' | 'loading' | 'success' | 'error'

// Deux modes d'envoi : lien Drive (JSON) ou fichier local (multipart)
type ProcessInput =
  | { driveUrl: string; pages: string; file?: never }
  | { file: File; pages: string; driveUrl?: never }

export function useProcess() {
  const [status, setStatus] = useState<Status>('idle')
  const [data, setData] = useState<ProcessResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Retourne l'erreur directement pour éviter le bug de closure React
  async function process(input: ProcessInput): Promise<string | null> {
    setStatus('loading')
    setError(null)

    if (input.driveUrl) {
      sessionStorage.setItem('lastDriveUrl', input.driveUrl)
    }

    try {
      let res: Response

      if (input.file) {
        // Fichier local → multipart/form-data
        const formData = new FormData()
        formData.append('file', input.file)
        formData.append('pages', input.pages)
        res = await fetch('/api/process', { method: 'POST', body: formData })
      } else {
        // Lien Drive → JSON
        res = await fetch('/api/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ driveUrl: input.driveUrl, pages: input.pages }),
        })
      }

      const json = await res.json()
      if (!res.ok) {
        const msg = json.error ?? 'Erreur inconnue'
        setStatus('error')
        setError(msg)
        return msg
      }

      setData(json as ProcessResponse)
      setStatus('success')
      return null
    } catch {
      const msg = 'Impossible de joindre le serveur'
      setStatus('error')
      setError(msg)
      return msg
    }
  }

  return { status, data, error, process }
}
