'use client'

import Image from 'next/image'
import { useLocale } from './locale-provider'
import { Reveal } from './reveal'
import { useRef, useState, type CSSProperties, type PointerEvent } from 'react'

export function Hero() {
  const { copy } = useLocale()
  const t = copy.hero
  const [frequency, setFrequency] = useState(440)
  const audioRef = useRef<{ context: AudioContext; oscillator: OscillatorNode; gain: GainNode } | null>(null)

  function updateFrequency(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
    const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height))
    const nextFrequency = Math.round(80 + x * 880 + (1 - y) * 120)
    setFrequency(nextFrequency)
    const active = audioRef.current
    if (active) {
      active.oscillator.frequency.setTargetAtTime(nextFrequency, active.context.currentTime, 0.025)
      active.gain.gain.setTargetAtTime(0.018 + (1 - y) * 0.012, active.context.currentTime, 0.04)
    }
  }

  function startFrequency(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId)
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    const context = new AudioContextClass()
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sine'
    gain.gain.value = 0.0001
    oscillator.connect(gain).connect(context.destination)
    oscillator.start()
    audioRef.current = { context, oscillator, gain }
    updateFrequency(event)
  }

  function stopFrequency(event: PointerEvent<HTMLDivElement>) {
    if (!audioRef.current) return
    const { context, oscillator, gain } = audioRef.current
    gain.gain.setTargetAtTime(0.0001, context.currentTime, 0.04)
    oscillator.stop(context.currentTime + 0.18)
    void context.close()
    audioRef.current = null
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }

  return (
    <section id="top" className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-5 sm:pb-14 sm:pt-14 md:px-8 md:pb-16 md:pt-20">
      <div className="carbon-panel relative overflow-hidden px-4 py-5 sm:px-6 sm:py-7 md:px-10 md:py-10">
        <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 border-l border-b border-lime/30 bg-lime/5 md:h-48 md:w-48" aria-hidden="true" />
        <div className="relative z-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border pb-5 sm:gap-x-6 sm:pb-6">
          <span className="label-mono text-lime">{t.eyebrow}</span>
          <span className="label-mono text-muted-foreground">{t.arts}</span>
          <span className="label-mono ml-auto hidden text-muted-foreground sm:inline">{t.audience}</span>
        </div>

        <div className="relative z-10 grid gap-8 pt-10 md:grid-cols-[0.9fr_1.1fr] md:gap-10 md:pt-14">
          <div className="flex flex-col justify-between gap-10">
            <Reveal>
              <p className="label-mono mb-5 text-lime/80">01 / sound identity</p>
              <h1 className="display max-w-[8ch] text-pretty text-[clamp(4rem,10vw,8.5rem)] font-extrabold leading-[0.84] tracking-[-0.07em] text-foreground">{t.title}<span className="text-lime">.</span></h1>
            </Reveal>
            <Reveal delay={100}>
              <p className="max-w-sm text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">{t.intro} <span className="text-foreground">{t.emphasis}</span></p>
            </Reveal>
          </div>

          <Reveal delay={120} className="min-w-0">
            <div className="carbon-surface relative overflow-hidden border border-border p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
                <span className="label-mono text-lime">01 · SIGNAL / FORM</span>
                <span className="label-mono text-muted-foreground">{frequency} Hz</span>
              </div>
              <div role="application" aria-label="Interactive frequency controller" className="group relative aspect-[4/3] cursor-crosshair touch-none overflow-hidden border border-border bg-blue outline-none focus-visible:ring-2 focus-visible:ring-lime" style={{ '--frequency': `${frequency}Hz` } as CSSProperties} onPointerDown={startFrequency} onPointerMove={(event) => { if (event.buttons) updateFrequency(event) }} onPointerUp={stopFrequency} onPointerCancel={stopFrequency} tabIndex={0}>
                <Image src="/images/spectrogram.png" alt={t.alt} fill priority sizes="(max-width: 767px) 100vw, 50vw" className="object-cover opacity-80 mix-blend-screen transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
                <div className="pointer-events-none absolute inset-0 bg-background/20" aria-hidden="true" />
                <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-lime/70" aria-hidden="true" />
                <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 w-px origin-bottom bg-background/60 transition-transform duration-75" style={{ transform: `rotate(${(frequency - 520) / 8}deg)` }} aria-hidden="true" />
                <span className="label-mono absolute bottom-3 left-3 text-background">{t.frequency}</span>
                <span className="label-mono absolute bottom-3 right-3 text-background/70">drag / feel</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="label-mono text-muted-foreground">60 / 24000 Hz</span>
                <span className="label-mono text-lime">LIVE TRANSLATION</span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="relative z-10 mt-10 border-t border-border pt-6 sm:mt-14 sm:pt-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label-mono mb-3 text-muted-foreground">{t.titleEnd}</p>
              <h2 className="display text-[clamp(3rem,8vw,7rem)] font-extrabold leading-[0.84] tracking-[-0.07em] text-foreground">{t.titleEnd}<span className="text-lime">.</span></h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="#kontakt" className="flex min-h-12 items-center justify-center bg-lime px-6 py-3 text-sm font-semibold text-lime-foreground transition-transform hover:-translate-y-0.5 hover:opacity-90">{t.discuss}<span className="ml-2" aria-hidden="true">→</span></a>
              <a href="#analyse" className="flex min-h-12 items-center justify-center border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-lime hover:text-lime">{t.spectrum}</a>
            </div>
          </div>
        </Reveal>
      </div>
      <div className="mt-3 flex items-center gap-3 px-1 sm:mt-4"><span className="h-px flex-1 bg-lime/70" aria-hidden="true" /><span className="label-mono text-muted-foreground">{t.eyebrow} / 2026</span></div>
    </section>
  )
}
