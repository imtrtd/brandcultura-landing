export const STEPS = 16
export const TRACK_COUNT = 8
export const PATTERN_SLOTS = 4
export const LOOP_BAR_OPTIONS = [1, 2, 4, 8] as const

export type Vel = 0 | 1 | 2
export type Pattern = Vel[][]
export type LoopState = 'idle' | 'armed' | 'recording'
export type TrackGroup = 'low' | 'mid' | 'high'

export const TRACKS = [
  { id: 'kick', label: 'KICK', group: 'low' as const, key: 'a' },
  { id: 'tom', label: 'TOM', group: 'low' as const, key: 's' },
  { id: 'snr', label: 'SNR', group: 'mid' as const, key: 'd' },
  { id: 'clap', label: 'CLAP', group: 'mid' as const, key: 'f' },
  { id: 'rim', label: 'RIM', group: 'mid' as const, key: 'g' },
  { id: 'chh', label: 'CHH', group: 'high' as const, key: 'h' },
  { id: 'ohh', label: 'OHH', group: 'high' as const, key: 'j' },
  { id: 'shkr', label: 'SHKR', group: 'high' as const, key: 'k' },
] as const

export type TrackId = (typeof TRACKS)[number]['id']

function row(src: string): Vel[] {
  const cells = src.replace(/\s+/g, '').split('')
  const out: Vel[] = []
  for (let i = 0; i < STEPS; i++) {
    const c = cells[i] ?? '.'
    out.push(c === 'X' ? 2 : c === 'x' ? 1 : 0)
  }
  return out
}

function kit(...rows: string[]): Pattern {
  const p = rows.slice(0, TRACK_COUNT).map(row)
  while (p.length < TRACK_COUNT) p.push(row('.'.repeat(STEPS)))
  return p
}

export function clonePattern(p: Pattern): Pattern {
  return p.map((r) => r.slice() as Vel[])
}

export function emptyPattern(): Pattern {
  return kit(
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
  )
}

export const FACTORY: { name: string; bpm: number; swing: number; pattern: Pattern }[] = [
  {
    name: '01 SIGNAL',
    bpm: 128,
    swing: 0.08,
    pattern: kit(
      'X...X...X...X.x.',
      '........x.......',
      '....X.......X...',
      '............X...',
      '..x...x...x...x.',
      'x.x.x.x.x.x.x.x.',
      '......x.......x.',
      '................',
    ),
  },
  {
    name: '02 BODY',
    bpm: 122,
    swing: 0.12,
    pattern: kit(
      'X.....X.X.....X.',
      '................',
      '................',
      '....X.......X...',
      '..............x.',
      'xxxxxxxxxxxxxxxx',
      '............x...',
      'x.x.x.x.x.x.x.x.',
    ),
  },
  {
    name: '03 SKIN',
    bpm: 90,
    swing: 0.22,
    pattern: kit(
      'X.........X.....',
      '......x.........',
      '....X.......X..x',
      '................',
      '..x...x.x.....x.',
      'x.x.x.x.x.x.x.Xx',
      '................',
      '....x.......x...',
    ),
  },
  {
    name: '04 WAVE',
    bpm: 140,
    swing: 0.06,
    pattern: kit(
      'X.x...X..x..X...',
      '.....x.......x..',
      '....X...x.X.X...',
      '..............X.',
      'x...x.x.x...x.x.',
      'x.x.x.Xxx.x.x.x.',
      '........x.......',
      '..x...x...x...x.',
    ),
  },
]

export function makeFactoryPatterns(): Pattern[] {
  return FACTORY.map((f) => clonePattern(f.pattern))
}

export type Live = {
  pattern: Pattern
  mutes: boolean[]
  volumes: number[]
  bpm: number
  swing: number
  click: boolean
  master: number
  muted: boolean
  loopBars: number
  includeKit: boolean
}

export type EngineEvents = {
  onStep: (step: number) => void
  onPlaying: (playing: boolean) => void
  onLoopState: (state: LoopState) => void
  onLoopProgress: (p: number) => void
  onLoopLayers: (n: number) => void
  onMic: (on: boolean, denied: boolean) => void
}

const live: Live = {
  pattern: clonePattern(FACTORY[0].pattern),
  mutes: Array.from({ length: TRACK_COUNT }, () => false),
  volumes: [0.9, 0.7, 0.82, 0.75, 0.7, 0.55, 0.5, 0.45],
  bpm: FACTORY[0].bpm,
  swing: FACTORY[0].swing,
  click: false,
  master: 0.85,
  muted: false,
  loopBars: 2,
  includeKit: true,
}

const events: Partial<EngineEvents> = {}

let ctx: AudioContext | null = null
let masterGain: GainNode | null = null
let kitGain: GainNode | null = null
let loopGain: GainNode | null = null
let recGain: GainNode | null = null
let clickGain: GainNode | null = null
let analyser: AnalyserNode | null = null
let noiseBuf: AudioBuffer | null = null
const trackGains: GainNode[] = []
let kitToRec = false
let booted = false
let playing = false
let currentStep = 0
let nextNoteTime = 0
let timer: number | null = null
let hatChoke: { stop: (t: number) => void } | null = null

type Layer = { source: AudioBufferSourceNode | null; buffer: AudioBuffer; recordedBpm: number }
const layers: Layer[] = []

let loopState: LoopState = 'idle'
let rec: MediaRecorder | null = null
let recChunks: Blob[] = []
let recTimer: number | null = null
let recStart = 0
let recDur = 0
let progressTimer: number | null = null
let micNode: MediaStreamAudioSourceNode | null = null
let micStream: MediaStream | null = null
let recCancelled = false
let recDest: MediaStreamAudioDestinationNode | null = null

const LOOKAHEAD_MS = 25
const SCHEDULE_AHEAD = 0.12

function snap(v: number) {
  return v * v
}

function makeNoise(ac: AudioContext) {
  const n = Math.floor(ac.sampleRate * 1.2)
  const buf = ac.createBuffer(1, n, ac.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1
  return buf
}

function envGain(ac: AudioContext, dest: AudioNode, time: number, peak: number, dur: number) {
  const g = ac.createGain()
  g.connect(dest)
  g.gain.setValueAtTime(Math.max(0.0001, peak), time)
  g.gain.exponentialRampToValueAtTime(0.0001, time + dur)
  return g
}

function fireKick(ac: AudioContext, dest: AudioNode, time: number, vel: number) {
  const v = 0.42 + vel * 0.58
  const osc = ac.createOscillator()
  osc.type = 'sine'
  const g = envGain(ac, dest, time, v, 0.36)
  osc.connect(g)
  osc.frequency.setValueAtTime(148, time)
  osc.frequency.exponentialRampToValueAtTime(42, time + 0.09)
  osc.start(time)
  osc.stop(time + 0.4)
  const click = ac.createBufferSource()
  click.buffer = noiseBuf
  const hp = ac.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 1600
  const cg = envGain(ac, dest, time, v * 0.28, 0.02)
  click.connect(hp)
  hp.connect(cg)
  click.start(time)
  click.stop(time + 0.03)
}

function fireTom(ac: AudioContext, dest: AudioNode, time: number, vel: number) {
  const osc = ac.createOscillator()
  osc.type = 'sine'
  const g = envGain(ac, dest, time, 0.35 + vel * 0.5, 0.28)
  osc.connect(g)
  osc.frequency.setValueAtTime(196, time)
  osc.frequency.exponentialRampToValueAtTime(90, time + 0.08)
  osc.start(time)
  osc.stop(time + 0.3)
}

function fireSnr(ac: AudioContext, dest: AudioNode, time: number, vel: number) {
  const v = 0.4 + vel * 0.55
  const body = ac.createOscillator()
  body.type = 'triangle'
  const bg = envGain(ac, dest, time, v * 0.55, 0.1)
  body.connect(bg)
  body.frequency.setValueAtTime(196, time)
  body.frequency.exponentialRampToValueAtTime(140, time + 0.06)
  body.start(time)
  body.stop(time + 0.14)
  const n = ac.createBufferSource()
  n.buffer = noiseBuf
  const bp = ac.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 1800
  bp.Q.value = 0.9
  const ng = envGain(ac, dest, time, v, 0.16)
  n.connect(bp)
  bp.connect(ng)
  n.start(time)
  n.stop(time + 0.18)
}

function fireClap(ac: AudioContext, dest: AudioNode, time: number, vel: number) {
  const v = 0.5 + vel * 0.45
  const bursts = [0, 0.012, 0.026, 0.048]
  bursts.forEach((d, i) => {
    const src = ac.createBufferSource()
    src.buffer = noiseBuf
    const bp = ac.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 1100
    bp.Q.value = 1.4
    const g = envGain(ac, dest, time + d, v * (1 - i * 0.2), 0.07)
    src.connect(bp)
    bp.connect(g)
    src.start(time + d)
    src.stop(time + d + 0.08)
  })
}

function fireRim(ac: AudioContext, dest: AudioNode, time: number, vel: number) {
  const osc = ac.createOscillator()
  osc.type = 'square'
  const hp = ac.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 900
  const g = envGain(ac, dest, time, 0.22 + vel * 0.4, 0.045)
  osc.connect(hp)
  hp.connect(g)
  osc.frequency.setValueAtTime(520, time)
  osc.start(time)
  osc.stop(time + 0.05)
}

function fireHat(ac: AudioContext, dest: AudioNode, time: number, vel: number, open: boolean) {
  if (hatChoke) hatChoke.stop(time)
  const src = ac.createBufferSource()
  src.buffer = noiseBuf
  const hp = ac.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = open ? 6000 : 8500
  const bp = ac.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 9000
  bp.Q.value = 0.85
  const dur = open ? 0.28 : 0.05
  const g = ac.createGain()
  src.connect(hp)
  hp.connect(bp)
  bp.connect(g)
  g.connect(dest)
  const v = 0.18 + vel * 0.32
  g.gain.setValueAtTime(v, time)
  g.gain.exponentialRampToValueAtTime(0.0001, time + dur)
  src.start(time)
  src.stop(time + dur + 0.02)
  const handle = {
    stop(t: number) {
      try {
        g.gain.cancelScheduledValues(t)
        g.gain.setValueAtTime(Math.max(0.0001, g.gain.value), t)
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.012)
        src.stop(t + 0.02)
      } catch {
        /* already */
      }
    },
  }
  if (open) hatChoke = handle
  else hatChoke = null
  return handle
}

function fireShaker(ac: AudioContext, dest: AudioNode, time: number, vel: number) {
  const src = ac.createBufferSource()
  src.buffer = noiseBuf
  const bp = ac.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 7000
  bp.Q.value = 1.1
  const g = envGain(ac, dest, time, 0.22 + vel * 0.35, 0.09)
  src.connect(bp)
  bp.connect(g)
  src.start(time)
  src.stop(time + 0.1)
}

function fireClick(ac: AudioContext, dest: AudioNode, time: number, accent: boolean) {
  const osc = ac.createOscillator()
  osc.type = 'sine'
  const g = envGain(ac, dest, time, accent ? 0.45 : 0.22, 0.04)
  osc.connect(g)
  osc.frequency.setValueAtTime(accent ? 1046 : 784, time)
  osc.start(time)
  osc.stop(time + 0.05)
}

function triggerVoice(track: number, time: number, vel: number) {
  if (!ctx) return
  const dest = trackGains[track]
  if (!dest) return
  if (track === 0) fireKick(ctx, dest, time, vel)
  else if (track === 1) fireTom(ctx, dest, time, vel)
  else if (track === 2) fireSnr(ctx, dest, time, vel)
  else if (track === 3) fireClap(ctx, dest, time, vel)
  else if (track === 4) fireRim(ctx, dest, time, vel)
  else if (track === 5) fireHat(ctx, dest, time, vel, false)
  else if (track === 6) fireHat(ctx, dest, time, vel, true)
  else fireShaker(ctx, dest, time, vel)
}

function applyMaster() {
  if (!masterGain || !ctx) return
  masterGain.gain.setTargetAtTime(live.muted ? 0 : snap(live.master), ctx.currentTime, 0.03)
}

function applyTracks() {
  if (!ctx) return
  trackGains.forEach((g, i) => {
    g.gain.setTargetAtTime(live.mutes[i] ? 0 : snap(live.volumes[i] ?? 0.8), ctx!.currentTime, 0.02)
  })
}

function applyIncludeKit() {
  if (!kitGain || !recGain) return
  try {
    if (live.includeKit && !kitToRec) {
      kitGain.connect(recGain)
      kitToRec = true
    } else if (!live.includeKit && kitToRec) {
      kitGain.disconnect(recGain)
      kitToRec = false
    }
  } catch {
    kitToRec = live.includeKit
  }
}

function pickMime() {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus']
  return types.find((t) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) ?? ''
}

function barsToSeconds(bars: number, bpm: number) {
  return (60 / bpm) * 4 * bars
}

function stopLayers(time?: number) {
  layers.forEach((layer) => {
    if (layer.source) {
      try {
        layer.source.stop(time)
      } catch {
        /* already */
      }
      layer.source = null
    }
  })
}

function startLayers(when: number) {
  if (!ctx || !loopGain) return
  layers.forEach((layer) => {
    const src = ctx!.createBufferSource()
    src.buffer = layer.buffer
    src.loop = true
    src.playbackRate.value = live.bpm / layer.recordedBpm
    src.connect(loopGain!)
    src.start(when)
    layer.source = src
  })
}

function applyLayerRates() {
  layers.forEach((layer) => {
    if (layer.source) layer.source.playbackRate.value = live.bpm / layer.recordedBpm
  })
}

async function addLayerFromBlob(blob: Blob, bars: number, bpm: number) {
  if (!ctx) return
  const arr = await blob.arrayBuffer()
  const buffer = await ctx.decodeAudioData(arr.slice(0))
  const layer: Layer = { source: null, buffer, recordedBpm: bpm }
  layers.push(layer)
  if (playing && loopGain) {
    const src = ctx.createBufferSource()
    src.buffer = buffer
    src.loop = true
    src.playbackRate.value = live.bpm / bpm
    src.connect(loopGain)
    src.start()
    layer.source = src
  }
  events.onLoopLayers?.(layers.length)
  loopState = 'idle'
  events.onLoopState?.('idle')
  events.onLoopProgress?.(0)
  void bars
}

function scheduleStep(step: number, time: number) {
  if (!ctx) return
  const pattern = live.pattern
  for (let t = 0; t < TRACK_COUNT; t++) {
    const vel = pattern[t]?.[step] ?? 0
    if (vel && !live.mutes[t]) triggerVoice(t, time, vel === 2 ? 1 : 0.72)
  }
  if (live.click && step % 4 === 0 && clickGain) {
    fireClick(ctx, clickGain, time, step % 16 === 0)
  }
  const delay = Math.max(0, (time - ctx.currentTime) * 1000)
  window.setTimeout(() => events.onStep?.(step), delay)

  if (loopState === 'armed' && step === 0) beginRecording(time)
}

function beginRecording(time: number) {
  if (!ctx || !recDest) return
  const mime = pickMime()
  try {
    rec = mime ? new MediaRecorder(recDest.stream, { mimeType: mime }) : new MediaRecorder(recDest.stream)
  } catch {
    loopState = 'idle'
    events.onLoopState?.('idle')
    return
  }
  recChunks = []
  recCancelled = false
  rec.ondataavailable = (e) => {
    if (e.data.size) recChunks.push(e.data)
  }
  rec.onstop = () => {
    const blob = new Blob(recChunks, { type: rec?.mimeType || 'audio/webm' })
    rec = null
    if (recCancelled || blob.size < 64) {
      recCancelled = false
      return
    }
    void addLayerFromBlob(blob, live.loopBars, live.bpm).catch(() => {
      loopState = 'idle'
      events.onLoopState?.('idle')
      events.onLoopProgress?.(0)
    })
  }
  rec.start()
  recStart = time
  recDur = barsToSeconds(live.loopBars, live.bpm)
  loopState = 'recording'
  events.onLoopState?.('recording')
  if (progressTimer) window.clearInterval(progressTimer)
  progressTimer = window.setInterval(() => {
    if (!ctx) return
    events.onLoopProgress?.(Math.min(1, (ctx.currentTime - recStart) / recDur))
  }, 40)
  recTimer = window.setTimeout(() => {
    if (rec && rec.state !== 'inactive') rec.stop()
    if (progressTimer) window.clearInterval(progressTimer)
    progressTimer = null
  }, recDur * 1000 + 30)
}

function tick() {
  if (!ctx || !playing) return
  while (nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD) {
    scheduleStep(currentStep, nextNoteTime)
    const stepDur = 60 / live.bpm / 4
    const swing = live.swing
    nextNoteTime += currentStep % 2 === 0 ? stepDur * (1 + swing) : stepDur * (1 - swing)
    currentStep = (currentStep + 1) % STEPS
  }
}

export function setLive(partial: Partial<Live>) {
  Object.assign(live, partial)
  if (partial.master !== undefined || partial.muted !== undefined) applyMaster()
  if (partial.mutes || partial.volumes) applyTracks()
  if (partial.includeKit !== undefined) applyIncludeKit()
  if (partial.bpm !== undefined) applyLayerRates()
}

export function setEvents(next: Partial<EngineEvents>) {
  Object.assign(events, next)
}

export function isBooted() {
  return booted
}

export function getAnalyser() {
  return analyser
}

export async function boot() {
  if (booted && ctx) {
    if (ctx.state === 'suspended') await ctx.resume()
    return
  }
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  ctx = new AC()
  if (ctx.state === 'suspended') await ctx.resume()
  noiseBuf = makeNoise(ctx)

  masterGain = ctx.createGain()
  kitGain = ctx.createGain()
  loopGain = ctx.createGain()
  recGain = ctx.createGain()
  clickGain = ctx.createGain()
  clickGain.gain.value = 0.5
  analyser = ctx.createAnalyser()
  analyser.fftSize = 512
  analyser.smoothingTimeConstant = 0.72
  recDest = ctx.createMediaStreamDestination()

  const comp = ctx.createDynamicsCompressor()
  comp.threshold.value = -16
  comp.ratio.value = 3.5
  comp.attack.value = 0.004
  comp.release.value = 0.12

  kitGain.connect(masterGain)
  loopGain.connect(masterGain)
  clickGain.connect(masterGain)
  masterGain.connect(comp)
  comp.connect(analyser)
  analyser.connect(ctx.destination)
  recGain.connect(recDest)
  loopGain.connect(recGain)
  if (live.includeKit) {
    kitGain.connect(recGain)
    kitToRec = true
  }

  for (let i = 0; i < TRACK_COUNT; i++) {
    const g = ctx.createGain()
    g.gain.value = snap(live.volumes[i] ?? 0.8)
    g.connect(kitGain)
    trackGains[i] = g
  }
  applyMaster()

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void ctx?.resume()
  })
  booted = true
}

export function startTransport() {
  if (!ctx) return
  void ctx.resume()
  if (playing) return
  playing = true
  currentStep = 0
  nextNoteTime = ctx.currentTime + 0.04
  startLayers(nextNoteTime)
  if (timer) window.clearInterval(timer)
  timer = window.setInterval(tick, LOOKAHEAD_MS)
  tick()
  events.onPlaying?.(true)
}

export function stopTransport() {
  playing = false
  if (timer) window.clearInterval(timer)
  timer = null
  currentStep = 0
  stopLayers()
  events.onPlaying?.(false)
  events.onStep?.(0)
}

export function triggerPad(track: number, vel = 1) {
  if (!ctx || live.mutes[track]) return
  void ctx.resume()
  triggerVoice(track, ctx.currentTime, vel)
}

export function armRecord() {
  if (!ctx || loopState !== 'idle') return
  applyIncludeKit()
  if (!playing) startTransport()
  loopState = 'armed'
  events.onLoopState?.('armed')
}

export function cancelRecord() {
  recCancelled = true
  if (progressTimer) window.clearInterval(progressTimer)
  progressTimer = null
  if (recTimer) window.clearTimeout(recTimer)
  recTimer = null
  if (rec && rec.state !== 'inactive') {
    try {
      rec.stop()
    } catch {
      /* already */
    }
  }
  rec = null
  loopState = 'idle'
  events.onLoopState?.('idle')
  events.onLoopProgress?.(0)
}

export function undoLayer() {
  const layer = layers.pop()
  if (!layer) return
  if (layer.source) {
    try {
      layer.source.stop()
    } catch {
      /* already */
    }
  }
  events.onLoopLayers?.(layers.length)
}

export function clearLayers() {
  while (layers.length) undoLayer()
}

export async function setMic(on: boolean) {
  if (!ctx || !recGain) return
  if (on) {
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
      micNode = ctx.createMediaStreamSource(micStream)
      micNode.connect(recGain)
      events.onMic?.(true, false)
    } catch {
      events.onMic?.(false, true)
    }
  } else {
    try {
      micNode?.disconnect()
    } catch {
      /* already */
    }
    micStream?.getTracks().forEach((t) => t.stop())
    micNode = null
    micStream = null
    events.onMic?.(false, false)
  }
}

export function peakHz() {
  if (!analyser || !ctx) return 0
  const bins = new Float32Array(analyser.frequencyBinCount)
  analyser.getFloatFrequencyData(bins)
  let max = -Infinity
  let idx = 0
  for (let i = 2; i < bins.length; i++) {
    if (bins[i] > max) {
      max = bins[i]
      idx = i
    }
  }
  if (max < -55) return 0
  return (idx * (ctx.sampleRate / 2)) / bins.length
}
