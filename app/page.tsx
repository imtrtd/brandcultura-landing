import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { ProcessSteps } from '@/components/process-steps'
import { SoundSkin } from '@/components/sound-skin'
import { Analyse } from '@/components/analyse'
import { ShapeYourSound } from '@/components/shape-your-sound'
import { SystemDna } from '@/components/system-dna'
import { Contact } from '@/components/contact'
import { SiteFooter } from '@/components/site-footer'
import { LocaleProvider } from '@/components/locale-provider'

export default function Page() {
  return (
    <LocaleProvider>
      <main className="site-shell relative isolate min-h-screen overflow-hidden bg-background">
        <SiteHeader />
        <Hero />
        <ProcessSteps />
        <SoundSkin />
        <Analyse />
        <ShapeYourSound />
        <SystemDna />
        <Contact />
        <SiteFooter />
      </main>
    </LocaleProvider>
  )
}
