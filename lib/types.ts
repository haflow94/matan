// Contrat complet du webhook n8n — ne pas modifier sans mettre à jour le workflow n8n en miroir

// ── Endpoint 1 : /api/process ─────────────────────────────────────────────

export interface ProcessRequest {
  driveUrl: string   // lien Google Drive du PDF
  pages: string      // ex: "42, 45-47"
}

export interface ArabicWord {
  mot: string        // mot arabe avec tashkeel complet
  def: string        // définition contextuelle
  page: number
}

export interface BookDefinition {
  terme_ar: string
  terme_fr: string
  def: string        // définition donnée par l'auteur dans le texte
}

export interface VocabEntry {
  page: number
  mot: string
  traduction: string
  definition: string
}

export interface ProcessResponse {
  texteArabe: string
  mots: ArabicWord[]
  definitions: BookDefinition[]
  traduction: string
  audioArabeUrl: string
  audioTraductionUrl: string
  vocabulaire: VocabEntry[]
  sheetUrl: string
  refs: unknown[]   // string[] ou [{type, chemin, page}] selon ce que retourne Mistral
  pagesTraitees: string
}

// ── Endpoint 2 : /api/chapter-summary ────────────────────────────────────

export interface ChapterSummaryRequest {
  driveUrl: string
  chapitreTitre: string
}

export interface ChapterRef {
  ref: string
  contexte: string
}

export interface ChapterSummaryResponse {
  titre: string
  resumeArabe: string
  resumeFrancais: string
  refs: ChapterRef[]
}

// ── Erreur commune ────────────────────────────────────────────────────────

export interface ProcessError {
  error: string
  code?: string   // ex: "DRIVE_ACCESS_DENIED" | "WEBHOOK_TIMEOUT"
}
