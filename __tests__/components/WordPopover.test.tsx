import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WordPopover } from '@/components/etude/WordPopover'

test('affiche la définition passée en prop', () => {
  render(
    <WordPopover definition="Au nom de" x={100} y={100} onClose={() => {}} />
  )
  expect(screen.getByRole('tooltip')).toHaveTextContent('Au nom de')
})

test('Escape appelle onClose', async () => {
  const user = userEvent.setup()
  const onClose = jest.fn()
  render(<WordPopover definition="Au nom de" x={100} y={100} onClose={onClose} />)
  await user.keyboard('{Escape}')
  expect(onClose).toHaveBeenCalled()
})
