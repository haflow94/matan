'use client'
// Tableau de vocabulaire arabe avec définitions expandables et badge Google Drive
import { useState } from 'react'
import type { VocabEntry } from '@/lib/types'

interface VocabTableProps {
  vocabulaire: VocabEntry[]
  sheetUrl: string
}

// Cellule définition avec bouton expand/collapse accessible
function DefinitionCell({ definition }: { definition: string }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <td className="py-2" style={{ color: 'var(--ink-soft)' }}>
      <span className={expanded ? '' : 'line-clamp-2'}>{definition}</span>
      <button
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        aria-label={expanded ? 'Réduire la définition' : 'Afficher la définition complète'}
        className="mt-1 block text-xs underline"
        style={{ color: 'var(--teal)' }}
      >
        {expanded ? 'Réduire' : 'Voir plus'}
      </button>
    </td>
  )
}

// Tableau principal — badge Drive conditionnel, mots arabes en RTL
export function VocabTable({ vocabulaire, sheetUrl }: VocabTableProps) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2
          className="text-base font-semibold manuscript-margin"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Vocabulaire important
        </h2>
        {sheetUrl && (
          <div className="flex items-center gap-2">
            <span
              role="status"
              aria-live="polite"
              className="badge-source text-xs px-2 py-1 rounded-full"
            >
              Enregistré dans Drive ✓
            </span>
            <a
              href={sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline"
              style={{ color: 'var(--gold)' }}
            >
              Ouvrir le Google Sheet
            </a>
          </div>
        )}
      </div>
      <p className="text-xs mb-3" style={{ color: 'var(--ink-soft)' }}>
        Mots fréquents et complexes — vocabulaire courant (Allah, Bismillah…) exclu.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr
              className="text-left border-b border-gray-300 text-gray-600"
            >
              <th className="py-2 pr-3 font-medium">Page</th>
              <th className="py-2 pr-3 font-medium">Arabe</th>
              <th className="py-2 pr-3 font-medium">Traduction</th>
              <th className="py-2 font-medium">Définition</th>
            </tr>
          </thead>
          <tbody>
            {vocabulaire.map((row, i) => (
              <tr
                key={i}
                className="border-b last:border-0 border-gray-300"
              >
                {/* Numéro de page */}
                <td className="py-2 pr-3" style={{ color: 'var(--ink-soft)' }}>{row.page}</td>
                {/* Mot arabe — direction RTL localisée sur la cellule */}
                <td
                  className="py-2 pr-3 text-lg"
                  dir="rtl"
                  className="py-2 pr-3 text-lg font-arabic"
                >
                  {row.mot}
                </td>
                {/* Traduction française */}
                <td className="py-2 pr-3">{row.traduction}</td>
                {/* Définition expandable */}
                <DefinitionCell definition={row.definition} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
