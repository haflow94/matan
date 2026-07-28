interface FrenchTranslationProps {
  traduction: string
}

export function FrenchTranslation({ traduction }: FrenchTranslationProps) {
  const blocks = parseMarkdown(traduction)

  return (
    <div className="card p-6">
      <h2
        className="text-base font-semibold manuscript-margin mb-4"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Traduction française
      </h2>
      {/* dir="ltr" explicite pour éviter tout héritage RTL parent */}
      <div
        dir="ltr"
        className="space-y-3 text-[15px] leading-relaxed"
        style={{ color: 'var(--ink-soft)' }}
      >
        {blocks.map((block, i) => {
          if (block.type === 'h1') {
            return (
              <h3 key={i} className="font-bold text-base pt-2" style={{ color: 'var(--ink)' }}>
                {block.text}
              </h3>
            )
          }
          if (block.type === 'h2') {
            return (
              <h3 key={i} className="font-semibold text-[15px] pt-1" style={{ color: 'var(--ink)' }}>
                {block.text}
              </h3>
            )
          }
          return <p key={i}>{block.text}</p>
        })}
      </div>
    </div>
  )
}

type Block = { type: 'h1' | 'h2' | 'p'; text: string }

function parseMarkdown(text: string): Block[] {
  return text
    .split('\n')
    .map(line => line.trimEnd())
    .filter(line => line.length > 0)
    .map(line => {
      if (line.startsWith('# '))  return { type: 'h1' as const, text: line.slice(2).trim() }
      if (line.startsWith('## ')) return { type: 'h2' as const, text: line.slice(3).trim() }
      return { type: 'p' as const, text: line }
    })
}
