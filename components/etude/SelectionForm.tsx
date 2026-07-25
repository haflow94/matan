'use client'
import { useState, useEffect } from 'react'
import { ProgressSteps, STEPS } from './ProgressSteps'

interface SelectionFormProps {
  onSubmit: (driveUrl: string, pages: string) => void
  isLoading: boolean
}

export function SelectionForm({ onSubmit, isLoading }: SelectionFormProps) {
  const [driveUrl, setDriveUrl] = useState('')
  const [pages, setPages] = useState('')
  const [step, setStep] = useState(0)
  const [isOpen, setIsOpen] = useState(true)

  // Pré-remplir depuis sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('lastDriveUrl')
    if (saved) setDriveUrl(saved)
  }, [])

  // Animer les étapes pendant le chargement
  useEffect(() => {
    if (!isLoading) { setStep(0); return }
    const interval = setInterval(() => {
      setStep(s => (s + 1) % STEPS.length)
    }, 1400)
    return () => clearInterval(interval)
  }, [isLoading])

  // Réduire le formulaire sur mobile après soumission
  useEffect(() => {
    if (!isLoading) return
    // Seulement sur mobile (< 1024px)
    if (window.innerWidth < 1024) setIsOpen(false)
  }, [isLoading])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!driveUrl.trim() || !pages.trim()) return
    onSubmit(driveUrl.trim(), pages.trim())
  }

  return (
    <div className="card p-5">
      {/* Accordéon mobile */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-base font-semibold"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Nouvelle sélection
        </h2>
        <button
          className="lg:hidden text-xs px-2 py-1 rounded border"
          style={{ borderColor: 'var(--border)', color: 'var(--ink-soft)' }}
          onClick={() => setIsOpen(o => !o)}
          aria-expanded={isOpen}
          aria-controls="selection-form-body"
        >
          {isOpen ? 'Réduire' : 'Modifier la sélection'}
        </button>
      </div>

      <div id="selection-form-body" className={isOpen ? '' : 'hidden lg:block'}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label
              htmlFor="drive-url"
              className="block text-xs font-medium mb-1.5"
              style={{ color: 'var(--ink-soft)' }}
            >
              Lien Google Drive du PDF
            </label>
            <input
              id="drive-url"
              type="url"
              value={driveUrl}
              onChange={e => setDriveUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              required
              aria-required="true"
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                color: 'var(--ink)',
              }}
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="pages"
              className="block text-xs font-medium mb-1.5"
              style={{ color: 'var(--ink-soft)' }}
            >
              Pages (ex : 42, 45-47)
            </label>
            <input
              id="pages"
              type="text"
              value={pages}
              onChange={e => setPages(e.target.value)}
              placeholder="42, 45-47"
              required
              aria-required="true"
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                color: 'var(--ink)',
              }}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--ink-soft)' }}>
              Sélection multiple — virgules ou plages (ex : 42-47).
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !driveUrl.trim() || !pages.trim()}
            aria-busy={isLoading}
            aria-disabled={isLoading}
            className="w-full rounded-lg py-2.5 text-sm font-semibold transition-opacity"
            style={{
              background: 'var(--teal)',
              color: 'var(--cream)',
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Traitement en cours…' : 'Traiter les pages'}
          </button>
        </form>

        {isLoading && <ProgressSteps currentStep={step} />}

        <p className="text-xs mt-4 leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          Webhook n8n déclenché avec le lien Drive et les pages choisies.
        </p>
      </div>
    </div>
  )
}
