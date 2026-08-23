'use client'

import Image from 'next/image'
import { useRef, type KeyboardEvent } from 'react'
import { useLocale } from './locale-provider'
import { Reveal } from './reveal'

const BAR_COUNT = 28

export function SoundSkin() {
  const { copy } = useLocale()
  const t = copy.sound
  const audioContextRef = useRef<AudioContext | null>(null)

  function playSignal() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    const context = audioContextRef.current ?? new AudioContextClass()
    audioContextRef.current = context
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(110, context.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(82, context.currentTime + 0.28)
    gain.gain.setValueAtTime(0.0001, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.018, context.currentTime + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.34)
    oscillator.connect(gain).connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + 0.36)
  }

  function handleVisualKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      playSignal()
    }
  }

  return (
    <section id="sound-skin" aria-labelledby="sound-skin-heading" className="carbon-surface border-y border-border">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-16 md:px-8 md:py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="label-mono text-lime">{t.label}</span>
              <h2
                id="sound-skin-heading"
                className="display mt-4 max-w-3xl text-pretty text-4xl font-bold text-foreground sm:text-5xl md:text-6xl"
              >
                {t.title}
              </h2>
            </div>
            <span className="label-mono hidden text-muted-foreground sm:block">↔ 02</span>
          </div>
        </Reveal>

        <div className="mt-9 grid grid-cols-1 gap-8 sm:mt-12 sm:gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          <Reveal>
            <div
              role="button"
              tabIndex={0}
              aria-label={`${t.alt}. Click to hear a subtle signal.`}
              onClick={playSignal}
              onKeyDown={handleVisualKeyDown}
              className="carbon-panel signal-glow signal-scan group relative aspect-[4/3] cursor-pointer overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:aspect-auto lg:h-full lg:min-h-[26rem]"
            >
              <Image
                src="/images/sound-skin-waveform.png"
                alt={t.alt}
                fill
                sizes="(max-width: 1023px) 100vw, 55vw"
                className="object-cover opacity-85 transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-safe:animate-[sound-drift_16s_ease-in-out_infinite]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-lime/5" aria-hidden />

              {/* live equalizer overlay */}
              <div
                className="absolute inset-x-0 bottom-0 flex h-24 items-end gap-[3px] px-4 pb-4 sm:h-28 sm:gap-1 sm:px-6"
                aria-hidden
              >
                {Array.from({ length: BAR_COUNT }).map((_, i) => {
                  const base = 22 + Math.abs(Math.sin(i * 1.35)) * 70
                  return (
                    <span
                      key={i}
                      className="eq-bar block flex-1 rounded-sm bg-lime/70"
                      style={{
                        height: `${base}%`,
                        animationDelay: `${(i % 9) * 90}ms`,
                        animationDuration: `${900 + (i % 5) * 180}ms`,
                      }}
                    />
                  )
                })}
              </div>

              <span className="label-mono absolute right-3 top-3 z-10 rounded-sm bg-background/70 px-2 py-1 text-lime backdrop-blur-sm sm:right-4 sm:top-4">
                {t.cue}
              </span>
            </div>
          </Reveal>

          <Reveal delay={120} className="flex flex-col justify-center">
            <h3 className="text-2xl font-semibold leading-tight text-foreground">{t.subtitle}</h3>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              {t.body} <span className="text-lime">{t.emphasis}</span>
            </p>

            {/* metrics strip */}
            <dl className="mt-7 grid grid-cols-3 gap-px overflow-hidden border border-border bg-border sm:mt-8">
              {t.metrics.map(([value, caption]) => (
                <div key={caption} className="carbon-panel flex flex-col gap-1 p-3 sm:p-4">
                  <dt className="display text-lg font-bold text-lime sm:text-2xl">{value}</dt>
                  <dd className="label-mono text-[0.6rem] leading-tight text-muted-foreground sm:text-[0.6875rem]">
                    {caption}
                  </dd>
                </div>
              ))}
            </dl>

            {/* mapping table */}
            <ul className="mt-3 flex flex-col gap-px overflow-hidden border border-border bg-border">
              {t.mapping.map(([from, to], index) => (
                <li
                  key={from}
                  className="carbon-panel group grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3 transition-colors hover:bg-card"
                >
                  <span className="font-mono text-xs text-foreground sm:text-sm">{from}</span>
                  <span
                    className="node-pulse h-1.5 w-1.5 rounded-full bg-lime"
                    style={{ animationDelay: `${index * 260}ms` }}
                    aria-hidden
                  />
                  <span className="text-right font-mono text-xs text-lime sm:text-sm">{to}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
