import { render, screen } from '@testing-library/react'
import { ChapterRefs } from '@/components/chapitre/ChapterRefs'
import type { ChapterRef } from '@/lib/types'

// Tests pour ChapterRefs

test('affiche les références avec contexte', () => {
  const refs: ChapterRef[] = [
    { ref: 'Quran 2:255', contexte: 'Contexte du verset' },
    { ref: 'Sahih al-Bukhari 123', contexte: 'Contexte du hadith' }
  ]

  render(<ChapterRefs refs={refs} />)

  expect(screen.getByText(/Quran 2:255/i)).toBeInTheDocument()
  expect(screen.getByText(/Contexte du verset/i)).toBeInTheDocument()
  expect(screen.getByText(/Sahih al-Bukhari 123/i)).toBeInTheDocument()
  expect(screen.getByText(/Contexte du hadith/i)).toBeInTheDocument()
})

test('masque le composant si aucune référence', () => {
  render(<ChapterRefs refs={[]} />)
  expect(screen.queryByRole('heading', { name: /versets/i })).not.toBeInTheDocument()
})
