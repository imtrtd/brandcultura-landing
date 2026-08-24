'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Reveal } from './reveal'
import { useLocale, type Locale } from './locale-provider'
import { cn } from '@/lib/utils'
import {
  FACTORY,
  LOOP_BAR_OPTIONS,
  PATTERN_SLOTS,
  STEPS,
  TRACKS,
  TRACK_COUNT,
  armRecord,
  boot,
  cancelRecord,
  clearLayers,
  clonePattern,
  emptyPattern,
  getAnalyser,
  makeFactoryPatterns,
  peakHz,
  setEvents,
  setLive,
  setMic as setEngineMic,
  startTransport,
  stopTransport,
  triggerPad,
  undoLayer,
  type LoopState,
  type Pattern,
  type Vel,
} from '@/lib/signal'

const COPY: Record<
  Locale,
  {
    title: string
    unlock: string
    play: string
    stop: string
    rec: string
    overdub: string
    undo: string
    clear: string
    bars: string
    mic: string
    printKit: string
    tap: string
    click: string
    armed: string
    recording: string
    layers: string
    empty: string
    kit: string
    loop: string
    mute: string
    copy: string
  }
> = {
  de: {
    title: 'DRUM MACHINE + LOOPER',
    unlock: 'Play · Audio entsperren',
    play: 'Play',
    stop: 'Stop',
    rec: 'Rec',
    overdub: 'Overdub',
    undo: 'Zurück',
    clear: 'Leeren',
    bars: 'Takte',
    mic: 'Mic',
    printKit: 'Kit drucken',
    tap: 'Tap',
    click: 'Click',
    armed: 'scharf · nächster Takt',
    recording: 'nimmt auf',
    layers: 'Ebenen',
    empty: 'Keine Ebenen. Rec scharf — druckt den nächsten Zyklus.',
    kit: 'Kit',
    loop: 'Loop',
    mute: 'Mute',
    copy: 'Kopieren →',
  },
  en: {
    title: 'DRUM MACHINE + LOOPER',
    unlock: 'Play · unlock audio',
    play: 'Play',
    stop: 'Stop',
    rec: 'Rec',
    overdub: 'Overdub',
    undo: 'Undo',
    clear: 'Clear',
    bars: 'bars',
    mic: 'Mic',
    printKit: 'Print kit',
    tap: 'Tap',
    click: 'Click',
    armed: 'armed · next bar',
    recording: 'recording',
    layers: 'layers',
    empty: 'No layers. Arm rec — prints the next cycle.',
    kit: 'Kit',
    loop: 'Loop',
    mute: 'Mute',
    copy: 'Copy →',
  },
  ru: {
    title: 'DRUM MACHINE + LOOPER',
    unlock: 'Play · разблокировать звук',
    play: 'Play',
    stop: 'Stop',
    rec: 'Rec',
    overdub: 'Овердаб',
    undo: 'Отмена',
    clear: 'Сброс',
    bars: 'такта',
    mic: 'Mic',
    printKit: 'Печать кита',
    tap: 'Tap',
    click: 'Click',
    armed: 'взвод · следующий бар',
    recording: 'запись',
    layers: 'слои',
    empty: 'Нет слоёв. Взведите rec — печать следующего цикла.',
    kit: 'Kit',
    loop: 'Loop',
    mute: 'Mute',
    copy: 'Копия →',
  },
}

export function DrumMachine() {
  const { locale } = useLocale()
  const copy = COPY[locale]
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [step, setStep] = useState(0)
  const [bpm, setBpm] = useState(FACTORY[0].bpm)
  const [swing, setSwing] = useState(FACTORY[0].swing)
  const [click, setClick] = useState(false)
  const [slot, setSlot] = useState(0)
  const [patterns, setPatterns] = useState<Pattern[]>(() => makeFactoryPatterns())
  const [mutes, setMutes] = useState(() => Array.from({ length: TRACK_COUNT }, () => false))
  const [volumes] = useState(() => [0.9, 0.7, 0.82, 0.75, 0.7, 0.55, 0.5, 0.45])
  const [loopBars, setLoopBars] = useState(2)
  const [loopState, setLoopState] = useState<LoopState>('idle')
  const [loopProgress, setLoopProgress] = useState(0)
  const [loopLayers, setLoopLayers] = useState(0)
  const [includeKit, setIncludeKit] = useState(true)
  const [micOn, setMicOn] = useState(false)
  const [micDenied, setMicDenied] = useState(false)
  const [hz, setHz] = useState(440)
  const tapTimes = useRef<number[]>([])
  const booting = useRef<Promise<void> | null>(null)
  const readyRef = useRef(false)

  const pattern = patterns[slot]

  const syncLive = useCallback(
    (next?: Partial<Parameters<typeof setLive>[0]>) => {
      setLive({
        pattern: next?.pattern ?? pattern,
        mutes: next?.mutes ?? mutes,
        volumes: next?.volumes ?? volumes,
        bpm: next?.bpm ?? bpm,
        swing: next?.swing ?? swing,
        click: next?.click ?? click,
        loopBars: next?.loopBars ?? loopBars,
        includeKit: next?.includeKit ?? includeKit,
        ...next,
      })
    },
    [pattern, mutes, volumes, bpm, swing, click, loopBars, includeKit],
  )

  useEffect(() => {
    setEvents({
      onStep: setStep,
      onPlaying: setPlaying,
      onLoopState: setLoopState,
      onLoopProgress: setLoopProgress,
      onLoopLayers: setLoopLayers,
      onMic: (on, denied) => {
        setMicOn(on)
        setMicDenied(denied)
      },
    })
    return () => setEvents({ onStep: undefined, onPlaying: undefined, onLoopState: undefined, onLoopProgress: undefined, onLoopLayers: undefined, onMic: undefined })
  }, [])

  useEffect(() => {
    syncLive()
  }, [syncLive])

  const ensure = useCallback(async () => {
    if (readyRef.current) return
    if (booting.current) {
      await booting.current
      return
    }
    const run = (async () => {
      await boot()
      readyRef.current = true
      setReady(true)
    })()
    booting.current = run
    try {
      await run
    } finally {
      booting.current = null
    }
  }, [])

  const togglePlay = useCallback(() => {
    void (async () => {
      await ensure()
      if (playing) stopTransport()
      else startTransport()
    })()
  }, [ensure, playing])

  const firePad = useCallback(
    (i: number) => {
      void (async () => {
        await ensure()
        triggerPad(i, 1)
      })()
    },
    [ensure],
  )

  const fireRec = useCallback(() => {
    void (async () => {
      await ensure()
      if (loopState === 'idle') armRecord()
      else cancelRecord()
    })()
  }, [ensure, loopState])

  const tapTempo = useCallback(() => {
    const now = performance.now()
    const arr = tapTimes.current.filter((t0) => now - t0 < 2500)
    arr.push(now)
    tapTimes.current = arr
    if (arr.length < 2) return
    const spans = arr.slice(1).map((t0, i) => t0 - arr[i])
    const avg = spans.reduce((a, b) => a + b, 0) / spans.length
    setBpm(Math.min(180, Math.max(60, Math.round(60000 / avg))))
  }, [])

  const cycleCell = (ti: number, si: number) => {
    setPatterns((prev) => {
      const next = prev.map(clonePattern)
      const row = next[slot][ti]
      row[si] = (((row[si] as number) + 1) % 3) as Vel
      return next
    })
  }

  useEffect(() => {
    if (!ready) return
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      const k = e.key.toLowerCase()
      if (k === ' ') {
        e.preventDefault()
        togglePlay()
        return
      }
      if (k === 'r') {
        e.preventDefault()
        fireRec()
        return
      }
      if (k === 'u') {
        e.preventDefault()
        undoLayer()
        return
      }
      if (k >= '1' && k <= '4') {
        const i = Number(k) - 1
        setSlot(i)
        setBpm(FACTORY[i].bpm)
        setSwing(FACTORY[i].swing)
        setStep(0)
        return
      }
      const pad = TRACKS.findIndex((tr) => tr.key === k)
      if (pad >= 0) {
        e.preventDefault()
        firePad(pad)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [ready, togglePlay, fireRec, firePad])

  const recLabel =
    loopState === 'recording' ? copy.recording : loopState === 'armed' ? copy.armed : loopLayers ? copy.overdub : copy.rec

  return (
    <Reveal delay={160} className="mt-10 sm:mt-14">
      <div id="signal" className="border border-border bg-background overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2 sm:px-5">
          <div className="flex items-center gap-3">
            <span className="label-mono text-lime">{copy.title}</span>
            <span className="label-mono hidden text-muted-foreground sm:inline">{ready ? 'v1 · SIGNAL' : copy.unlock}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="label-mono text-muted-foreground">{bpm} BPM</span>
            <HzMeter hz={hz} setHz={setHz} ready={ready} />
            <span className="label-mono text-lime">{String(step + 1).padStart(2, '0')} / 16</span>
          </div>
        </div>

        <MiniSpec ready={ready} />

        <div className="grid grid-cols-1 border-b border-border lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="border-b border-border p-3 sm:p-4 lg:border-b-0 lg:border-r">
            <div className="mb-2 flex items-center justify-between">
              <span className="label-mono text-muted-foreground">03 · {copy.kit}</span>
              <span className="label-mono hidden text-muted-foreground md:inline">{FACTORY[slot]?.name}</span>
            </div>
            <div className="w-full overflow-x-auto overscroll-x-contain">
              <div className="min-w-[520px]">
                {TRACKS.map((tr, ti) => (
                  <div key={tr.id} className="mb-1 grid grid-cols-[3.4rem_repeat(16,minmax(0,1fr))] items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setMutes((m) => {
                          const next = m.slice()
                          next[ti] = !next[ti]
                          return next
                        })
                      }
                      className={cn(
                        'h-8 text-left font-mono text-[10px] tracking-[0.12em] sm:h-9',
                        mutes[ti] ? 'text-muted-foreground line-through' : 'text-foreground',
                      )}
                      title={copy.mute}
                    >
                      {tr.label}
                    </button>
                    {Array.from({ length: STEPS }, (_, si) => {
                      const v = pattern[ti][si]
                      const onBeat = si % 4 === 0
                      const isPlay = playing && si === step
                      return (
                        <button
                          key={si}
                          type="button"
                          onClick={() => cycleCell(ti, si)}
                          aria-pressed={v > 0}
                          className={cn(
                            'h-8 border transition-colors duration-75 sm:h-9',
                            v > 0
                              ? 'border-lime bg-lime'
                              : onBeat
                                ? 'border-lime/40 bg-lime/10'
                                : 'border-border bg-background',
                            v === 2 && 'shadow-[inset_0_0_0_2px_var(--background)]',
                            isPlay && 'ring-1 ring-lime',
                          )}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-1 sm:grid-cols-8">
              {TRACKS.map((tr, i) => (
                <button
                  key={tr.id}
                  type="button"
                  disabled={mutes[i]}
                  onPointerDown={(e) => {
                    e.preventDefault()
                    firePad(i)
                  }}
                  className="flex min-h-11 flex-col items-center justify-center border border-border bg-background font-mono text-[10px] uppercase text-foreground transition-colors active:bg-lime active:text-lime-foreground disabled:opacity-30"
                >
                  {tr.label}
                  <span className="mt-0.5 text-[9px] text-muted-foreground">{tr.key}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="label-mono text-muted-foreground">02 · {copy.loop}</span>
              <span className="label-mono text-muted-foreground tabular-nums">
                {loopLayers} {copy.layers}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={fireRec}
                className={cn(
                  'relative min-h-12 flex-1 overflow-hidden border font-mono text-[11px] uppercase tracking-[0.2em]',
                  loopState === 'idle' ? 'border-destructive text-destructive' : 'border-destructive bg-destructive text-foreground',
                )}
              >
                <span
                  className="absolute inset-y-0 left-0 bg-destructive/30"
                  style={{ width: `${loopState === 'recording' ? loopProgress * 100 : 0}%` }}
                />
                <span className="relative">{recLabel}</span>
              </button>
              <button
                type="button"
                onClick={() => undoLayer()}
                disabled={loopLayers === 0}
                className="min-h-12 border border-border px-3 label-mono text-muted-foreground disabled:opacity-30 hover:border-lime hover:text-foreground"
              >
                {copy.undo}
              </button>
              <button
                type="button"
                onClick={() => clearLayers()}
                disabled={loopLayers === 0}
                className="min-h-12 border border-border px-3 label-mono text-muted-foreground disabled:opacity-30 hover:border-lime hover:text-foreground"
              >
                {copy.clear}
              </button>
            </div>
            <div className="flex gap-1">
              {LOOP_BAR_OPTIONS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setLoopBars(b)}
                  className={cn(
                    'min-h-10 flex-1 border font-mono text-[11px] tabular-nums',
                    loopBars === b ? 'border-lime bg-lime text-lime-foreground' : 'border-border text-muted-foreground',
                  )}
                >
                  {b}
                </button>
              ))}
              <span className="flex min-h-10 items-center px-2 label-mono text-muted-foreground">{copy.bars}</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => void (async () => { await ensure(); await setEngineMic(!micOn) })()}
                className={cn(
                  'min-h-10 flex-1 border label-mono',
                  micOn ? 'border-lime text-lime' : 'border-border text-muted-foreground',
                )}
              >
                {copy.mic} {micOn ? 'ON' : 'OFF'}
              </button>
              <button
                type="button"
                onClick={() => setIncludeKit((v) => !v)}
                className={cn(
                  'min-h-10 flex-1 border label-mono',
                  includeKit ? 'border-lime text-lime' : 'border-border text-muted-foreground',
                )}
              >
                {copy.printKit}
              </button>
            </div>
            <p className="font-mono text-[10px] leading-relaxed text-muted-foreground">
              {micDenied ? 'Mic blocked — print kit still records.' : loopLayers === 0 ? copy.empty : copy.printKit}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 p-3 sm:gap-3 sm:p-4">
          <button
            type="button"
            onClick={togglePlay}
            className={cn(
              'min-h-11 min-w-20 px-4 label-mono text-sm font-semibold',
              playing ? 'border border-lime bg-background text-lime' : 'bg-lime text-lime-foreground',
            )}
          >
            {playing ? copy.stop : copy.play}
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setBpm((b) => Math.max(60, b - 5))}
              className="min-h-9 min-w-9 border border-border label-mono text-sm hover:border-lime"
            >
              −
            </button>
            <span className="label-mono w-12 text-center text-foreground">{bpm}</span>
            <button
              type="button"
              onClick={() => setBpm((b) => Math.min(180, b + 5))}
              className="min-h-9 min-w-9 border border-border label-mono text-sm hover:border-lime"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={tapTempo}
            className="min-h-11 border border-border px-3 label-mono text-muted-foreground hover:border-lime hover:text-foreground"
          >
            {copy.tap}
          </button>
          <label className="flex min-w-36 flex-1 items-center gap-2 label-mono text-muted-foreground">
            Swing
            <input
              type="range"
              min={0}
              max={45}
              value={Math.round(swing * 100)}
              onChange={(e) => setSwing(Number(e.target.value) / 100)}
              className="h-1 w-full accent-lime"
            />
            <span className="w-8 tabular-nums text-foreground">{Math.round(swing * 100)}</span>
          </label>
          <div className="flex gap-1">
            {Array.from({ length: PATTERN_SLOTS }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setSlot(i)
                  setBpm(FACTORY[i].bpm)
                  setSwing(FACTORY[i].swing)
                  setStep(0)
                }}
                className={cn(
                  'min-h-11 min-w-11 border font-mono text-[11px] tabular-nums',
                  slot === i ? 'border-lime bg-lime text-lime-foreground' : 'border-border text-muted-foreground hover:text-foreground',
                )}
              >
                {String(i + 1).padStart(2, '0')}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              setPatterns((prev) => {
                const next = prev.map(clonePattern)
                next[slot] = emptyPattern()
                return next
              })
            }
            className="min-h-11 border border-border px-3 label-mono text-muted-foreground hover:border-lime hover:text-foreground"
          >
            {copy.clear}
          </button>
          <button
            type="button"
            onClick={() =>
              setPatterns((prev) => {
                const next = prev.map(clonePattern)
                const n = (slot + 1) % PATTERN_SLOTS
                next[n] = clonePattern(next[slot])
                return next
              })
            }
            className="min-h-11 border border-border px-3 label-mono text-muted-foreground hover:border-lime hover:text-foreground"
          >
            {copy.copy}
          </button>
          <button
            type="button"
            onClick={() => setClick((v) => !v)}
            className={cn(
              'min-h-11 border px-3 label-mono',
              click ? 'border-lime text-lime' : 'border-border text-muted-foreground',
            )}
          >
            {copy.click}
          </button>
        </div>
      </div>
    </Reveal>
  )
}

function HzMeter({ hz, setHz, ready }: { hz: number; setHz: (n: number) => void; ready: boolean }) {
  useEffect(() => {
    if (!ready) return
    let raf = 0
    let last = 0
    const loop = () => {
      const next = peakHz()
      if (Math.abs(next - last) > 4) {
        last = next
        setHz(next || 0)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [ready, setHz])
  const label = hz <= 0 ? '— Hz' : hz >= 1000 ? `${(hz / 1000).toFixed(1)} kHz` : `${Math.round(hz)} Hz`
  return <span className="label-mono hidden text-lime sm:inline">{label}</span>
}

function MiniSpec({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf = 0
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr)
        canvas.height = Math.floor(h * dpr)
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, w, h)
      const an = getAnalyser()
      if (an && ready) {
        const bins = new Uint8Array(an.frequencyBinCount)
        an.getByteFrequencyData(bins)
        const n = bins.length
        const barW = w / n
        ctx.fillStyle = 'oklch(0.895 0.19 118)'
        for (let i = 0; i < n; i++) {
          const nrm = bins[i] / 255
          if (nrm < 0.04) continue
          ctx.globalAlpha = nrm < 0.3 ? 0.35 : nrm < 0.6 ? 0.65 : 0.95
          ctx.fillRect(i * barW, h - nrm * h * 0.92, Math.max(1, barW - 0.5), nrm * h * 0.92)
        }
        ctx.globalAlpha = 1
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [ready])
  return <canvas ref={ref} className="block h-16 w-full border-b border-border sm:h-20" aria-hidden />
}
