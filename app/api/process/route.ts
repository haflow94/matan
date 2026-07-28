import { NextRequest, NextResponse } from 'next/server'
import type { ProcessResponse, ProcessError } from '@/lib/types'

export async function POST(req: NextRequest): Promise<NextResponse<ProcessResponse | ProcessError>> {
  const webhookUrl = process.env.N8N_WEBHOOK_PROCESS_URL
  if (!webhookUrl) {
    return NextResponse.json({ error: 'Webhook non configuré', code: 'CONFIG_ERROR' }, { status: 500 })
  }

  const contentType = req.headers.get('content-type') ?? ''

  try {
    let n8nRes: Response

    if (contentType.includes('multipart/form-data')) {
      // Fichier PDF local → transférer en multipart vers n8n
      const formData = await req.formData()
      const file = formData.get('file') as File | null
      const pages = formData.get('pages') as string | null

      if (!file || !pages) {
        return NextResponse.json({ error: 'file et pages sont requis', code: 'BAD_REQUEST' }, { status: 400 })
      }

      const n8nForm = new FormData()
      n8nForm.append('file', file, file.name)
      n8nForm.append('pages', pages)

      n8nRes = await fetch(webhookUrl, { method: 'POST', body: n8nForm })
    } else {
      return NextResponse.json(
        { error: 'Format non supporté — envoyez multipart/form-data avec file et pages', code: 'BAD_REQUEST' },
        { status: 400 }
      )
    }

    if (!n8nRes.ok) {
      const text = await n8nRes.text()
      return NextResponse.json({ error: text || 'Erreur du workflow n8n', code: 'N8N_ERROR' }, { status: n8nRes.status })
    }

    const data = await n8nRes.json() as ProcessResponse
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Impossible de joindre le workflow n8n', code: 'WEBHOOK_TIMEOUT' }, { status: 503 })
  }
}
