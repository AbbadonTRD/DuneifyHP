'use client'

import { useEffect, useRef } from 'react'

const CAPACITY = 30 // visible samples across the width
const STEP_MS = 680 // cadence of a new sample (the line scrolls between them)

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

// A live, continuously-scrolling line graph (transcode load telemetry). Drawn
// on a canvas so the scroll is smooth between samples and the line can glow.
export function RackGraph() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Seed with a smooth random walk so it looks alive from frame one.
    const data: number[] = []
    let value = 0.5
    for (let i = 0; i <= CAPACITY; i++) {
      value = clamp(value + (Math.random() - 0.5) * 0.18, 0.12, 0.9)
      data.push(value)
    }
    let lastPush = performance.now()

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
    resize()

    const draw = (t: number) => {
      while (t - lastPush >= STEP_MS) {
        lastPush += STEP_MS
        value = clamp(value + (Math.random() - 0.5) * 0.24, 0.08, 0.95)
        data.push(value)
        if (data.length > CAPACITY + 1) data.shift()
      }
      const progress = Math.min((t - lastPush) / STEP_MS, 1)

      ctx.clearRect(0, 0, width, height)

      const padY = 5
      const usableH = height - padY * 2
      const stepX = width / (CAPACITY - 1)
      const pts = data.map((val, i) => ({
        x: (i - progress) * stepX,
        y: padY + (1 - val) * usableH,
      }))

      // Faint baseline grid.
      ctx.strokeStyle = 'rgba(255, 196, 92, 0.09)'
      ctx.lineWidth = 1
      for (let g = 0; g <= 3; g++) {
        const gy = padY + (usableH * g) / 3
        ctx.beginPath()
        ctx.moveTo(0, gy)
        ctx.lineTo(width, gy)
        ctx.stroke()
      }

      // Smooth line through the samples (midpoint quadratics).
      const line = new Path2D()
      line.moveTo(pts[0].x, pts[0].y)
      for (let i = 0; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2
        const my = (pts[i].y + pts[i + 1].y) / 2
        line.quadraticCurveTo(pts[i].x, pts[i].y, mx, my)
      }
      line.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y)

      // Area fill under the line.
      const area = new Path2D(line)
      area.lineTo(pts[pts.length - 1].x, height)
      area.lineTo(pts[0].x, height)
      area.closePath()
      const fill = ctx.createLinearGradient(0, 0, 0, height)
      fill.addColorStop(0, 'rgba(255, 196, 92, 0.26)')
      fill.addColorStop(1, 'rgba(255, 196, 92, 0)')
      ctx.fillStyle = fill
      ctx.fill(area)

      // Glowing line.
      ctx.save()
      ctx.shadowColor = 'rgba(255, 196, 92, 0.7)'
      ctx.shadowBlur = 10
      ctx.strokeStyle = 'rgba(255, 216, 146, 0.95)'
      ctx.lineWidth = 2
      ctx.lineJoin = 'round'
      ctx.stroke(line)
      ctx.restore()

      // Pulsing leading dot at the newest in-frame sample.
      const lead = pts[pts.length - 2] ?? pts[pts.length - 1]
      const pulse = 0.5 + 0.5 * Math.sin(t / 260)
      ctx.save()
      ctx.shadowColor = 'rgba(255, 196, 92, 0.9)'
      ctx.shadowBlur = 12
      ctx.fillStyle = 'rgba(255, 226, 174, 1)'
      ctx.beginPath()
      ctx.arc(lead.x, lead.y, 2.6, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
      ctx.strokeStyle = `rgba(255, 196, 92, ${0.45 * (1 - pulse)})`
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(lead.x, lead.y, 3 + pulse * 5, 0, Math.PI * 2)
      ctx.stroke()

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    const observer = new ResizeObserver(resize)
    observer.observe(wrap)

    return () => {
      observer.disconnect()
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div ref={wrapRef} className="rack-terminal-graph" aria-hidden="true">
      <canvas ref={canvasRef} />
      <span className="rack-terminal-graph-label">transcode load</span>
    </div>
  )
}
