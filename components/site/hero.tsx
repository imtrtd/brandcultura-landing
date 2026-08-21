'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRightIcon, DotFillIcon } from '@primer/octicons-react'
import { Mono } from './primitives'
import { AccentButton } from './accent-button'

/** Animated waveform whose shape is driven by the frequency slider. */
function Waveform({ freq }: { freq: number }) {
  const [phase, setPhase] = useState(0)
  const raf = useRef<number>(0)

  useEffect(() => {
    let mounted = true
    const loop = () => {
      if (!mounted) return
      setPhase((p) => p + 0.035)
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => {
      mounted = false
      cancelAnimationFrame(raf.current)
    }
  }, [])

  const W = 640
  const H = 220
  const mid = H / 2
  // higher freq -> more cycles, slightly lower amplitude
  const cycles = 1.4 + (freq / 24000) * 9
  const amp = 78 - (freq / 24000) * 26
  const pts: string[] = []
  const steps = 240
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * W
    const t = (i / steps) * Math.PI * 2 * cycles + phase
    const env = Math.sin((i / steps) * Math.PI) // fade at edges
    const y =
      mid +
      Math.sin(t) * amp * env +
      Math.sin(t * 2.3 + phase * 0.7) * amp * 0.28 * env
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* baseline */}
      <line
        x1="0"
        y1={mid}
        x2={W}
        y2={mid}
        stroke="var(--bc-line)"
        strokeWidth="1"
      />
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke="var(--bc-accent)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* echo */}
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke="var(--bc-accent)"
        strokeWidth="6"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.12"
      />
    </svg>
  )
}

function EqBars() {
  const bars = Array.from({ length: 28 })
  return (
    <div
      aria-hidden="true"
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 3,
        height: 40,
      }}
    >
      {bars.map((_, i) => (
        <span
          key={i}
          className="bc-eq-bar"
          style={{
            flex: 1,
            height: '100%',
            transformOrigin: 'bottom',
            background:
              i % 5 === 0 ? 'var(--bc-accent)' : 'var(--bc-line-strong)',
            animation: `bc-eq ${0.9 + (i % 7) * 0.16}s ease-in-out ${
              (i % 9) * 0.08
            }s infinite`,
          }}
        />
      ))}
    </div>
  )
}

export function Hero() {
  const [freq, setFreq] = useState(440)

  return (
    <section id="top" style={{ paddingTop: 40, paddingBottom: 24 }}>
      <div className="bc-shell">
        {/* Top strip */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            paddingBottom: 40,
          }}
        >
          <Mono accent>
            <DotFillIcon size={10} /> &nbsp;SHAPE YOUR SOUND
          </Mono>
          <Mono>Musik · Kunst · Klangform</Mono>
          <Mono>Für Musiker:innen &amp; Labels</Mono>
        </div>

        {/* Headline grid */}
        <div className="bc-hero-grid">
          <div>
            <Mono style={{ display: 'block', marginBottom: 24 }}>
              01 / sound identity
            </Mono>
            <h1
              className="bc-display"
              style={{ fontSize: 'clamp(48px, 9vw, 132px)' }}
            >
              Wir machen
              <br />
              Klang{' '}
              <span style={{ color: 'var(--bc-accent)' }}>sichtbar.</span>
            </h1>

            <p
              style={{
                marginTop: 32,
                maxWidth: 520,
                fontSize: 17,
                lineHeight: 1.6,
                color: 'var(--bc-fg-muted)',
              }}
            >
              Agentur für Künstler:innen und Labels. Wir lesen Spektrogramme,
              zerlegen Frequenzen und geben dem Sound eine Form, die bleibt.
            </p>

            <div
              style={{
                marginTop: 36,
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                flexWrap: 'wrap',
              }}
            >
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

          {/* Visualizer panel */}
          <div
            style={{
              border: '1px solid var(--bc-line)',
              borderRadius: 16,
              background:
                'linear-gradient(180deg, var(--bc-surface) 0%, var(--bc-bg-2) 100%)',
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Mono accent>01 · Signal</Mono>
              <Mono>60 / 24000 Hz</Mono>
            </div>

            <div
              style={{
                position: 'relative',
                height: 220,
                borderRadius: 10,
                border: '1px solid var(--bc-line)',
                background:
                  'repeating-linear-gradient(90deg, transparent 0 39px, var(--bc-line) 39px 40px)',
                overflow: 'hidden',
              }}
            >
              <Waveform freq={freq} />
            </div>

            <EqBars />

            {/* Frequency control */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <Mono>Frequenz</Mono>
                <span
                  style={{
                    fontFamily: 'var(--bc-font-mono)',
                    fontSize: 22,
                    color: 'var(--bc-fg)',
                  }}
                >
                  {freq} <span style={{ fontSize: 13 }}>Hz</span>
                </span>
                <Mono>drag / feel</Mono>
              </div>
              <input
                type="range"
                min={60}
                max={24000}
                step={20}
                value={freq}
                aria-label="Frequenz"
                onChange={(e) => setFreq(Number(e.target.value))}
                className="bc-range"
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bc-hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: end;
        }
        @media (min-width: 960px) {
          .bc-hero-grid {
            grid-template-columns: 1.1fr 0.9fr;
            gap: 56px;
          }
        }
        .bc-range {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 4px;
          border-radius: 999px;
          background: var(--bc-line-strong);
          outline: none;
          cursor: pointer;
        }
        .bc-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--bc-accent);
          border: 3px solid var(--bc-bg);
          box-shadow: 0 0 0 1px var(--bc-accent);
        }
        .bc-range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--bc-accent);
          border: 3px solid var(--bc-bg);
        }
      `}</style>
    </section>
  )
}
