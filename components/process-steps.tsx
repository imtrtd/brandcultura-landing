'use client'

import { useLocale } from './locale-provider'
import { Reveal } from './reveal'

export function ProcessSteps() {
  const { copy } = useLocale()
  const t = copy.process

  return (
    <section
      aria-labelledby="arbeitsweise-heading"
      className="mx-auto mt-6 max-w-6xl px-4 py-12 sm:mt-10 sm:px-5 sm:py-16 md:px-8"
    >
      <Reveal>
        <div className="flex flex-col gap-4">
          <span className="label-mono text-muted-foreground">{t.label}</span>
          <h2
            id="arbeitsweise-heading"
            className="display max-w-2xl text-pretty text-3xl font-bold text-foreground sm:text-4xl md:text-5xl"
          >
            {t.title}
          </h2>
          <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">{t.intro}</p>
        </div>
      </Reveal>

      {/* animated timeline connector (desktop) */}
      <Reveal delay={80}>
        <div className="mt-10 hidden items-center gap-3 md:flex" aria-hidden>
          {t.steps.map((step, i) => (
            <div key={`node-${step[0]}`} className="flex flex-1 items-center gap-3">
              <span
                className={`node-pulse grid h-9 w-9 shrink-0 place-items-center border border-lime bg-background font-mono text-xs text-lime ${
                  i === 2 ? 'rounded-[18px]' : 'rounded-full'
                }`}
              >
                {step[0]}
              </span>
              {i < t.steps.length - 1 && <span className="timeline-track h-px flex-1 bg-border" />}
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-6 md:grid-cols-3">
        {t.steps.map((step, i) => (
          <Reveal key={step[0]} delay={i * 90}>
            <div className="carbon-panel flex min-h-full flex-col gap-4 p-5 transition-colors hover:border-lime sm:min-h-64 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="node-pulse grid h-8 w-8 place-items-center rounded-full border border-lime font-mono text-xs text-lime md:hidden">
                  {step[0]}
                </span>
                <span className="label-mono hidden text-muted-foreground md:block">{step[0]}</span>
                <span className="label-mono rounded-sm border border-border px-2 py-1 text-lime">{step[3]}</span>
              </div>
              <h3 className="text-xl font-semibold leading-tight text-lime sm:text-2xl">{step[1]}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step[2]}</p>
              <span className="mt-auto block h-1 w-full origin-left bg-gradient-to-r from-lime/70 to-transparent" aria-hidden />
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={260}>
        <div className="relative mt-3 flex min-h-40 items-center justify-between overflow-hidden bg-orange p-6 sm:min-h-44 sm:p-8">
          <span className="display whitespace-pre-line text-3xl font-extrabold leading-none text-background sm:text-5xl">
            {t.accent}
          </span>
          <div className="flex h-full flex-col items-end justify-between gap-6 self-stretch">
            <span className="label-mono text-background/80">DE 26</span>
            <div className="flex items-end gap-[3px]" aria-hidden>
              {Array.from({ length: 10 }).map((_, i) => (
                <span
                  key={i}
                  className="eq-bar block w-1 rounded-sm bg-background/80"
                  style={{
                    height: `${16 + Math.abs(Math.sin(i * 1.7)) * 26}px`,
                    animationDelay: `${(i % 6) * 110}ms`,
                    animationDuration: `${820 + (i % 4) * 160}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
