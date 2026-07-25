interface ReferencesProps {
  refs: string[]
}

export function References({ refs }: ReferencesProps) {
  if (refs.length === 0) return null

  return (
    <div className="card p-6">
      <h2
        className="text-base font-semibold manuscript-margin mb-4"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Versets &amp; hadiths cités
      </h2>
      <ul className="space-y-2">
        {refs.map((ref, i) => (
          <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--ink-soft)' }}>
            <span style={{ color: 'var(--gold)' }} aria-hidden="true">•</span>
            {ref}
          </li>
        ))}
      </ul>
    </div>
  )
}
