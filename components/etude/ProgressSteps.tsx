'use client'

const STEPS = [
  'Extraction du texte...',
  'Voyellation & vérification...',
  'Traduction contextualisée...',
  'Génération audio (arabe + traduction)...',
  'Enregistrement du vocabulaire dans Drive...',
]

interface ProgressStepsProps {
  currentStep: number  // 0-indexed, -1 = terminé
}

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  return (
    <div role="status" aria-live="polite" aria-label="Progression du traitement">
      <ul className="space-y-2 mt-3">
        {STEPS.map((step, i) => {
          const done = i < currentStep
          const active = i === currentStep
          return (
            <li
              key={step}
              className={`flex items-center gap-2 text-sm animate-step-in`}
              style={{
                color: active ? 'var(--teal)' : done ? 'var(--ink-soft)' : 'var(--border)',
                fontWeight: active ? 600 : 400,
              }}
            >
              <span className="w-4 h-4 flex items-center justify-center shrink-0 text-xs">
                {done ? '✓' : active ? (
                  <span
                    className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin block"
                    style={{ borderColor: 'var(--teal)', borderTopColor: 'transparent' }}
                    aria-hidden="true"
                  />
                ) : '○'}
              </span>
              <span>{step}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export { STEPS }
