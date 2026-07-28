interface ReferencesProps {
  refs: unknown[]
}

function refToString(ref: unknown): string {
  if (typeof ref === 'string') return ref
  if (ref && typeof ref === 'object') {
    const r = ref as Record<string, unknown>
    const parts = [r.type, r.chemin, r.page ? `p. ${r.page}` : ''].filter(Boolean)
    return parts.join(' — ')
  }
  return String(ref)
}

export function References({ refs }: ReferencesProps) {
  if (!refs || refs.length === 0) return null

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
            {refToString(ref)}
          </li>
        ))}
      </ul>
    </div>
  )
}
