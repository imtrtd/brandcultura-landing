'use client'

import { Section, SectionTag, Mono } from './primitives'

const STEPS = [
  {
    n: '01',
    kicker: 'Analyse',
    title: 'Zuhören / Lesen',
    body: 'Sound und Spektrogramm lesen. Den Charakter hören, bevor eine einzige Linie entsteht.',
  },
  {
    n: '02',
    kicker: 'System',
    title: 'Zerlegen & Formen',
    body: 'Frequenzen und Bild zerlegen, neu als tragfähige Form zusammensetzen.',
  },
  {
    n: '03',
    kicker: 'Release',
    title: 'Die Welle starten',
    body: 'System, Content und Community werden zu einer Bewegung.',
  },
]

export function Process() {
  return (
    <Section id="arbeitsweise" style={{ borderTop: '1px solid var(--bc-line)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 24,
          flexWrap: 'wrap',
          marginBottom: 'clamp(40px, 6vw, 72px)',
        }}
      >
        <div style={{ maxWidth: 620 }}>
          <SectionTag>Arbeitsweise</SectionTag>
          <h2
            className="bc-display"
            style={{ fontSize: 'clamp(36px, 5.5vw, 72px)', marginTop: 20 }}
          >
            Vom Signal zur Welle
          </h2>
        </div>
        <p
          style={{
            maxWidth: 380,
            color: 'var(--bc-fg-muted)',
            fontSize: 15,
            lineHeight: 1.6,
          }}
        >
          Drei Bewegungen, ein durchgehendes Signal — von der ersten Analyse bis
          zur lebendigen Community.
        </p>
      </div>

      <div className="bc-process-grid">
        {STEPS.map((s) => (
          <article
            key={s.n}
            style={{
              borderTop: '1px solid var(--bc-line-strong)',
              paddingTop: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              minHeight: 260,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--bc-font-mono)',
                  fontSize: 40,
                  color: 'var(--bc-accent)',
                  lineHeight: 1,
                }}
              >
                {s.n}
              </span>
              <Mono>{s.kicker}</Mono>
            </div>
            <h3
              style={{
                fontSize: 26,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                marginTop: 'auto',
              }}
            >
              {s.title}
            </h3>
            <p
              style={{
                color: 'var(--bc-fg-muted)',
                fontSize: 15,
                lineHeight: 1.6,
              }}
            >
              {s.body}
            </p>
          </article>
        ))}
      </div>

      <style>{`
        .bc-process-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        @media (min-width: 800px) {
          .bc-process-grid { grid-template-columns: repeat(3, 1fr); gap: 40px; }
        }
      `}</style>
    </Section>
  )
}
