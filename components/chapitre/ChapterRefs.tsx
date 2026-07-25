import type { ChapterRef } from '@/lib/types'

interface ChapterRefsProps {
  refs: ChapterRef[]
}

export function ChapterRefs({ refs }: ChapterRefsProps) {
  if (refs.length === 0) return null

  return (
    <div className="card p-6">
      <h2
        className="text-base font-semibold manuscript-margin mb-4"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Versets &amp; hadiths du chapitre — avec contexte
      </h2>
      <ul className="space-y-4">
        {refs.map((r, i) => (
          <li key={i} className="pl-3 border-l-2" style={{ borderColor: 'var(--gold)' }}>
            <p className="text-sm font-semibold">{r.ref}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--ink-soft)' }}>{r.contexte}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
