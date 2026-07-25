// Tests du hook useChapterSummary — cache localStorage + appel API
import { renderHook, act } from '@testing-library/react'
import { useChapterSummary } from '@/hooks/useChapterSummary'

const MOCK_CHAPTER = {
  titre: 'Chapitre 1',
  resumeArabe: 'النص',
  resumeFrancais: 'Résumé',
  refs: [],
}

beforeEach(() => {
  localStorage.clear()
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => MOCK_CHAPTER,
  })
})

afterEach(() => jest.resetAllMocks())

test('état initial idle', () => {
  const { result } = renderHook(() => useChapterSummary())
  expect(result.current.status).toBe('idle')
  expect(result.current.data).toBeNull()
})

test('charge depuis l\'API et met en cache dans localStorage', async () => {
  const { result } = renderHook(() => useChapterSummary())
  await act(async () => {
    result.current.load({ driveUrl: 'https://drive.google.com/file/123', chapitreTitre: 'Chapitre 1' })
  })
  expect(result.current.status).toBe('success')
  expect(result.current.data?.titre).toBe('Chapitre 1')
  const cacheKey = 'chapter:https://drive.google.com/file/123:Chapitre 1'
  expect(localStorage.getItem(cacheKey)).toBeTruthy()
})

test('retourne le cache localStorage sans appel réseau si déjà chargé', async () => {
  const cacheKey = 'chapter:https://drive.google.com/file/123:Chapitre 1'
  localStorage.setItem(cacheKey, JSON.stringify(MOCK_CHAPTER))
  const { result } = renderHook(() => useChapterSummary())
  await act(async () => {
    result.current.load({ driveUrl: 'https://drive.google.com/file/123', chapitreTitre: 'Chapitre 1' })
  })
  expect(global.fetch).not.toHaveBeenCalled()
  expect(result.current.data?.titre).toBe('Chapitre 1')
})
