'use client'
import { useState, useEffect } from 'react'

interface ChapterSelectorProps {
  onLoad: (driveUrl: string, titre: string) => void
  isLoading: boolean
}

export function ChapterSelector({ onLoad, isLoading }: ChapterSelectorProps) {
  const [driveUrl, setDriveUrl] = useState('')
  const [titre, setTitre] = useState('')
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    const saved = sessionStorage.getItem('lastDriveUrl')
    if (saved) setDriveUrl(saved)
    const hist = localStorage.getItem('chapterHistory')
    if (hist) setHistory(JSON.parse(hist) as string[])
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!driveUrl.trim() || !titre.trim()) return
    const key = `${driveUrl}::${titre}`
    if (!history.includes(key)) {
      const updated = [key, ...history].slice(0, 10)
      setHistory(updated)
      localStorage.setItem('chapterHistory', JSON.stringify(updated))
    }
    onLoad(driveUrl.trim(), titre.trim())
  }

  function loadFromHistory(key: string) {
    const [url, t] = key.split('::')
    setDriveUrl(url)
    setTitre(t)
    onLoad(url, t)
  }

  return (
    <div className="card p-5">
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label
            htmlFor="chapter-drive-url"
            className="block text-xs font-medium mb-1.5"
            style={{ color: 'var(--ink-soft)' }}
          >
            Lien Google Drive du PDF
          </label>
          <input
            id="chapter-drive-url"
            type="url"
            value={driveUrl}
            onChange={e => setDriveUrl(e.target.value)}
            placeholder="https://drive.google.com/..."
            className="w-full px-3 py-2 rounded-lg text-sm"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--ink)' }}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="chapter-titre"
            className="block text-xs font-medium mb-1.5"
            style={{ color: 'var(--ink-soft)' }}
          >
            Titre du chapitre
          </label>
          <input
            id="chapter-titre"
            type="text"
            value={titre}
            onChange={e => setTitre(e.target.value)}
            placeholder="ex : Chapitre 1 — Définition du Tafsīr"
            className="w-full px-3 py-2 rounded-lg text-sm"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--ink)' }}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !driveUrl.trim() || !titre.trim()}
          aria-busy={isLoading}
          className="w-full rounded-lg py-2.5 text-sm font-semibold"
          style={{
            background: 'var(--teal)',
            color: 'var(--cream)',
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Chargement…' : 'Charger le résumé'}
        </button>
      </form>

      {history.length > 0 && (
        <div className="mt-4">
          <p className="text-xs mb-2" style={{ color: 'var(--ink-soft)' }}>Récents :</p>
          <div className="flex flex-wrap gap-2">
            {history.map(key => {
              const [, t] = key.split('::')
              return (
                <button
                  key={key}
                  onClick={() => loadFromHistory(key)}
                  className="text-xs px-2 py-1 rounded-full border"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--ink-soft)',
                    background: 'var(--surface-2)',
                  }}
                >
                  {t}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
