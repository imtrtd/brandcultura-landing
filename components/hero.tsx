'use client'

import Image from 'next/image'
import { useLocale } from './locale-provider'
import { Reveal } from './reveal'
import { useRef, useState, type CSSProperties, type PointerEvent } from 'react'

const EQ_BARS = Array.from({ length: 24 })

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
    <section id="top" className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-5 sm:pb-14 sm:pt-12 md:px-8 md:pb-20 md:pt-16">
      {/* meta bar */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-border pb-4">
        <span className="label-mono text-lime">{t.eyebrow}</span>
        <span className="label-mono text-muted-foreground">{t.arts}</span>
        <span className="label-mono ml-auto hidden text-muted-foreground sm:inline">{t.audience}</span>
      </div>

      {/* headline + equalizer */}
      <div className="grid gap-8 pt-10 md:grid-cols-[1.15fr_0.85fr] md:items-end md:gap-10 md:pt-16">
        <Reveal>
          <p className="label-mono mb-6 text-lime/80">01 / sound identity</p>
          <h1 className="display text-balance text-[clamp(3.4rem,11vw,9rem)] font-extrabold leading-[0.82] tracking-[-0.07em] text-foreground">
            {t.title}{' '}
            <span className="text-muted-foreground">{t.titleEnd}</span>
            <span className="text-lime">.</span>
          </h1>
        </Reveal>

        <Reveal delay={120} className="min-w-0">
          <div className="carbon-surface flex h-full flex-col justify-between gap-5 border border-border p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="label-mono text-lime">{t.signal}</span>
              <span className="label-mono text-muted-foreground">{frequency} Hz</span>
            </div>
            {/* signature live equalizer */}
            <div className="flex h-24 items-end gap-1 sm:h-28" aria-hidden="true">
              {EQ_BARS.map((_, i) => (
                <span
                  key={i}
                  className="eq-bar flex-1 rounded-sm bg-lime/80"
                  style={{ height: '100%', animationDelay: `${(i % 8) * 0.11}s`, animationDuration: `${1 + (i % 5) * 0.14}s` }}
                />
              ))}
            </div>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
              {t.intro} <span className="text-foreground">{t.emphasis}</span>
            </p>
          </div>
        </Reveal>
      </div>

      {/* wide interactive frequency console */}
      <Reveal delay={160} className="mt-10 sm:mt-14">
        <div
          role="application"
          aria-label="Interactive frequency controller"
          className="group relative aspect-[16/7] cursor-crosshair touch-none overflow-hidden border border-border bg-blue outline-none focus-visible:ring-2 focus-visible:ring-lime"
          style={{ '--frequency': `${frequency}Hz` } as CSSProperties}
          onPointerDown={startFrequency}
          onPointerMove={(event) => { if (event.buttons) updateFrequency(event) }}
          onPointerUp={stopFrequency}
          onPointerCancel={stopFrequency}
          tabIndex={0}
        >
          <Image src="/images/spectrogram.png" alt={t.alt} fill priority sizes="(max-width: 1152px) 100vw, 1088px" className="object-cover opacity-80 mix-blend-screen transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
          <div className="pointer-events-none absolute inset-0 bg-background/20" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-lime/70" aria-hidden="true" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 w-px origin-bottom bg-background/60 transition-transform duration-75" style={{ transform: `rotate(${(frequency - 520) / 8}deg)` }} aria-hidden="true" />
          <span className="label-mono absolute left-4 top-4 text-background">{t.frequency}</span>
          <span className="label-mono absolute right-4 top-4 text-background/70">drag / feel</span>
          <span className="label-mono absolute bottom-4 left-4 text-background/70">60 / 24000 Hz</span>
          <span className="label-mono absolute bottom-4 right-4 text-lime">LIVE TRANSLATION</span>
        </div>
      </Reveal>

      {/* bottom action + metrics */}
      <Reveal delay={220} className="mt-10 border-t border-border pt-8 sm:mt-14">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end md:gap-12">
          <dl className="grid grid-cols-3 gap-4 sm:gap-8">
            {[['20 Hz – 20 kHz', t.frequency], ['∞', t.titleEnd], ['2026', t.eyebrow]].map(([value, label]) => (
              <div key={value} className="border-l border-lime/40 pl-3 sm:pl-4">
                <dt className="display text-2xl font-extrabold leading-none tracking-tight text-foreground sm:text-4xl">{value}</dt>
                <dd className="label-mono mt-2 text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#kontakt" className="flex min-h-12 items-center justify-center bg-lime px-6 py-3 text-sm font-semibold text-lime-foreground transition-transform hover:-translate-y-0.5 hover:opacity-90">{t.discuss}</a>
            <a href="#analyse" className="flex min-h-12 items-center justify-center border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-lime hover:text-lime">{t.spectrum}</a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
