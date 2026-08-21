'use client'

import { Section, Mono } from './primitives'

const MAP = [
  { from: 'Frequenz', to: 'Linienstärke' },
  { from: 'Amplitude', to: 'Kontrast / Füllung' },
  { from: 'Rhythmus', to: 'Wiederholung & Pause' },
  { from: 'Stille', to: 'Negativraum' },
]

const STATS = [
  { v: '20 Hz – 20 kHz', l: 'hörbares Spektrum' },
  { v: '∞', l: 'bleibt auf der Haut' },
  { v: '1 → 2', l: 'ein Signal, zwei Medien' },
]

export function SoundSkin() {
  return (
    <Section id="sound-skin" style={{ borderTop: '1px solid var(--bc-line)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 40,
        }}
      >
        <Mono accent>Tätowierung und Schallwelle ↔ 02</Mono>
        <Mono>tippen / hören</Mono>
      </div>

      <div className="bc-ss-grid">
        <div>
          <h2
            className="bc-display"
            style={{ fontSize: 'clamp(34px, 5vw, 68px)', maxWidth: 620 }}
          >
            Beide sind Spur einer{' '}
            <span style={{ color: 'var(--bc-accent)' }}>Vibration</span>
          </h2>
          <p
            style={{
              marginTop: 28,
              maxWidth: 520,
              color: 'var(--bc-fg-muted)',
              fontSize: 16,
              lineHeight: 1.65,
            }}
          >
            Schall ist organisierte Schwingung. Die Tätowiermaschine ebenfalls.
            Unterschied nur in der Materie: Luft oder Haut. Beides verwandelt
            Frequenz in dauerhafte Form.
          </p>

          <div
            style={{
              marginTop: 40,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
            }}
          >
            {STATS.map((s) => (
              <div
                key={s.l}
                style={{
                  borderTop: '1px solid var(--bc-line-strong)',
                  paddingTop: 14,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--bc-font-mono)',
                    fontSize: 20,
                    color: 'var(--bc-fg)',
                  }}
                >
                  {s.v}
                </div>
                <div
                  className="bc-mono"
                  style={{ marginTop: 6, fontSize: 10 }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mapping card */}
        <div
          style={{
            border: '1px solid var(--bc-line)',
            borderRadius: 16,
            background: 'var(--bc-surface)',
            padding: 8,
          }}
        >
          {MAP.map((m, i) => (
            <div
              key={m.from}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                padding: '22px 20px',
                borderBottom:
                  i < MAP.length - 1 ? '1px solid var(--bc-line)' : 'none',
              }}
            >
              <span
                className="bc-mono"
                style={{ color: 'var(--bc-fg-subtle)', fontSize: 12 }}
              >
                {m.from}
              </span>
              <span
                aria-hidden="true"
                style={{
                  flex: 1,
                  height: 1,
                  margin: '0 6px',
                  background:
                    'repeating-linear-gradient(90deg, var(--bc-line-strong) 0 6px, transparent 6px 12px)',
                }}
              />
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: 'var(--bc-fg)',
                }}
              >
                {m.to}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .bc-ss-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: start;
        }
        @media (min-width: 900px) {
          .bc-ss-grid { grid-template-columns: 1.05fr 0.95fr; gap: 56px; }
        }
      `}</style>
    </Section>
  )
}
