import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { text, voice = 'alloy' } = await req.json()

  if (!text?.trim()) {
    return NextResponse.json({ error: 'Texte manquant' }, { status: 400 })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY non configuré dans .env.local' },
      { status: 500 }
    )
  }

  try {
    const res = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text.substring(0, 4096),
        voice,
        response_format: 'mp3',
      }),
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `Erreur OpenAI TTS: ${res.status}` },
        { status: res.status }
      )
    }

    const buffer = await res.arrayBuffer()
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(buffer.byteLength),
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Impossible de joindre OpenAI TTS' },
      { status: 503 }
    )
  }
}
