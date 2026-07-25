/**
 * @jest-environment node
 */
import { POST } from '@/app/api/process/route'
import { NextRequest } from 'next/server'

const MOCK_RESPONSE = {
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

beforeEach(() => {
  process.env.N8N_WEBHOOK_PROCESS_URL = 'https://n8n.example.com/webhook/process'
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => MOCK_RESPONSE,
  } as Response)
})

afterEach(() => jest.resetAllMocks())

test('proxifie la requête vers n8n et renvoie la réponse', async () => {
  const req = new NextRequest('http://localhost:3000/api/process', {
    method: 'POST',
    body: JSON.stringify({ driveUrl: 'https://drive.google.com/file/123', pages: '42' }),
  })
  const res = await POST(req)
  expect(res.status).toBe(200)
  const data = await res.json()
  expect(data.mots[0].mot).toBe('بِسْمِ')
  expect(global.fetch).toHaveBeenCalledWith(
    'https://n8n.example.com/webhook/process',
    expect.objectContaining({ method: 'POST' })
  )
})

test('renvoie 503 si n8n est injoignable', async () => {
  ;(global.fetch as jest.Mock).mockRejectedValue(new Error('network'))
  const req = new NextRequest('http://localhost:3000/api/process', {
    method: 'POST',
    body: JSON.stringify({ driveUrl: 'https://drive.google.com/file/123', pages: '42' }),
  })
  const res = await POST(req)
  expect(res.status).toBe(503)
  const data = await res.json()
  expect(data.error).toBeTruthy()
  expect(data.code).toBe('WEBHOOK_TIMEOUT')
})

test('renvoie 400 si driveUrl manquant', async () => {
  const req = new NextRequest('http://localhost:3000/api/process', {
    method: 'POST',
    body: JSON.stringify({ pages: '42' }),
  })
  const res = await POST(req)
  expect(res.status).toBe(400)
})
