import type { Metadata } from 'next'
import { Onest, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const onest = Onest({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-onest',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'brandcultura — SHAPE YOUR SOUND',
  description:
    'Agentur für Künstler:innen und Labels. Wir lesen Spektrogramme, zerlegen Frequenzen und geben dem Sound eine Form, die bleibt.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="de"
      data-color-mode="dark"
      data-light-theme="light"
      data-dark-theme="dark"
      className={`${onest.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
