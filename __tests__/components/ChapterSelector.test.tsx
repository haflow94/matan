import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChapterSelector } from '@/components/chapitre/ChapterSelector'

// Tests pour ChapterSelector

test('affiche les champs de formulaire et le bouton de soumission', () => {
  render(<ChapterSelector onLoad={() => {}} isLoading={false} />)
  expect(screen.getByLabelText(/lien google drive/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/titre du chapitre/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /charger le résumé/i })).toBeInTheDocument()
})

test('bouton de soumission est désactivé si les champs sont vides', () => {
  render(<ChapterSelector onLoad={() => {}} isLoading={false} />)
  const submitBtn = screen.getByRole('button', { name: /charger le résumé/i })
  expect(submitBtn).toBeDisabled()
})

test('appelle onLoad avec les valeurs du formulaire lors de la soumission', async () => {
  const user = userEvent.setup()
  const onLoad = jest.fn()
  render(<ChapterSelector onLoad={onLoad} isLoading={false} />)

  await user.type(screen.getByLabelText(/lien google drive/i), 'https://drive.google.com/file/d/123')
  await user.type(screen.getByLabelText(/titre du chapitre/i), 'Chapitre 1')
  await user.click(screen.getByRole('button', { name: /charger le résumé/i }))

  expect(onLoad).toHaveBeenCalledWith('https://drive.google.com/file/d/123', 'Chapitre 1')
})

test('affiche l\'historique des chapitres', () => {
  const history = ['https://drive.google.com/file/d/123::Chapitre 1', 'https://drive.google.com/file/d/456::Chapitre 2']
  localStorage.setItem('chapterHistory', JSON.stringify(history))

  render(<ChapterSelector onLoad={() => {}} isLoading={false} />)

  expect(screen.getByText(/chapitre 1/i)).toBeInTheDocument()
  expect(screen.getByText(/chapitre 2/i)).toBeInTheDocument()
})

test('charge un chapitre depuis l\'historique', async () => {
  const user = userEvent.setup()
  const onLoad = jest.fn()
  const history = ['https://drive.google.com/file/d/123::Chapitre 1']
  localStorage.setItem('chapterHistory', JSON.stringify(history))

  render(<ChapterSelector onLoad={onLoad} isLoading={false} />)
  await user.click(screen.getByText(/chapitre 1/i))

  expect(onLoad).toHaveBeenCalledWith('https://drive.google.com/file/d/123', 'Chapitre 1')
})
