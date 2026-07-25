import { render, screen } from '@testing-library/react'
import { AudioPlayer } from '@/components/ui/AudioPlayer'

test('affiche l\'aria-label passé en prop', () => {
  render(<AudioPlayer src="https://example.com/audio.mp3" label="Lecteur audio — texte arabe" />)
  expect(screen.getByRole('region', { name: 'Lecteur audio — texte arabe' })).toBeInTheDocument()
})

test('la barre de progression est un input type range', () => {
  render(<AudioPlayer src="https://example.com/audio.mp3" label="Lecteur audio — texte arabe" />)
  const range = screen.getByRole('slider')
  expect(range).toHaveAttribute('type', 'range')
  expect(range).toHaveAttribute('aria-valuemin', '0')
})

test('les boutons ±10s sont présents et accessibles', () => {
  render(<AudioPlayer src="https://example.com/audio.mp3" label="Lecteur audio — texte arabe" />)
  expect(screen.getByRole('button', { name: /−10/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /\+10/i })).toBeInTheDocument()
})
