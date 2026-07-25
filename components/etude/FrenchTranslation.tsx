interface FrenchTranslationProps {
  traduction: string
}

export function FrenchTranslation({ traduction }: FrenchTranslationProps) {
  return (
    <div className="card p-6">
      <h2
        className="text-base font-semibold manuscript-margin mb-4"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Traduction française
      </h2>
      {/* dir="ltr" explicite pour éviter tout héritage RTL parent */}
      <p
        dir="ltr"
        className="text-[15px] leading-relaxed"
        style={{ color: 'var(--ink-soft)' }}
      >
        {traduction}
      </p>
    </div>
  )
}
