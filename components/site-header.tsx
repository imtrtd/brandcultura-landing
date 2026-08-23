'use client'

import { useLocale, type Locale } from './locale-provider'

const HREFS = ['#sound-skin', '#analyse', '#shape', '#dna', '#kontakt']

export function SiteHeader() {
  const { copy, locale, setLocale } = useLocale()
  const labels = [copy.nav.sound, copy.nav.spectrum, copy.nav.shape, copy.nav.dna, copy.nav.contact]
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-2 px-4 py-2 sm:gap-4 sm:px-5 sm:py-3 md:px-8">
        <a href="#top" className="flex min-h-11 items-center gap-2"><span className="font-display text-base font-bold tracking-tight sm:text-lg">brandcultura</span><span className="label-mono hidden text-muted-foreground sm:inline">agency</span></a>
        <nav className="hidden items-center gap-7 lg:flex" aria-label={copy.nav.aria}>{labels.map((label, i) => <a key={HREFS[i]} href={HREFS[i]} className="label-mono text-muted-foreground transition-colors hover:text-foreground">{label}</a>)}</nav>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-border" role="group" aria-label={copy.nav.language}>
            {(['de', 'en', 'ru'] as Locale[]).map((item) => <button key={item} type="button" onClick={() => setLocale(item)} aria-pressed={locale === item} className={`min-h-11 min-w-10 px-2 py-2 font-mono text-[11px] uppercase transition-colors ${locale === item ? 'bg-lime text-lime-foreground' : 'text-muted-foreground hover:text-foreground'}`}>{item}</button>)}
          </div>
          <a href="#kontakt" className="hidden bg-lime px-4 py-2 text-sm font-semibold text-lime-foreground transition-opacity hover:opacity-90 sm:block">{copy.nav.start}</a>
        </div>
      </div>
    </header>
  )
}
