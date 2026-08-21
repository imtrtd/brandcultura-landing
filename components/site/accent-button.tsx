'use client'

import type { CSSProperties } from 'react'
import { Button, type ButtonProps } from '@primer/react'

/**
 * Primer primary Button re-skinned to the brandcultura acid-lime accent by
 * overriding Primer's own `--button-primary-*` design tokens (rather than
 * fighting the component's internal styles with sx background overrides).
 */
const accentTokens = {
  '--button-primary-bgColor-rest': 'var(--bc-accent)',
  '--button-primary-bgColor-hover': '#c6e22f',
  '--button-primary-bgColor-active': '#bcd826',
  '--button-primary-bgColor-disabled': 'var(--bc-accent-dim)',
  '--button-primary-fgColor-rest': 'var(--bc-accent-ink)',
  '--button-primary-fgColor-disabled': 'var(--bc-fg-subtle)',
  '--button-primary-iconColor-rest': 'var(--bc-accent-ink)',
  '--button-primary-borderColor-rest': 'var(--bc-accent)',
  '--button-primary-borderColor-hover': '#c6e22f',
  '--button-primary-borderColor-active': '#bcd826',
  fontWeight: 600,
} as CSSProperties

export function AccentButton({ style, ...props }: ButtonProps) {
  return (
    <Button
      variant="primary"
      {...props}
      style={{ ...accentTokens, ...style }}
    />
  )
}
