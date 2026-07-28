import type { Metadata } from 'next'
import { Fraunces, Amiri, Inter } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Matan — Étude de textes arabes',
  description: 'Analyse et vocalisation de textes arabes classiques',
  manifest: '/manifest.webmanifest',
  themeColor: '#186A4C',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Matan',
  },
  icons: {
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${fraunces.variable} ${amiri.variable} ${inter.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
