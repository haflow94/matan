/**
 * @jest-environment node
 */
import { POST } from '@/app/api/chapter-summary/route'
import { NextRequest } from 'next/server'

const MOCK_CHAPTER = {
  titre: 'Chapitre 1',
  resumeArabe: 'النص العربي',
  resumeFrancais: 'Résumé en français',
  refs: [{ ref: 'Sourate Al-Fatiha, v.1', contexte: 'Contexte' }],
}

beforeEach(() => {
  process.env.N8N_WEBHOOK_CHAPTER_URL = 'https://n8n.example.com/webhook/chapter'
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => MOCK_CHAPTER,
  } as Response)
})

afterEach(() => jest.resetAllMocks())

test('proxifie vers n8n et renvoie le résumé de chapitre', async () => {
  const req = new NextRequest('http://localhost:3000/api/chapter-summary', {
    method: 'POST',
    body: JSON.stringify({ driveUrl: 'https://drive.google.com/file/123', chapitreTitre: 'Chapitre 1' }),
  })
  const res = await POST(req)
  expect(res.status).toBe(200)
  const data = await res.json()
  expect(data.titre).toBe('Chapitre 1')
})

test('renvoie 400 si chapitreTitre manquant', async () => {
  const req = new NextRequest('http://localhost:3000/api/chapter-summary', {
    method: 'POST',
    body: JSON.stringify({ driveUrl: 'https://drive.google.com/file/123' }),
  })
  const res = await POST(req)
  expect(res.status).toBe(400)
})
