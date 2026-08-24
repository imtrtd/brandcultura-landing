'use client'

import { useState, useRef, useEffect } from 'react'
import { Reveal } from './reveal'

const PADS = [
  { id: 1, name: 'KICK', active: true },
  { id: 2, name: 'SNARE', active: false },
  { id: 3, name: 'HH', active: true },
  { id: 4, name: 'OH', active: false },
  { id: 5, name: 'CLAP', active: false },
  { id: 6, name: 'TOM', active: true },
  { id: 7, name: 'PERC', active: false },
  { id: 8, name: 'SHAKER', active: true },
  { id: 9, name: 'RIM', active: false },
  { id: 10, name: '808', active: false },
  { id: 11, name: 'CRASH', active: false },
  { id: 12, name: 'SUB', active: true },
  { id: 13, name: 'NOISE', active: false },
  { id: 14, name: 'FX1', active: false },
  { id: 15, name: 'FX2', active: false },
  { id: 16, name: 'SNAP', active: false },
]

export function DrumMachine() {
  const [activePads, setActivePads] = useState<Set<number>>(new Set([1, 3, 6, 8, 12]))
  const [isPlaying, setIsPlaying] = useState(false)
  const [bpm, setBpm] = useState(120)
  const [step, setStep] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isPlaying) {
      const ms = (60 / bpm) * 1000 / 4 // 16th notes
      intervalRef.current = setInterval(() => {
        setStep((s) => (s + 1) % 16)
      }, ms)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, bpm])

  function togglePad(id: number) {
    setActivePads((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <Reveal delay={160} className="mt-10 sm:mt-14">
      <div className="border border-border bg-background overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-border px-4 py-2 sm:px-5">
          <div className="flex items-center gap-3">
            <span className="label-mono text-lime">DRUM MACHINE + LOOPER</span>
            <span className="label-mono text-muted-foreground hidden sm:inline">v0.1 · BRUTAL</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="label-mono text-muted-foreground">{bpm} BPM</span>
            <span className="label-mono text-lime">{String(step + 1).padStart(2, '0')} / 16</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Pads */}
          <div className="border-b border-border lg:border-b-0 lg:border-r p-4 sm:p-5">
            <div className="label-mono mb-3 text-muted-foreground">PADS · 4×4</div>
            <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
              {PADS.map((pad) => {
                const isActive = activePads.has(pad.id)
                const isCurrent = isPlaying && (step % 4 === (pad.id - 1) % 4)
                return (
                  <button
                    key={pad.id}
                    type="button"
                    onClick={() => togglePad(pad.id)}
                    className={`aspect-square flex flex-col items-center justify-center border transition-colors ${
                      isActive
                        ? 'bg-lime text-lime-foreground border-lime'
                        : 'bg-background border-border text-muted-foreground hover:border-lime/50 hover:text-foreground'
                    } ${isCurrent ? 'ring-1 ring-lime' : ''}`}
                  >
                    <span className="text-[10px] font-mono opacity-70">{String(pad.id).padStart(2, '0')}</span>
                    <span className="label-mono text-[9px] sm:text-[10px] mt-0.5">{pad.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Looper + Transport */}
          <div className="p-4 sm:p-5 flex flex-col">
            <div className="label-mono mb-3 text-muted-foreground">LOOPER / SEQUENCER</div>

            {/* Step indicators */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-8 flex-1 border ${
                    i === step && isPlaying
                      ? 'bg-lime border-lime'
                      : i % 4 === 0
                        ? 'border-lime/40 bg-lime/10'
                        : 'border-border bg-background'
                  }`}
                />
              ))}
            </div>

            {/* Transport */}
            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`min-h-11 min-w-20 px-4 label-mono text-sm font-semibold transition-colors ${
                  isPlaying
                    ? 'bg-background border border-lime text-lime'
                    : 'bg-lime text-lime-foreground'
                }`}
              >
                {isPlaying ? 'STOP' : 'PLAY'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false)
                  setStep(0)
                  setActivePads(new Set([1, 3, 6, 8, 12]))
                }}
                className="min-h-11 px-4 border border-border label-mono text-sm text-muted-foreground hover:border-lime hover:text-foreground transition-colors"
              >
                CLEAR
              </button>
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBpm((b) => Math.max(60, b - 5))}
                  className="min-h-9 min-w-9 border border-border label-mono text-sm hover:border-lime"
                >
                  −
                </button>
                <span className="label-mono text-foreground w-12 text-center">{bpm}</span>
                <button
                  type="button"
                  onClick={() => setBpm((b) => Math.min(180, b + 5))}
                  className="min-h-9 min-w-9 border border-border label-mono text-sm hover:border-lime"
                >
                  +
                </button>
              </div>
            </div>

            {/* Status */}
            <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
              <span className="label-mono text-muted-foreground">PATTERN 01</span>
              <span className="label-mono text-lime">{isPlaying ? 'PLAYING' : 'READY'}</span>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  )
}
