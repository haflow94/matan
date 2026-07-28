import { render, screen } from '@testing-library/react'
import { ChapterSummary } from '@/components/chapitre/ChapterSummary'
import type { ChapterSummaryResponse } from '@/lib/types'

// Tests pour ChapterSummary

test('affiche les résumés arabe et français', () => {
  const data: ChapterSummaryResponse = {
    resumeArabe: 'الْحَمْدُ لِلَّهِ',
    resumeFrancais: 'Gloire à Allah',
    refs: []
  }

  render(<ChapterSummary data={data} />)

  expect(screen.getByText(/الْحَمْدُ لِلَّهِ/i)).toBeInTheDocument()
  expect(screen.getByText(/Gloire à Allah/i)).toBeInTheDocument()
})

test('les boutons de copie sont présents', () => {
  const data: ChapterSummaryResponse = {
    resumeArabe: 'الْحَمْدُ لِلَّهِ',
    resumeFrancais: 'Gloire à Allah',
    refs: []
  }

  render(<ChapterSummary data={data} />)

  expect(screen.getByRole('button', { name: /copier/i })).toHaveLength(2)
})

test('les textes arabes ont dir="rtl"', () => {
  const data: ChapterSummaryResponse = {
    resumeArabe: 'الْحَمْدُ لِلَّهِ',
    resumeFrancais: 'Gloire à Allah',
    refs: []
  }

  render(<ChapterSummary data={data} />)

  const arabicText = screen.getByText(/الْحَمْدُ لِلَّهِ/i)
  expect(arabicText).toHaveAttribute('dir', 'rtl')
})
