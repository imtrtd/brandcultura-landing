'use client'

import { useState } from 'react'
import { ArrowRightIcon } from '@primer/octicons-react'
import { AccentButton } from './accent-button'

const NAV = [
  { label: 'Sound ↔ Skin', href: '#sound-skin' },
  { label: 'Spektrogramm', href: '#spektrogramm' },
  { label: 'SHAPE', href: '#shape' },
  { label: 'DNA', href: '#dna' },
  { label: 'Kontakt', href: '#kontakt' },
]

const LANGS = ['de', 'en', 'ru'] as const

export function SiteHeader() {
  const [lang, setLang] = useState<(typeof LANGS)[number]>('de')

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--bc-line)',
        background: 'color-mix(in srgb, var(--bc-bg) 82%, transparent)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div
        className="bc-shell"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          height: 64,
        }}
      >
        {/* Wordmark */}
        <a
          href="#top"
          style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: 6,
            textDecoration: 'none',
            color: 'var(--bc-fg)',
          }}
        >
          <span
            style={{
              fontWeight: 600,
              letterSpacing: '-0.02em',
              fontSize: 17,
            }}
          >
            brandcultura
          </span>
          <span
            className="bc-mono"
            style={{ fontSize: 10, color: 'var(--bc-fg-subtle)' }}
          >
            agency
          </span>
        </a>

        {/* Center nav */}
        <nav
          aria-label="Primär"
          style={{
            display: 'none',
            alignItems: 'center',
            gap: 28,
          }}
          className="bc-nav-desktop"
        >
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="bc-mono"
              style={{
                color: 'var(--bc-fg-muted)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--bc-fg)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--bc-fg-muted)'
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            role="group"
            aria-label="Sprache"
            style={{ display: 'flex', alignItems: 'center', gap: 2 }}
          >
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className="bc-mono"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 6px',
                  color:
                    lang === l ? 'var(--bc-accent)' : 'var(--bc-fg-subtle)',
                }}
              >
                {l}
              </button>
            ))}
          </div>

          <AccentButton
            trailingVisual={ArrowRightIcon}
            size="small"
            onClick={() => {
              document
                .querySelector('#kontakt')
                ?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Projekt starten
          </AccentButton>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .bc-nav-desktop { display: flex !important; }
        }
      `}</style>
    </header>
  )
}
