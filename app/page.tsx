'use client'
import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { SelectionForm } from '@/components/etude/SelectionForm'
import { ArabicText } from '@/components/etude/ArabicText'
import { AudioPlayer } from '@/components/ui/AudioPlayer'
import { Definitions } from '@/components/etude/Definitions'
import { FrenchTranslation } from '@/components/etude/FrenchTranslation'
import { VocabTable } from '@/components/etude/VocabTable'
import { References } from '@/components/etude/References'
import { ChapterSelector } from '@/components/chapitre/ChapterSelector'
import { ChapterSummary } from '@/components/chapitre/ChapterSummary'
import { ChapterRefs } from '@/components/chapitre/ChapterRefs'
import { Toast, useToast } from '@/components/ui/Toast'
import { useProcess } from '@/hooks/useProcess'
import { useChapterSummary } from '@/hooks/useChapterSummary'

type Tab = 'pages' | 'chapitre'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('pages')
  const { toast, showToast, closeToast } = useToast()
  const processHook = useProcess()
  const chapterHook = useChapterSummary()

  const [audioArUrl, setAudioArUrl] = useState('')
  const [audioFrUrl, setAudioFrUrl] = useState('')
  const [audioArLoading, setAudioArLoading] = useState(false)
  const [audioFrLoading, setAudioFrLoading] = useState(false)

  async function handleProcess(input: { file: File; pages: string }) {
    // Libérer les blobs audio de l'analyse précédente
    if (audioArUrl) URL.revokeObjectURL(audioArUrl)
    if (audioFrUrl) URL.revokeObjectURL(audioFrUrl)
    setAudioArUrl('')
    setAudioFrUrl('')
    const err = await processHook.process({ file: input.file, pages: input.pages })
    if (err) showToast(err, 'error')
  }

  async function genererAudio(
    text: string,
    voice: string,
    setUrl: (u: string) => void,
    setLoading: (b: boolean) => void,
  ) {
    setLoading(true)
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice }),
      })
      if (!res.ok) throw new Error('TTS failed')
      const blob = await res.blob()
      setUrl(URL.createObjectURL(blob))
    } catch {
      showToast('Impossible de générer l\'audio', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleLoadChapter(driveUrl: string, titre: string) {
    const err = await chapterHook.load({ driveUrl, chapitreTitre: titre })
    if (err) showToast(err, 'error')
  }

  return (
    <>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ── Onglet Étude par page ── */}
      <main
        id="panel-pages"
        role="tabpanel"
        aria-labelledby="tab-pages"
        hidden={activeTab !== 'pages'}
        className="max-w-7xl mx-auto px-5 py-8"
      >
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          {/* Sidebar */}
          <aside aria-label="Formulaire de sélection" className="lg:sticky lg:top-6 h-fit">
            <SelectionForm
              onSubmit={handleProcess}
              isLoading={processHook.status === 'loading'}
            />
          </aside>

          {/* Contenu principal */}
          <div className="space-y-6">
            {processHook.status === 'loading' && (
              <div className="card p-12 flex items-center justify-center">
                <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
                  Analyse en cours — cela peut prendre 1 à 2 minutes…
                </p>
              </div>
            )}

            {processHook.data && (
              <>
                <ArabicText
                  texteArabe={processHook.data.texteArabe}
                  mots={processHook.data.mots}
                />
                {audioArUrl ? (
                  <AudioPlayer src={audioArUrl} label="Lecture audio — texte arabe" />
                ) : (
                  <button
                    onClick={() => genererAudio(
                      processHook.data!.texteArabe,
                      'alloy',
                      setAudioArUrl,
                      setAudioArLoading,
                    )}
                    disabled={audioArLoading}
                    className="card p-4 w-full text-left text-sm flex items-center gap-2"
                    style={{ color: 'var(--ink-soft)' }}
                  >
                    {audioArLoading ? '⏳ Génération audio…' : '▶  Écouter le texte arabe'}
                  </button>
                )}
                <Definitions definitions={processHook.data.definitions} />
                <FrenchTranslation traduction={processHook.data.traduction} />
                {audioFrUrl ? (
                  <AudioPlayer src={audioFrUrl} label="Lecture audio — traduction" />
                ) : (
                  <button
                    onClick={() => genererAudio(
                      processHook.data!.traduction,
                      'nova',
                      setAudioFrUrl,
                      setAudioFrLoading,
                    )}
                    disabled={audioFrLoading}
                    className="card p-4 w-full text-left text-sm flex items-center gap-2"
                    style={{ color: 'var(--ink-soft)' }}
                  >
                    {audioFrLoading ? '⏳ Génération audio…' : '▶  Écouter la traduction'}
                  </button>
                )}
                <VocabTable
                  vocabulaire={processHook.data.vocabulaire}
                  sheetUrl={processHook.data.sheetUrl}
                />
                <References refs={processHook.data.refs} />
              </>
            )}

            {/* État vide */}
            {processHook.status === 'idle' && (
              <div
                className="card p-12 flex items-center justify-center"
                aria-label="Aucun contenu chargé"
              >
                <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
                  Choisissez un fichier PDF et des pages pour commencer.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Onglet Résumé de chapitre ── */}
      <main
        id="panel-chapitre"
        role="tabpanel"
        aria-labelledby="tab-chapitre"
        hidden={activeTab !== 'chapitre'}
        className="max-w-5xl mx-auto px-5 py-8 space-y-6"
      >
        <ChapterSelector
          onLoad={handleLoadChapter}
          isLoading={chapterHook.status === 'loading'}
        />
        {chapterHook.data && (
          <>
            <ChapterSummary data={chapterHook.data} />
            <ChapterRefs refs={chapterHook.data.refs} />
          </>
        )}
        {chapterHook.status === 'idle' && (
          <div className="card p-12 flex items-center justify-center">
            <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
              Entrez un lien Drive et un titre de chapitre pour charger le résumé.
            </p>
          </div>
        )}
      </main>

      {/* Toast global */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
    </>
  )
}
