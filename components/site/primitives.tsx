'use client'

import type { ReactNode, CSSProperties } from 'react'

/** Small uppercase monospaced eyebrow label used across sections. */
export function Mono({
  children,
  accent,
  style,
}: {
  children: ReactNode
  accent?: boolean
  style?: CSSProperties
}) {
  return (
    <span
      className="bc-mono"
      style={{ color: accent ? 'var(--bc-accent)' : undefined, ...style }}
    >
      {children}
    </span>
  )
}

/** A bracketed section tag: [ Arbeitsweise ] */
export function SectionTag({ children }: { children: ReactNode }) {
  return (
    <span className="bc-mono" style={{ color: 'var(--bc-fg-muted)' }}>
      [ {children} ]
    </span>
  )
}

/** Full-bleed hairline divider constrained to the content shell. */
export function Rule() {
  return <hr className="bc-rule" />
}

/** Section wrapper: vertical rhythm + centered content shell. */
export function Section({
  children,
  id,
  style,
}: {
  children: ReactNode
  id?: string
  style?: CSSProperties
}) {
  return (
    <section
      id={id}
      style={{
        paddingTop: 'clamp(64px, 9vw, 128px)',
        paddingBottom: 'clamp(64px, 9vw, 128px)',
        ...style,
      }}
    >
      <div className="bc-shell">{children}</div>
    </section>
  )
}
