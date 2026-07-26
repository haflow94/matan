# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commandes

```bash
npm run dev          # serveur de développement
npm run build        # build de production
npm test             # tous les tests Jest
npm test -- --testPathPattern="NomDuFichier"  # un seul fichier de test
npm test -- --watch  # mode watch
npx tsc --noEmit     # vérification TypeScript (ignorer les erreurs dans __tests__/)
```

## Architecture

Application Next.js 16 App Router, personnelle (pas d'auth). Une seule page (`app/page.tsx`) avec deux onglets gérés par état React — pas de routing client.

### Flux de données

```
SelectionForm → useProcess → /api/process → n8n webhook → ProcessResponse
ChapterSelector → useChapterSummary → /api/chapter-summary → n8n webhook → ChapterSummaryResponse
```

Les deux route handlers sont des **proxies purs** : ils cachent les URLs n8n et évitent les problèmes CORS. Les URLs sont dans `.env.local` (`N8N_WEBHOOK_PROCESS_URL`, `N8N_WEBHOOK_CHAPTER_URL`) — jamais `NEXT_PUBLIC_`.

`/api/process` accepte deux formats selon le `Content-Type` :
- `application/json` → `{ driveUrl, pages }` (lien Google Drive)
- `multipart/form-data` → `{ file, pages }` (PDF local uploadé directement)

Les deux endpoints sont **découplés** : `/api/chapter-summary` est indépendant de `/api/process` — le résumé de chapitre n'est pas dans `ProcessResponse`.

### Contrat n8n

Toutes les interfaces sont dans `lib/types.ts`. Ne pas les modifier sans mettre à jour le workflow n8n en miroir.

### Cache

`useChapterSummary` met en cache les résumés dans `localStorage` (clé via `chapterCacheKey()` de `lib/utils.ts`). `useProcess` persiste le dernier `driveUrl` dans `sessionStorage` pour pré-remplir le formulaire.

## Design system

Variables CSS dans `app/globals.css`, exposées à Tailwind v4 via `@theme inline`. Mode sombre via classe `.dark` sur `<html>` (géré par `useTheme`).

Classes utilitaires critiques :
- `.card` — a `overflow:hidden` (nécessaire pour le filet dégradé). **WordPopover doit être `position:fixed`** pour ne pas être clippé.
- `.word-token` — les sélecteurs `:hover` et `:focus-visible` sont **séparés** intentionnellement.
- `.dark .badge-source` — utilise `var(--gold)` et non `var(--gold-soft)` (contraste insuffisant en dark).

**RTL** : `dir="rtl"` posé **uniquement sur l'élément arabe** (`<div>`, `<p>`, `<td>`), jamais sur un conteneur parent, pour ne pas inverser les éléments LTR voisins.

## Polices

Configurées via `next/font/google` dans `app/layout.tsx` avec `variable:`. Disponibles en CSS via `var(--font-fraunces)`, `var(--font-amiri)`, `var(--font-inter)`.

## Tests

Jest + React Testing Library. Tests dans `__tests__/` (miroir de la structure source).

Les tests des route handlers requièrent `/** @jest-environment node */` en docblock (le testEnvironment global est `jsdom`, qui n'expose pas `Request`).
