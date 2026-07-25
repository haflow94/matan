import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ArabicText } from '@/components/etude/ArabicText'
import type { ArabicWord } from '@/lib/types'

const MOTS: ArabicWord[] = [
  { mot: 'بِسْمِ', def: 'Au nom de', page: 42 },
  { mot: 'اللَّهِ', def: 'Allah', page: 42 },
]

test('chaque mot est rendu comme un bouton accessible au clavier', () => {
  render(<ArabicText mots={MOTS} />)
  const buttons = screen.getAllByRole('button', { name: /بِسْمِ|اللَّهِ/ })
  expect(buttons).toHaveLength(2)
})

test('le conteneur a dir="rtl"', () => {
  render(<ArabicText mots={MOTS} />)
  const container = screen.getByRole('region', { name: /texte arabe/i })
  expect(container).toHaveAttribute('dir', 'rtl')
})

test('copier le texte déclenche clipboard.writeText', async () => {
  const user = userEvent.setup()
  // JSDOM ne permet pas Object.assign sur navigator.clipboard (read-only)
  const writeText = jest.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    writable: true,
    configurable: true,
  })
  render(<ArabicText mots={MOTS} />)
  const copyBtn = screen.getByRole('button', { name: /copier/i })
  await user.click(copyBtn)
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith('بِسْمِ اللَّهِ')
})
