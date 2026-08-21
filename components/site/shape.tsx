'use client'

import { Section, Mono } from './primitives'
import { ArrowUpRightIcon } from '@primer/octicons-react'

const CARDS = [
  {
    tag: 'VISUAL SOUND',
    title: 'Klang sichtbar machen',
    body: 'Spektrogramm → Form. Waveform und Frequenzräume für visuelle Identität.',
  },
  {
    tag: 'FORM + SYSTEM',
    title: 'Form und System',
    body: 'Vom Release bis zur gesamten visuellen Welt eines Artists.',
  },
]

const RIBBON = [
  'VISUAL SOUND',
  'FORM + SYSTEM',
  'Musik',
  'Kunst & Kreativität',
]

export function Shape() {
  const ribbon = [...RIBBON, ...RIBBON, ...RIBBON, ...RIBBON]
  return (
    <Section id="shape" style={{ borderTop: '1px solid var(--bc-line)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 40,
        }}
      >
        <Mono accent>New Branch · 2026</Mono>
        <Mono>spectrogram → form</Mono>
      </div>

      <h2
        className="bc-display"
        style={{ fontSize: 'clamp(44px, 8vw, 120px)' }}
      >
        SHAPE YOUR SOUND
      </h2>
      <p
        style={{
          marginTop: 28,
          maxWidth: 640,
          color: 'var(--bc-fg-muted)',
          fontSize: 17,
          lineHeight: 1.6,
        }}
      >
        Einer der jüngsten Entwicklungszweige. Wir visualisieren das Klangbild
        der Clients und bauen Systeme für Cover, Motion, Stage und Identity.
      </p>

      <div className="bc-shape-cards">
        {CARDS.map((c) => (
          <article
            key={c.tag}
            style={{
              border: '1px solid var(--bc-line)',
              borderRadius: 16,
              background:
                'linear-gradient(180deg, var(--bc-surface-2) 0%, var(--bc-surface) 100%)',
              padding: 28,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              minHeight: 200,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Mono accent>{c.tag}</Mono>
              <ArrowUpRightIcon size={18} fill="var(--bc-fg-subtle)" />
            </div>
            <h3
              style={{
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                marginTop: 'auto',
              }}
            >
              {c.title}
            </h3>
            <p
              style={{
                color: 'var(--bc-fg-muted)',
                fontSize: 15,
                lineHeight: 1.6,
              }}
            >
              {c.body}
            </p>
          </article>
        ))}
      </div>

      {/* Ribbon */}
      <div
        aria-hidden="true"
        style={{
          marginTop: 48,
          border: '1px solid var(--bc-line)',
          borderRadius: 999,
          overflow: 'hidden',
          paddingBlock: 14,
        }}
      >
        <div
          className="bc-marquee-track"
          style={{
            display: 'flex',
            width: 'max-content',
            gap: 28,
            animation: 'bc-marquee 22s linear infinite',
          }}
        >
          {ribbon.map((r, i) => (
            <span
              key={i}
              className="bc-mono"
              style={{
                fontSize: 13,
                color: i % 4 === 0 ? 'var(--bc-accent)' : 'var(--bc-fg-muted)',
                display: 'inline-flex',
                gap: 28,
                alignItems: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              {r} <span style={{ color: 'var(--bc-fg-subtle)' }}>/</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .bc-shape-cards {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-top: 48px;
        }
        @media (min-width: 800px) {
          .bc-shape-cards { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </Section>
  )
}
