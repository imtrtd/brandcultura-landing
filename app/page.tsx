import { SiteHeader } from '@/components/site/site-header'
import { Process } from '@/components/site/process'
import { Marquee } from '@/components/site/marquee'
import { SoundSkin } from '@/components/site/sound-skin'
import { Spectrogram } from '@/components/site/spectrogram'
import { Shape } from '@/components/site/shape'
import { Disciplines } from '@/components/site/disciplines'
import { Team } from '@/components/site/team'
import { Contact } from '@/components/site/contact'
import { SiteFooter } from '@/components/site/site-footer'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Process />
        <Marquee />
        <SoundSkin />
        <Spectrogram />
        <Shape />
        <Disciplines />
        <Team />
        <Contact />
      </main>
      <SiteFooter />
    </>
  )
}
