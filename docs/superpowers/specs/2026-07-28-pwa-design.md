# PWA — Matan

Date : 2026-07-28

## Objectif

Rendre l'application Matan installable sur mobile (Android) et fonctionnelle hors-ligne.

## Stack choisie

- `@ducanh2912/next-pwa` pour la génération automatique du service worker
- `app/manifest.ts` (Next.js App Router natif) pour le manifest
- Icônes PNG générées depuis SVG

## 1. Manifest (`app/manifest.ts`)

```ts
{
  name: 'Matan — Étude de textes arabes',
  short_name: 'Matan',
  description: 'Analyse et vocalisation de textes arabes classiques',
  start_url: '/',
  display: 'standalone',
  background_color: '#F6F1E6',
  theme_color: '#186A4C',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
}
```

## 2. Icônes

- Lettre **م** (meem) en blanc, fond teal `#186A4C`, filet gold `#B8863B` en bas
- Générées en SVG puis exportées en PNG : `public/icon-192.png`, `public/icon-512.png`
- `public/apple-touch-icon.png` (180x180) pour iOS (conservé même sans test iOS)

## 3. Service worker (`@ducanh2912/next-pwa`)

Configuration dans `next.config.ts` :

- **Network First** sur `/api/*` : tente le réseau, fallback cache si hors-ligne
- **Cache First** sur assets statiques (JS, CSS, polices) : chargement instantané

## 4. `app/layout.tsx`

Ajouts dans `<head>` via l'export `metadata` de Next.js :

```ts
themeColor: '#186A4C',
appleWebApp: { capable: true, statusBarStyle: 'default' },
icons: { apple: '/apple-touch-icon.png' },
```

## Fichiers créés / modifiés

| Fichier | Action |
|---|---|
| `app/manifest.ts` | Créé |
| `app/layout.tsx` | Modifié (metadata PWA) |
| `next.config.ts` | Modifié (next-pwa plugin) |
| `public/icon-192.png` | Créé |
| `public/icon-512.png` | Créé |
| `public/apple-touch-icon.png` | Créé |
| `package.json` | Ajout `@ducanh2912/next-pwa` |
