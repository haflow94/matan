import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from '@/components/layout/Header'

test('affiche les deux onglets avec pattern ARIA tabs complet', () => {
  render(<Header activeTab="pages" onTabChange={() => {}} />)
  const tablist = screen.getByRole('tablist')
  expect(tablist).toBeInTheDocument()
  const tabs = screen.getAllByRole('tab')
  expect(tabs).toHaveLength(2)
  expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
  expect(tabs[1]).toHaveAttribute('aria-selected', 'false')
  expect(tabs[0]).toHaveAttribute('tabindex', '0')
  expect(tabs[1]).toHaveAttribute('tabindex', '-1')
})

test('flèche droite change d\'onglet et déplace le focus', async () => {
  const user = userEvent.setup()
  const onTabChange = jest.fn()
  render(<Header activeTab="pages" onTabChange={onTabChange} />)
  const firstTab = screen.getAllByRole('tab')[0]
  firstTab.focus()
  await user.keyboard('{ArrowRight}')
  expect(onTabChange).toHaveBeenCalledWith('chapitre')
})

test('flèche gauche depuis premier onglet va au dernier', async () => {
  const user = userEvent.setup()
  const onTabChange = jest.fn()
  render(<Header activeTab="pages" onTabChange={onTabChange} />)
  const firstTab = screen.getAllByRole('tab')[0]
  firstTab.focus()
  await user.keyboard('{ArrowLeft}')
  expect(onTabChange).toHaveBeenCalledWith('chapitre')
})
