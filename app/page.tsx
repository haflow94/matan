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

  async function handleProcess(input: { driveUrl?: string; file?: File; pages: string }) {
    if (input.file) {
      await processHook.process({ file: input.file, pages: input.pages })
    } else {
      await processHook.process({ driveUrl: input.driveUrl!, pages: input.pages })
    }
    if (processHook.error) {
      showToast(processHook.error, 'error')
    }
  }

  async function handleLoadChapter(driveUrl: string, titre: string) {
    await chapterHook.load({ driveUrl, chapitreTitre: titre })
    if (chapterHook.error) {
      showToast(chapterHook.error, 'error')
    }
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
            {processHook.data && (
              <>
                <ArabicText mots={processHook.data.mots} />
                <AudioPlayer
                  src={processHook.data.audioArabeUrl}
                  label="Lecture audio — texte arabe"
                />
                <Definitions definitions={processHook.data.definitions} />
                <FrenchTranslation traduction={processHook.data.traduction} />
                <AudioPlayer
                  src={processHook.data.audioTraductionUrl}
                  label="Lecture audio — traduction (pages annoncées)"
                />
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
                  Saisissez un lien Drive et des pages pour commencer.
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
