// Copie du texte dans le presse-papier, retourne true si succès
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

// Génère la clé localStorage pour le cache des résumés de chapitre
export function chapterCacheKey(driveUrl: string, titre: string): string {
  return `chapter:${driveUrl}:${titre}`
}

// Formate mm:ss depuis un nombre de secondes
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
