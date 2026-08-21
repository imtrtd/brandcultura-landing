'use client'

const WORDS = ['VON DIR', 'FÜR ALLE', 'SHAPE YOUR SOUND', 'DE 26']

export function Marquee() {
  const row = [...WORDS, ...WORDS, ...WORDS, ...WORDS]
  return (
    <div
      aria-hidden="true"
      style={{
        borderTop: '1px solid var(--bc-line)',
        borderBottom: '1px solid var(--bc-line)',
        overflow: 'hidden',
        background: 'var(--bc-bg-2)',
        paddingBlock: 22,
      }}
    >
      <div
        className="bc-marquee-track"
        style={{
          display: 'flex',
          width: 'max-content',
          gap: 40,
          animation: 'bc-marquee 26s linear infinite',
        }}
      >
        {row.map((w, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 40,
              fontFamily: 'var(--bc-font-display)',
              fontWeight: 600,
              fontSize: 'clamp(28px, 4vw, 52px)',
              letterSpacing: '-0.02em',
              color: i % 4 === 2 ? 'var(--bc-accent)' : 'var(--bc-fg)',
              whiteSpace: 'nowrap',
            }}
          >
            {w}
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--bc-red)',
              }}
            />
          </span>
        ))}
      </div>
    </div>
  )
}
