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
