import { NextRequest, NextResponse } from 'next/server'
import type { ProcessRequest, ProcessResponse, ProcessError } from '@/lib/types'

export async function POST(req: NextRequest): Promise<NextResponse<ProcessResponse | ProcessError>> {
  const webhookUrl = process.env.N8N_WEBHOOK_PROCESS_URL
  if (!webhookUrl) {
    return NextResponse.json({ error: 'Webhook non configuré', code: 'CONFIG_ERROR' }, { status: 500 })
  }

  const contentType = req.headers.get('content-type') ?? ''

  try {
    let n8nRes: Response

    if (contentType.includes('multipart/form-data')) {
      // Fichier local — forward multipart vers n8n
      const formData = await req.formData()
      const file = formData.get('file')
      const pages = formData.get('pages')

      if (!file || !pages) {
        return NextResponse.json({ error: 'Fichier et pages sont requis', code: 'BAD_REQUEST' }, { status: 400 })
      }

      const n8nForm = new FormData()
      n8nForm.append('file', file)
      n8nForm.append('pages', pages as string)
      n8nRes = await fetch(webhookUrl, { method: 'POST', body: n8nForm })
    } else {
      // Lien Drive — forward JSON vers n8n
      const body = await req.json() as Partial<ProcessRequest>

      if (!body.driveUrl || !body.pages) {
        return NextResponse.json({ error: 'driveUrl et pages sont requis', code: 'BAD_REQUEST' }, { status: 400 })
      }

      n8nRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driveUrl: body.driveUrl, pages: body.pages } satisfies ProcessRequest),
      })
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
