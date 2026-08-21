'use client'

import { Section, SectionTag, Mono } from './primitives'

const BANDS = [
  {
    n: '01 · LOW',
    title: 'Bass / Fundament',
    body: 'Schwere, lange Formen. Breite Linien, große Flächen — outer contour im Blackwork.',
  },
  {
    n: '02 · MID',
    title: 'Körper / Charakter',
    body: 'Rhythmus und Textur. Wiederholung, Modulation — hier entsteht der „Sound“ der Marke.',
  },
  {
    n: '03 · HIGH',
    title: 'Detail / Glanz',
    body: 'Feine Spitzen und Highlights. Dünne Linien, sparsame Akzente.',
  },
]

/** Deterministic pseudo-random spectrogram grid. */
function SpectrogramGrid() {
  const cols = 64
  const rows = 12
  const cells: { x: number; y: number; a: number }[] = []
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      // energy concentrated in lows (bottom) and some mid activity
      const lowBias = 1 - y / rows
      const wobble =
        (Math.sin(x * 0.5) + Math.sin(x * 0.13 + y) + Math.cos(y * 0.9)) / 3
      const a = Math.max(0, Math.min(1, lowBias * 0.9 + wobble * 0.35))
      cells.push({ x, y, a })
    }
  }
  return (
    <div
      aria-hidden="true"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridAutoRows: '1fr',
        gap: 2,
        height: 220,
        border: '1px solid var(--bc-line)',
        borderRadius: 12,
        padding: 10,
        background: 'var(--bc-bg-2)',
      }}
    >
      {cells.map((c, i) => {
        const strong = c.a > 0.55
        return (
          <span
            key={i}
            style={{
              borderRadius: 1,
              opacity: 0.25 + c.a * 0.75,
              background: strong
                ? 'var(--bc-accent)'
                : c.a > 0.3
                  ? 'var(--bc-fg-subtle)'
                  : 'var(--bc-line-strong)',
            }}
          />
        )
      })}
    </div>
  )
}

export function Spectrogram() {
  return (
    <Section id="spektrogramm" style={{ borderTop: '1px solid var(--bc-line)' }}>
      <SectionTag>Analyse</SectionTag>
      <div className="bc-spec-head">
        <h2
          className="bc-display"
          style={{ fontSize: 'clamp(34px, 5vw, 66px)', marginTop: 20 }}
        >
          Spektrogramm als Design-Brief
        </h2>
        <p
          style={{
            maxWidth: 420,
            color: 'var(--bc-fg-muted)',
            fontSize: 15,
            lineHeight: 1.65,
          }}
        >
          Wir lesen das Spektrogramm nicht als Dekoration, sondern als Bauplan.
          Jede Frequenzzone wird zur Design-Entscheidung: Dichte, Linie,
          Rhythmus, Leerraum.
        </p>
      </div>

      <div style={{ marginTop: 48, position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
        >
          <Mono>LOW</Mono>
          <Mono>MID</Mono>
          <Mono>HIGH</Mono>
        </div>
        <SpectrogramGrid />
      </div>

      <div className="bc-band-grid">
        {BANDS.map((b) => (
          <article
            key={b.n}
            style={{
              border: '1px solid var(--bc-line)',
              borderRadius: 14,
              background: 'var(--bc-surface)',
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <Mono accent>{b.n}</Mono>
            <h3
              style={{
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: '-0.01em',
              }}
            >
              {b.title}
            </h3>
            <p
              style={{
                color: 'var(--bc-fg-muted)',
                fontSize: 14.5,
                lineHeight: 1.6,
              }}
            >
              {b.body}
            </p>
          </article>
        ))}
      </div>

      <style>{`
        .bc-spec-head {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          align-items: end;
        }
        @media (min-width: 900px) {
          .bc-spec-head { grid-template-columns: 1.3fr 0.7fr; }
        }
        .bc-band-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-top: 48px;
        }
        @media (min-width: 800px) {
          .bc-band-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </Section>
  )
}
