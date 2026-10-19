// app/layout.tsx — ЗАМЕНА текущего файла в imtrtd/brandcultura-landing.
// Что добавлено: metadataBase, canonical, Open Graph, Twitter, robots, иконки (через файлы app/icon.svg,
// app/apple-icon.png, app/favicon.ico), JSON-LD; удалён generator "v0.app"; моно-шрифт без preload.
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Mono, Onest } from 'next/font/google'
import { JsonLd } from '@/components/json-ld'
import { SITE_URL } from '@/lib/site'
import './globals.css'

const onest = Onest({
  subsets: ['latin', 'cyrillic'], // cyrillic нужен для RU-версии
  variable: '--font-onest',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
  preload: false, // моно-шрифт декоративный: не блокируем им первый рендер (-~50 КБ preload)
})

const TITLE = 'brandcultura — Visuelle Identität für Musiker:innen & Labels'
const DESCRIPTION =
  'Agentur für Musiker:innen und Labels: Sound Identity, Cover, Motion, Stage und visuelle Systeme – aus dem Spektrogramm entwickelt. Antwort in 24 Stunden.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: '%s — brandcultura' },
  description: DESCRIPTION,
  applicationName: 'brandcultura',
  alternates: {
    canonical: '/',
    // После запуска /en и /ru (docs/i18n-routing.md):
    // languages: { de: '/', en: '/en', ru: '/ru', 'x-default': '/' },
  },
  robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'brandcultura',
    title: TITLE,
    description: DESCRIPTION,
    locale: 'de_DE',
    // alternateLocale: ['en_US', 'ru_RU'], // после запуска /en и /ru
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'brandcultura — SHAPE YOUR SOUND. Visuelle Identität für Musiker:innen & Labels',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.jpg'],
  },
  // TODO(owner): verification: { google: '<GSC code>' } — only if GSC is not verified via DNS
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="de"
      className={`bg-background ${onest.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        {children}
        <JsonLd />
        {/* Vercel Analytics only works on Vercel (served from /_vercel/insights). */}
        {process.env.NODE_ENV === 'production' && process.env.VERCEL === '1' && <Analytics />}
      </body>
    </html>
  )
}
