'use client'
import { useState, useEffect } from 'react'
import { ProgressSteps, STEPS } from './ProgressSteps'

interface SelectionFormProps {
  onSubmit: (input: { file: File; pages: string }) => void
  isLoading: boolean
}

export function SelectionForm({ onSubmit, isLoading }: SelectionFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [pages, setPages] = useState('')
  const [step, setStep] = useState(0)
  const [isOpen, setIsOpen] = useState(true)

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
    if (window.innerWidth < 1024) setIsOpen(false)
  }, [isLoading])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !pages.trim()) return
    onSubmit({ file, pages: pages.trim() })
  }

  const canSubmit = Boolean(file) && Boolean(pages.trim())

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
          {/* Fichier PDF local */}
          <div className="mb-4">
            <label
              htmlFor="pdf-file"
              className="block text-xs font-medium mb-1.5"
              style={{ color: 'var(--ink-soft)' }}
            >
              Fichier PDF
            </label>
            <input
              id="pdf-file"
              type="file"
              accept=".pdf,application/pdf"
              required
              aria-required="true"
              onChange={e => setFile(e.target.files?.[0] ?? null)}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{
                background: 'var(--surface-2)',
                border: `1px solid ${file ? 'var(--teal)' : 'var(--border)'}`,
                color: 'var(--ink)',
              }}
            />
            {file && (
              <p className="text-xs mt-1" style={{ color: 'var(--teal)' }}>
                {file.name} ({(file.size / 1024 / 1024).toFixed(1)} Mo)
              </p>
            )}
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
            disabled={isLoading || !canSubmit}
            aria-busy={isLoading}
            aria-disabled={isLoading || !canSubmit}
            className="w-full rounded-lg py-2.5 text-sm font-semibold transition-opacity"
            style={{
              background: 'var(--teal)',
              color: 'var(--cream)',
              opacity: isLoading || !canSubmit ? 0.6 : 1,
              cursor: isLoading || !canSubmit ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Traitement en cours…' : 'Traiter les pages'}
          </button>
        </form>

        {isLoading && <ProgressSteps currentStep={step} />}

        <p className="text-xs mt-4 leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          Le PDF est envoyé localement et analysé via Mistral OCR.
        </p>
      </div>
    </div>
  )
}
