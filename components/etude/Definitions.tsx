import type { BookDefinition } from '@/lib/types'

interface DefinitionsProps {
  definitions: BookDefinition[]
}

export function Definitions({ definitions }: DefinitionsProps) {
  if (definitions.length === 0) return null

  return (
    <div className="card p-6">
      <h2
        className="text-base font-semibold manuscript-margin mb-1"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Définitions
      </h2>
      <p className="text-xs mb-4" style={{ color: 'var(--ink-soft)' }}>
        Notions et termes expliqués par l&apos;auteur dans cette page.
      </p>
      <ul className="space-y-4">
        {definitions.map((d, i) => (
          <li
            key={i}
            className="pl-3 border-l-2"
            style={{ borderColor: 'var(--gold)' }}
          >
            <p className="flex items-baseline gap-2 flex-wrap">
              {/* terme_ar en RTL localisé sur le span uniquement */}
              <span
                dir="rtl"
                className="text-lg"
                style={{ fontFamily: 'var(--font-arabic)' }}
              >
                {d.terme_ar}
              </span>
              <span className="font-semibold text-sm">{d.terme_fr}</span>
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--ink-soft)' }}>{d.def}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
