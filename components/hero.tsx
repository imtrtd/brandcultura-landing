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
    <section id="top" className="mx-auto max-w-6xl overflow-hidden px-4 pb-10 pt-8 sm:px-5 sm:pb-14 sm:pt-14 md:px-8 md:pb-16 md:pt-20">
      <div className="carbon-panel relative overflow-hidden px-4 py-5 sm:px-6 sm:py-7 md:px-8 md:py-9">
        <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 border-l border-b border-lime/30 bg-lime/5 sm:h-44 sm:w-44" aria-hidden="true" />
        <div className="relative z-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border pb-5 sm:gap-x-6 sm:pb-6">
          <span className="label-mono text-lime">{t.eyebrow}</span>
          <span className="label-mono text-muted-foreground">{t.arts}</span>
          <span className="label-mono ml-auto hidden text-muted-foreground sm:inline">{t.audience}</span>
        </div>
        <Reveal className="relative z-10 pt-8 sm:pt-12 md:pt-16">
          <p className="label-mono mb-4 text-lime/80">01 / sound identity</p>
          <h1 className="display max-w-[9ch] text-pretty text-[clamp(3.75rem,12vw,9.5rem)] font-extrabold leading-[0.88] tracking-[-0.065em] text-foreground sm:max-w-[10ch]">{t.title}</h1>
        </Reveal>
        <Reveal delay={100} className="relative z-10 my-6 grid gap-3 sm:my-8 md:grid-cols-4">
          <div className="carbon-panel signal-glow signal-scan group relative aspect-[16/9] overflow-hidden md:col-span-3 md:aspect-[16/7]">
            <Image src="/images/spectrogram.png" alt={t.alt} fill priority sizes="(max-width: 767px) 100vw, 75vw" className="object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-[1.02]" />
            <div className="absolute inset-0 flex bg-gradient-to-t from-background/50 via-transparent to-lime/5" aria-hidden="true" />
            <span className="label-mono absolute left-3 top-3 z-10 text-lime sm:left-4 sm:top-4">{t.signal}</span>
            <span className="label-mono absolute bottom-3 right-3 z-10 text-foreground/70 sm:bottom-4 sm:right-4">60 / 24000 Hz</span>
          </div>
          <div role="application" aria-label="Interactive frequency controller" className="carbon-surface group relative hidden min-h-32 cursor-crosshair touch-none bg-blue md:block" style={{ '--frequency': `${frequency}Hz` } as CSSProperties} onPointerDown={startFrequency} onPointerMove={(event) => { if (event.buttons) updateFrequency(event) }} onPointerUp={stopFrequency} onPointerCancel={stopFrequency}><div className="pointer-events-none absolute inset-x-0 bottom-8 h-px bg-background/30" aria-hidden="true" /><div className="pointer-events-none absolute bottom-8 left-1/2 top-0 w-px origin-bottom bg-background/50 transition-transform duration-75" style={{ transform: `rotate(${(frequency - 520) / 8}deg)` }} aria-hidden="true" /><span className="label-mono absolute bottom-4 left-4 text-background">{t.frequency}</span><span className="label-mono absolute right-4 top-4 text-background opacity-80">{frequency} Hz</span><span className="label-mono absolute bottom-4 right-4 text-background/70 transition-opacity group-hover:opacity-100 md:opacity-0">drag / feel</span></div>
        </Reveal>
        <Reveal delay={150} className="relative z-10">
          <h2 className="display max-w-[9ch] text-pretty text-[clamp(3.75rem,12vw,9.5rem)] font-extrabold leading-[0.88] tracking-[-0.065em] text-foreground sm:max-w-none">{t.titleEnd}<span className="text-lime">.</span></h2>
        </Reveal>
        <Reveal delay={200} className="relative z-10 mt-8 grid gap-6 border-t border-border pt-6 sm:mt-12 sm:pt-8 md:grid-cols-[1fr_auto] md:items-end md:gap-10">
          <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">{t.intro} <span className="text-foreground">{t.emphasis}</span></p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#kontakt" className="flex min-h-12 items-center justify-center bg-lime px-6 py-3 text-sm font-semibold text-lime-foreground transition-transform hover:-translate-y-0.5 hover:opacity-90">{t.discuss} <span className="ml-2" aria-hidden="true">→</span></a>
            <a href="#analyse" className="flex min-h-12 items-center justify-center border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-lime hover:text-lime">{t.spectrum}</a>
          </div>
        </Reveal>
      </div>
      <div className="mt-3 flex items-center gap-3 px-1 sm:mt-4">
        <span className="h-px flex-1 bg-lime/70" aria-hidden="true" />
        <span className="label-mono text-muted-foreground">{t.eyebrow} / 2026</span>
      </div>
    </section>
  )
}
