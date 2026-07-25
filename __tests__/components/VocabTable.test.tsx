// Tests pour VocabTable — tableau de vocabulaire avec expand et badge Drive
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VocabTable } from '@/components/etude/VocabTable'
import type { VocabEntry } from '@/lib/types'

const VOCAB: VocabEntry[] = [
  { page: 44, mot: 'الْمُحْكَمُ', traduction: 'L\'univoque', definition: 'Verset au sens clair — définition longue pour le test expand.' },
]

test('affiche les mots dans le tableau', () => {
  render(<VocabTable vocabulaire={VOCAB} sheetUrl="" />)
  expect(screen.getByText('الْمُحْكَمُ')).toBeInTheDocument()
  expect(screen.getByText('44')).toBeInTheDocument()
})

test('badge Drive masqué si sheetUrl vide', () => {
  render(<VocabTable vocabulaire={VOCAB} sheetUrl="" />)
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
})

test('badge Drive visible si sheetUrl fourni', () => {
  render(<VocabTable vocabulaire={VOCAB} sheetUrl="https://docs.google.com/spreadsheets/d/123" />)
  expect(screen.getByRole('status')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /google sheet/i })).toBeInTheDocument()
})

test('bouton expand met à jour aria-expanded', async () => {
  const user = userEvent.setup()
  render(<VocabTable vocabulaire={VOCAB} sheetUrl="" />)
  const btn = screen.getByRole('button', { name: /afficher la définition/i })
  expect(btn).toHaveAttribute('aria-expanded', 'false')
  await user.click(btn)
  expect(btn).toHaveAttribute('aria-expanded', 'true')
  expect(btn).toHaveAccessibleName(/réduire la définition/i)
})
