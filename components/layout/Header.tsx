'use client'
import { ThemeToggleButton } from './ThemeProvider'

// Types des onglets disponibles
type Tab = 'pages' | 'chapitre'

interface HeaderProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

// Définition des onglets de l'application
const TABS: { id: Tab; label: string }[] = [
  { id: 'pages', label: 'Étude par page' },
  { id: 'chapitre', label: 'Résumé de chapitre' },
]

export function Header({ activeTab, onTabChange }: HeaderProps) {
  // Gestion de la navigation au clavier (pattern roving tabindex)
  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === 'ArrowRight') {
      const next = TABS[(index + 1) % TABS.length]
      onTabChange(next.id)
      document.getElementById(`tab-${next.id}`)?.focus()
    }
    if (e.key === 'ArrowLeft') {
      const prev = TABS[(index - 1 + TABS.length) % TABS.length]
      onTabChange(prev.id)
      document.getElementById(`tab-${prev.id}`)?.focus()
    }
  }

  return (
    <header style={{ background: 'var(--teal-deep)', borderBottom: '3px solid var(--gold)' }}>
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
        {/* Logo et titre */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-md flex items-center justify-center"
            style={{ background: 'var(--gold)' }}
          >
            <span
              className="text-lg"
              style={{ fontFamily: 'var(--font-arabic)', color: 'var(--teal-deep)' }}
            >
              م
            </span>
          </div>
          <div>
            <h1
              className="text-lg font-semibold leading-none"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)' }}
            >
              Matan
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--gold-soft)' }}>
              Analyse de textes arabes classiques
            </p>
          </div>
        </div>
        {/* Bouton bascule de thème */}
        <ThemeToggleButton />
      </div>

      {/* Onglets — pattern ARIA tabs complet avec roving tabindex */}
      <div className="max-w-7xl mx-auto px-5" role="tablist" aria-label="Sections de l'application">
        {TABS.map((tab, i) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="py-2.5 mr-6 text-sm border-b-2 transition-colors"
            style={{
              borderColor: activeTab === tab.id ? 'var(--gold)' : 'transparent',
              color: activeTab === tab.id ? 'var(--gold)' : 'var(--cream)',
              opacity: activeTab === tab.id ? 1 : 0.75,
              fontWeight: activeTab === tab.id ? 600 : 400,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  )
}
