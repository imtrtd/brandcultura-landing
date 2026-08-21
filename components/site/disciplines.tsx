'use client'

import { Section, Mono } from './primitives'
import { UnmuteIcon, PaintbrushIcon } from '@primer/octicons-react'

const ITEMS = [
  {
    n: '01 · Musik',
    icon: UnmuteIcon,
    title: ['Lebendiger Klang', 'und sein Publikum'],
    body: 'Release-Strategien, visuelle Systeme, Konzerte und Community um Artist oder Label.',
  },
  {
    n: '02 · Kunst & Kreativität',
    icon: PaintbrushIcon,
    title: ['Rahmen für', 'den Künstler'],
    body: 'Vom Manifest bis zur tragfähigen Community. Klar sprechen und die Richtigen versammeln.',
  },
]

export function Disciplines() {
  return (
    <Section style={{ borderTop: '1px solid var(--bc-line)' }}>
      <div className="bc-disc-grid">
        {ITEMS.map((it) => {
          const Icon = it.icon
          return (
            <article
              key={it.n}
              style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Mono accent>{it.n}</Mono>
                <span
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    border: '1px solid var(--bc-line-strong)',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'var(--bc-fg)',
                  }}
                >
                  <Icon size={20} />
                </span>
              </div>
              <h3
                className="bc-display"
                style={{ fontSize: 'clamp(30px, 4vw, 52px)' }}
              >
                {it.title[0]}
                <br />
                <span style={{ color: 'var(--bc-fg-muted)' }}>
                  {it.title[1]}
                </span>
              </h3>
              <p
                style={{
                  color: 'var(--bc-fg-muted)',
                  fontSize: 15.5,
                  lineHeight: 1.65,
                  maxWidth: 440,
                }}
              >
                {it.body}
              </p>
            </article>
          )
        })}
      </div>

      <style>{`
        .bc-disc-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 56px;
        }
        @media (min-width: 800px) {
          .bc-disc-grid { grid-template-columns: repeat(2, 1fr); gap: 64px; }
        }
      `}</style>
    </Section>
  )
}
