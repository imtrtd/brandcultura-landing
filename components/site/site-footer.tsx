'use client'

import { Mono } from './primitives'

export function SiteFooter() {
  return (
    <footer style={{ borderTop: '1px solid var(--bc-line)' }}>
      <div
        className="bc-shell"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          paddingBlock: 28,
        }}
      >
        <span
          style={{ fontWeight: 600, fontSize: 16, letterSpacing: '-0.02em' }}
        >
          brandcultura
        </span>
        <Mono>© 2026 · SHAPE YOUR SOUND</Mono>
      </div>
    </footer>
  )
}
