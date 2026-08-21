'use client'

import { Section, SectionTag, Mono } from './primitives'
import { CodeIcon, ZapIcon, LinkExternalIcon } from '@primer/octicons-react'

const MEMBERS = [
  {
    role: 'DEVELOPER · I/TD',
    name: 'imtryingtodesign',
    icon: CodeIcon,
    body: 'Technische Architektur und Design-System. Baut die strukturierte Seite — Systeme, die Performance und Form zusammenhalten.',
    link: 'imtryingtodesign.com',
    href: 'https://imtryingtodesign.com',
  },
  {
    role: 'SPIRITUAL EXPEDITOR',
    name: 'NAMENLOS TATTOO',
    icon: ZapIcon,
    body: 'Zerlegt in Komponenten, um neu zusammenzusetzen. Roh, präzise — nimmt auseinander, was später als Ganzes auf der Haut trägt.',
    link: 'NAMENLOS',
    href: '#kontakt',
  },
]

export function Team() {
  return (
    <Section id="dna" style={{ borderTop: '1px solid var(--bc-line)' }}>
      <SectionTag>System DNA</SectionTag>

      <div className="bc-team-grid">
        {MEMBERS.map((m) => {
          const Icon = m.icon
          return (
            <article
              key={m.name}
              style={{
                border: '1px solid var(--bc-line)',
                borderRadius: 16,
                background: 'var(--bc-surface)',
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: 'var(--bc-accent-dim)',
                    color: 'var(--bc-accent)',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Icon size={18} />
                </span>
                <Mono>{m.role}</Mono>
              </div>

              <h3
                style={{
                  fontSize: 30,
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                }}
              >
                {m.name}
              </h3>
              <p
                style={{
                  color: 'var(--bc-fg-muted)',
                  fontSize: 15,
                  lineHeight: 1.65,
                }}
              >
                {m.body}
              </p>
              <a
                href={m.href}
                className="bc-link-underline"
                style={{
                  marginTop: 'auto',
                  fontFamily: 'var(--bc-font-mono)',
                  fontSize: 13,
                  color: 'var(--bc-accent)',
                }}
              >
                {m.link} <LinkExternalIcon size={14} />
              </a>
            </article>
          )
        })}
      </div>

      <style>{`
        .bc-team-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-top: 40px;
        }
        @media (min-width: 800px) {
          .bc-team-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </Section>
  )
}
