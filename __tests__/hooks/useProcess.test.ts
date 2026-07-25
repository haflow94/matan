import { renderHook, act } from '@testing-library/react'
import { useProcess } from '@/hooks/useProcess'

beforeEach(() => {
  global.fetch = jest.fn()
  sessionStorage.clear()
})

afterEach(() => jest.resetAllMocks())

const MOCK_DATA = {
  mots: [{ mot: 'بِسْمِ', def: 'Au nom de', page: 42 }],
  definitions: [],
  traduction: 'Au nom d\'Allah',
  audioArabeUrl: 'https://example.com/arabe.mp3',
  audioTraductionUrl: 'https://example.com/trad.mp3',
  vocabulaire: [],
  sheetUrl: 'https://docs.google.com/spreadsheets/d/123',
  refs: [],
  pagesTraitees: '42',
}

test('état initial correct', () => {
  const { result } = renderHook(() => useProcess())
  expect(result.current.status).toBe('idle')
  expect(result.current.data).toBeNull()
  expect(result.current.error).toBeNull()
})

test('passe en loading puis success', async () => {
  ;(global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => MOCK_DATA,
  })
  const { result } = renderHook(() => useProcess())
  act(() => {
    result.current.process({ driveUrl: 'https://drive.google.com/file/123', pages: '42' })
  })
  expect(result.current.status).toBe('loading')
  await act(async () => {})
  expect(result.current.status).toBe('success')
  expect(result.current.data?.mots[0].mot).toBe('بِسْمِ')
})

test('passe en error si le fetch échoue', async () => {
  ;(global.fetch as jest.Mock).mockResolvedValue({
    ok: false,
    json: async () => ({ error: 'Accès Drive refusé', code: 'DRIVE_ACCESS_DENIED' }),
  })
  const { result } = renderHook(() => useProcess())
  await act(async () => {
    result.current.process({ driveUrl: 'https://drive.google.com/file/123', pages: '42' })
  })
  expect(result.current.status).toBe('error')
  expect(result.current.error).toBe('Accès Drive refusé')
})

test('persiste driveUrl dans sessionStorage', async () => {
  ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => MOCK_DATA })
  const { result } = renderHook(() => useProcess())
  await act(async () => {
    result.current.process({ driveUrl: 'https://drive.google.com/file/123', pages: '42' })
  })
  expect(sessionStorage.getItem('lastDriveUrl')).toBe('https://drive.google.com/file/123')
})
