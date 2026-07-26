'use client'
import { useState, useEffect } from 'react'
import { ProgressSteps, STEPS } from './ProgressSteps'

type InputMode = 'drive' | 'local'

interface SelectionFormProps {
  onSubmit: (input: { driveUrl?: string; file?: File; pages: string }) => void
  isLoading: boolean
}

export function SelectionForm({ onSubmit, isLoading }: SelectionFormProps) {
  const [mode, setMode] = useState<InputMode>('drive')
  const [driveUrl, setDriveUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
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
    if (window.innerWidth < 1024) setIsOpen(false)
  }, [isLoading])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!pages.trim()) return
    if (mode === 'drive') {
      if (!driveUrl.trim()) return
      onSubmit({ driveUrl: driveUrl.trim(), pages: pages.trim() })
    } else {
      if (!file) return
      onSubmit({ file, pages: pages.trim() })
    }
  }

  const canSubmit = Boolean(pages.trim()) && (mode === 'drive' ? Boolean(driveUrl.trim()) : file !== null)

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
        {/* Toggle Drive / Local */}
        <div
          className="flex rounded-lg mb-4 p-0.5"
          role="group"
          aria-label="Mode de saisie du PDF"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
        >
          {(['drive', 'local'] as InputMode[]).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className="flex-1 text-xs py-1.5 rounded-md transition-colors font-medium"
              style={{
                background: mode === m ? 'var(--teal)' : 'transparent',
                color: mode === m ? 'var(--cream)' : 'var(--ink-soft)',
              }}
            >
              {m === 'drive' ? '🔗 Lien Drive' : '📁 Fichier local'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Mode Drive — URL */}
          {mode === 'drive' && (
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
          )}

          {/* Mode Local — sélecteur de fichier */}
          {mode === 'local' && (
            <div className="mb-4">
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: 'var(--ink-soft)' }}
              >
                Fichier PDF local
              </label>
              <label
                htmlFor="pdf-file"
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm cursor-pointer"
                style={{
                  background: 'var(--surface-2)',
                  border: `1px solid ${file ? 'var(--teal)' : 'var(--border)'}`,
                  color: file ? 'var(--ink)' : 'var(--ink-soft)',
                }}
              >
                <span className="truncate">{file ? file.name : 'Choisir un fichier PDF…'}</span>
                <input
                  id="pdf-file"
                  type="file"
                  accept=".pdf,application/pdf"
                  className="sr-only"
                  onChange={e => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
              {file && (
                <p className="text-xs mt-1" style={{ color: 'var(--ink-soft)' }}>
                  {(file.size / 1024 / 1024).toFixed(1)} Mo
                </p>
              )}
            </div>
          )}

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
          {mode === 'drive'
            ? 'Webhook n8n déclenché avec le lien Drive et les pages choisies.'
            : 'Le fichier PDF est envoyé directement au workflow n8n.'}
        </p>
      </div>
    </div>
  )
}
