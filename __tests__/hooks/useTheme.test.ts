import { renderHook, act } from '@testing-library/react'
import { useTheme } from '@/hooks/useTheme'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

test('initialise en mode clair par défaut', () => {
  const { result } = renderHook(() => useTheme())
  expect(result.current.isDark).toBe(false)
  expect(document.documentElement.classList.contains('dark')).toBe(false)
})

test('toggle passe en mode sombre et persiste', () => {
  const { result } = renderHook(() => useTheme())
  act(() => result.current.toggle())
  expect(result.current.isDark).toBe(true)
  expect(document.documentElement.classList.contains('dark')).toBe(true)
  expect(localStorage.getItem('theme')).toBe('dark')
})

test('relit le thème depuis localStorage au montage', () => {
  localStorage.setItem('theme', 'dark')
  const { result } = renderHook(() => useTheme())
  expect(result.current.isDark).toBe(true)
  expect(document.documentElement.classList.contains('dark')).toBe(true)
})
