import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Mono, Onest } from 'next/font/google'
import './globals.css'

const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-onest',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'brandcultura — SHAPE YOUR SOUND',
  description:
    'Agentur für Künstler:innen und Labels. Wir lesen Spektrogramme, zerlegen Frequenzen und geben dem Sound eine Form, die bleibt.',
  generator: 'v0.app',
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
        {/* Vercel Analytics only works on Vercel (served from /_vercel/insights). */}
        {process.env.NODE_ENV === 'production' && process.env.VERCEL === '1' && (
          <Analytics />
        )}
      </body>
    </html>
  )
}
