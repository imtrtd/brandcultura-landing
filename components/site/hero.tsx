'use client'

import { ArrowRightIcon, DotFillIcon } from '@primer/octicons-react'
import { Mono } from './primitives'
import { AccentButton } from './accent-button'

function SignalBackground() {
  const width = 1200
  const height = 360
  const points = Array.from({ length: 241 }, (_, index) => {
    const progress = index / 240
    const x = progress * width
    const y =
      height / 2 +
      Math.sin(progress * Math.PI * 14) * 34 +
      Math.sin(progress * Math.PI * 28) * 4
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  return (
    <div className="bc-signal-background" aria-hidden="true">
      <div className="bc-signal-grid" />
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <polyline className="bc-signal-glow" points={points} />
        <polyline className="bc-signal-wave" points={points} />
      </svg>
    </div>
  )
}

export function Hero() {
  return (
    <section id="top" className="bc-hero">
      <SignalBackground />
      <div className="bc-shell bc-hero-content">
        <div className="bc-hero-strip">
          <Mono accent>
            <DotFillIcon size={10} /> &nbsp;SHAPE YOUR SOUND
          </Mono>
          <Mono>Musik · Kunst · Klangform</Mono>
          <Mono>Für Musiker:innen &amp; Labels</Mono>
        </div>

        <div className="bc-hero-grid">
          <div>
            <Mono style={{ display: 'block', marginBottom: 24 }}>
              01 / sound identity
            </Mono>
            <h1 className="bc-display bc-hero-title">
              Wir machen
              <br />
              Klang <span>sichtbar.</span>
            </h1>
            <p className="bc-hero-copy">
              Agentur für Künstler:innen und Labels. Wir lesen Spektrogramme,
              zerlegen Frequenzen und geben dem Sound eine Form, die bleibt.
            </p>
            <div className="bc-hero-actions">
              <AccentButton
                size="large"
                trailingVisual={ArrowRightIcon}
                onClick={() =>
                  document
                    .querySelector('#kontakt')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Projekt besprechen
              </AccentButton>
              <Mono>SHAPE YOUR SOUND / 2026</Mono>
            </div>
          </div>
          <div className="bc-hero-caption">
            <Mono accent>01 · Signal</Mono>
            <Mono>60 / 24000 Hz</Mono>
          </div>
        </div>
      </div>

      <style>{`
        .bc-hero {
          position: relative;
          isolation: isolate;
          min-height: min(720px, 88vh);
          display: grid;
          align-items: stretch;
          overflow: hidden;
          border-bottom: 1px solid var(--bc-line);
        }
        .bc-hero-content { position: relative; z-index: 1; padding-top: 40px; padding-bottom: 48px; display: flex; flex-direction: column; }
        .bc-hero-strip { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
        .bc-hero-grid { display: grid; grid-template-columns: 1fr; gap: 48px; flex: 1; align-items: end; padding-top: clamp(88px, 16vh, 180px); }
        .bc-hero-title { font-size: clamp(52px, 9vw, 132px); }
        .bc-hero-title span { color: var(--bc-accent); }
        .bc-hero-copy { margin-top: 32px; max-width: 520px; font-size: 17px; line-height: 1.6; color: var(--bc-fg-muted); }
        .bc-hero-actions { margin-top: 36px; display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
        .bc-hero-caption { align-self: end; display: flex; justify-content: space-between; gap: 18px; padding-top: 20px; border-top: 1px solid var(--bc-line); }
        .bc-signal-background { position: absolute; inset: 0; z-index: -1; background: radial-gradient(circle at 70% 52%, rgba(210,236,61,.07), transparent 35%), var(--bc-bg); }
        .bc-signal-grid { position: absolute; inset: 0; opacity: .5; background-image: radial-gradient(circle, rgba(235,232,223,.48) 1px, transparent 1.25px); background-size: 15px 15px; mask-image: linear-gradient(90deg, transparent 0%, #000 28%, #000 90%, transparent 100%), linear-gradient(180deg, transparent 0%, #000 18%, #000 82%, transparent 100%); mask-composite: intersect; }
        .bc-signal-background svg { position: absolute; inset: 0; width: 108%; height: 100%; transform: translateX(-4%); animation: bc-signal-drift 6s ease-in-out infinite alternate; }
        .bc-signal-wave, .bc-signal-glow { fill: none; stroke-linecap: round; stroke-linejoin: round; }
        .bc-signal-wave { stroke: var(--bc-accent); stroke-width: 2.2; }
        @keyframes bc-signal-drift { from { transform: translateX(-4%) scaleY(.94); } to { transform: translateX(-1%) scaleY(1.06); } }
        .bc-signal-glow { stroke: var(--bc-accent); stroke-width: 10; opacity: .12; }
        @media (min-width: 960px) { .bc-hero-grid { grid-template-columns: 1.1fr .9fr; gap: 56px; } .bc-hero-caption { justify-self: end; width: min(100%, 320px); } }
        @media (prefers-reduced-motion: reduce) { .bc-signal-grid { opacity: .35; } .bc-signal-background svg { animation: none; } }
      `}</style>
    </section>
  )
}
