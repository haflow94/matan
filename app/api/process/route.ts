import { NextRequest, NextResponse } from 'next/server'
import type { ProcessRequest, ProcessResponse, ProcessError } from '@/lib/types'

export async function POST(req: NextRequest): Promise<NextResponse<ProcessResponse | ProcessError>> {
  const body = await req.json() as Partial<ProcessRequest>

  // Validation : les deux champs sont obligatoires
  if (!body.driveUrl || !body.pages) {
    return NextResponse.json(
      { error: 'driveUrl et pages sont requis', code: 'BAD_REQUEST' },
      { status: 400 }
    )
  }

  const webhookUrl = process.env.N8N_WEBHOOK_PROCESS_URL
  if (!webhookUrl) {
    return NextResponse.json(
      { error: 'Webhook non configuré', code: 'CONFIG_ERROR' },
      { status: 500 }
    )
  }

  try {
    // Proxy vers le workflow n8n
    const n8nRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driveUrl: body.driveUrl, pages: body.pages } satisfies ProcessRequest),
    })

    if (!n8nRes.ok) {
      const text = await n8nRes.text()
      return NextResponse.json(
        { error: text || 'Erreur du workflow n8n', code: 'N8N_ERROR' },
        { status: n8nRes.status }
      )
    }

    const data = await n8nRes.json() as ProcessResponse
    return NextResponse.json(data)
  } catch {
    // n8n injoignable ou timeout
    return NextResponse.json(
      { error: 'Impossible de joindre le workflow n8n', code: 'WEBHOOK_TIMEOUT' },
      { status: 503 }
    )
  }
}
