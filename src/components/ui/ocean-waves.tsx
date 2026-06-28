'use client'

import { useEffect, useRef } from 'react'

// Travelling-wave layers. Each is a sine moving in +x (left -> right) at its own
// wavelength/speed; summed, they make a non-repeating, believable swell.
const LAYERS = [
  { amp: 15, length: 360, speed: 0.0052, phase: 0 },
  { amp: 10, length: 235, speed: 0.0072, phase: 2.1 },
  { amp: 6, length: 150, speed: 0.0098, phase: 4.2 },
]

const DOT_GAP = 15 // px between dots — matches the site's dot-field rhythm
const AMBER = '255, 196, 92'

// A Braille-art galleon that drifts left across the whole wave and wraps. The
// dot glyphs echo the section's dot field, so the ship reads as part of the sea.
const BOAT_DRIFT = 0.04 // px per ms (~35s to cross the band)
// Last line is the waterline reflection; it sits on the surface. Blank Braille
// cells (⠀, U+2800) pad each row so widths stay aligned for centering.
const BOAT_ART = [
  '⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠤⠴⠶⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
  '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣾⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
  '⠀⠀⠀⠀⠀⠀⠀⠂⠉⡇⠀⠀⠀⢰⣿⣿⣿⣿⣧⠀⠀⢀⣄⣀⠀⠀⠀⠀⠀⠀',
  '⠀⠀⠀⠀⠀⠀⢠⣶⣶⣷⠀⠀⠀⠸⠟⠁⠀⡇⠀⠀⠀⠀⠀⢹⠀⠀⠀⠀⠀⠀',
  '⠀⠀⠀⠀⠀⠀⠘⠟⢹⣋⣀⡀⢀⣤⣶⣿⣿⣿⣿⣿⡿⠛⣠⣼⣿⡟⠀⠀⠀⠀',
  '⠀⠀⠀⠀⠀⣴⣾⣿⣿⣿⣿⢁⣾⣿⣿⣿⣿⣿⣿⡿⢁⣾⣿⣿⣿⠁⠀⠀⠀⠀',
  '⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿⣿⣿⠿⠇⠀⠀⠀⠀',
  '⠀⠀⠀⠳⣤⣙⠟⠛⢻⠿⣿⠸⣿⣿⣿⣿⣿⣿⣿⣇⠘⠉⠀⢸⠀⢀⣠⠀⠀⠀',
  '⠀⠀⠀⠀⠈⠻⣷⣦⣼⠀⠀⠀⢻⣿⣿⠿⢿⡿⠿⣿⡄⠀⠀⣼⣷⣿⣿⠀⠀⠀',
  '⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣶⣄⡈⠉⠀⠀⢸⡇⠀⠀⠉⠂⠀⣿⣿⣿⣧⠀⠀⠀',
  '⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣷⣤⣀⣸⣧⣠⣤⣴⣶⣾⣿⣿⣿⡿⠀⠀⠀',
  '⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀',
  '⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠉⠀⠀⠀⠀',
  '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
]
const clampNum = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v))

export function OceanWaves() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 1
    let height = 1

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(Math.round(rect.width), 1)
      height = Math.max(Math.round(rect.height), 1)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const surfaceAt = (x: number, t: number) => {
      let y = 0
      for (const l of LAYERS) {
        y += l.amp * Math.sin((x / l.length) * Math.PI * 2 - t * l.speed + l.phase)
      }
      return y
    }

    // A small ASCII sailboat (monospace glyphs), bow facing left since it always
    // sails left. Saved context so its glow doesn't bleed into the dots next
    // frame. Local origin = waterline; the hull line sits on it, sail stacks up.
    const drawBoat = (x: number, y: number, angle: number, scale: number) => {
      const fs = Math.round(9 * scale)
      const lineH = fs * 0.92
      const charW = fs * 0.6
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.font = `${fs}px "JetBrains Mono", ui-monospace, monospace`
      ctx.textBaseline = 'alphabetic'
      ctx.textAlign = 'left'
      ctx.shadowColor = `rgba(${AMBER}, 0.45)`
      ctx.shadowBlur = 4
      ctx.fillStyle = `rgba(${AMBER}, 0.92)`
      const offX = -(BOAT_ART[BOAT_ART.length - 1].length * charW) / 2
      for (let i = 0; i < BOAT_ART.length; i++) {
        const yy = -(BOAT_ART.length - 1 - i) * lineH
        ctx.fillText(BOAT_ART[i], offX, yy)
      }
      ctx.restore()
    }

    // The boat carries momentum: its pitch and bob ease toward the wave rather
    // than snapping to it, and it keeps a slow roll of its own. That lag is what
    // reads as "floating" instead of a sticker glued to the surface.
    let smAngle = 0 // smoothed pitch (rad)
    let smHeave = 0 // smoothed extra bob (px)
    let lastT = 0

    // The ambient ocean is core to this section's identity, so it keeps moving
    // regardless of the OS reduce-motion flag — the motion is slow, smooth and
    // non-flashing, which is the gentle kind reduce-motion still allows.
    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height)

      const restLine = height * 0.32 // calm waterline, near the top of the band
      const edgeBand = width * 0.12

      for (let x = 0; x <= width; x += DOT_GAP) {
        const surface = restLine + surfaceAt(x, t)
        // Soft left/right dissolve so the water melts into the section sides.
        const edgeFade = Math.min(1, Math.min(x, width - x) / edgeBand)
        if (edgeFade <= 0) continue

        for (let y = surface; y <= height; y += DOT_GAP) {
          const depth = (y - surface) / Math.max(height - surface, 1)
          // Fade with depth, and again toward the very bottom so the dots are
          // gone before the section boundary -> seamless hand-off downward.
          const bottomFade = Math.min(1, (height - y) / (height * 0.2))
          const crest = y - surface < DOT_GAP ? 1.7 : 1
          const alpha = (1 - depth * 0.72) * edgeFade * bottomFade * crest * 0.34
          if (alpha <= 0.015) continue

          ctx.fillStyle = `rgba(${AMBER}, ${Math.min(0.5, alpha)})`
          ctx.fillRect(x - 1, Math.round(y) - 1, 2, 2)
        }
      }

      // Sailboat: drift left across the whole wave, wrapping back to the right.
      const span = width + 80
      const boatX = width + 40 - ((t * BOAT_DRIFT) % span)
      const scale = clampNum(width / 1100, 0.75, 1.2)

      // Frame delta (clamped so a hidden tab / dropped frames don't lurch it).
      const dt = lastT ? Math.min(t - lastT, 64) : 16
      lastT = t

      // Pitch target: slope sampled across roughly the hull's reach (not a single
      // point, which twitches), plus a slow roll so it rocks even over calm water.
      const reach = 24 * scale
      const slope = (surfaceAt(boatX + reach, t) - surfaceAt(boatX - reach, t)) / (2 * reach)
      const roll = Math.sin(t * 0.0011 + boatX * 0.004) * 0.05
      const targetAngle = Math.atan(slope) * 0.5 + roll
      // A small heave so the hull lifts and settles a touch beyond the surface.
      const targetHeave = Math.sin(t * 0.0016 + 1.7) * 2 * scale

      // Ease toward the targets (time-constant low-pass -> momentum/lag).
      smAngle += (targetAngle - smAngle) * (1 - Math.exp(-dt / 230))
      smHeave += (targetHeave - smHeave) * (1 - Math.exp(-dt / 320))

      const boatY = restLine + surfaceAt(boatX, t) + smHeave
      drawBoat(boatX, boatY, smAngle, scale)

      rafRef.current = requestAnimationFrame(draw)
    }

    resize()
    rafRef.current = requestAnimationFrame(draw)

    const observer = new ResizeObserver(resize)
    observer.observe(wrap)

    return () => {
      observer.disconnect()
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div ref={wrapRef} className="ocean-waves" aria-hidden="true">
      <canvas ref={canvasRef} className="ocean-canvas" />
    </div>
  )
}
