import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest): Promise<NextResponse> {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Paramètre id manquant' }, { status: 400 })
  }

  const n8nBase = process.env.N8N_BASE_URL
  const apiKey = process.env.N8N_API_KEY

  if (!n8nBase || !apiKey) {
    return NextResponse.json({ error: 'Configuration audio manquante (N8N_BASE_URL / N8N_API_KEY)' }, { status: 500 })
  }

  try {
    const res = await fetch(
      `${n8nBase}/api/v1/binary-data?id=${encodeURIComponent(id)}&action=download`,
      { headers: { 'X-N8N-API-KEY': apiKey } }
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'Fichier audio introuvable sur n8n' }, { status: res.status })
    }

    const buffer = await res.arrayBuffer()
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(buffer.byteLength),
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Impossible de joindre n8n pour l\'audio' }, { status: 503 })
  }
}
