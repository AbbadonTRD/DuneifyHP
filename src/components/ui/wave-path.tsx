'use client'

import { useEffect, useRef, type ComponentProps, type MouseEvent } from 'react'
import { useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

type WavePathProps = ComponentProps<'div'>

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

// High stiffness keeps the crest glued to the cursor (no lag); the light
// damping on the amplitude gives one elastic give on release rather than a
// drawn-out wobble. The horizontal spring is tighter so the peak never
// sloshes sideways.
const AMP_SPRING = { stiffness: 380, damping: 17, mass: 0.7 }
const X_SPRING = { stiffness: 520, damping: 40, mass: 0.7 }

export function WavePath({ className, ...props }: WavePathProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  const amplitude = useSpring(0, AMP_SPRING)
  const crestX = useSpring(0.5, X_SPRING)
  const targetAmp = useRef(0)

  useEffect(() => {
    const draw = () => {
      const path = pathRef.current
      const root = rootRef.current
      if (!path || !root) return

      const width = Math.max(root.getBoundingClientRect().width, 1)
      const peakX = width * clamp(crestX.get(), 0.06, 0.94)
      const peakY = 100 + amplitude.get() * 0.6

      path.setAttribute('d', `M0 100 Q${peakX} ${peakY}, ${width} 100`)
    }

    draw()
    const unsubAmp = amplitude.on('change', draw)
    const unsubX = crestX.on('change', draw)

    const root = rootRef.current
    const observer =
      root && typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(draw)
        : null
    if (root && observer) observer.observe(root)

    return () => {
      unsubAmp()
      unsubX()
      observer?.disconnect()
    }
  }, [amplitude, crestX])

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const path = pathRef.current
    if (!path) return

    const bounds = path.getBoundingClientRect()
    crestX.set((event.clientX - bounds.left) / Math.max(bounds.width, 1))

    targetAmp.current = clamp(targetAmp.current + event.movementY, -150, 150)
    amplitude.set(targetAmp.current)
  }

  const handleMouseLeave = () => {
    targetAmp.current = 0
    amplitude.set(0)
  }

  return (
    <div
      ref={rootRef}
      className={cn('relative h-px w-[70vw]', className)}
      {...props}
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="absolute -top-20 z-10 h-40 w-full cursor-crosshair md:-top-[150px] md:h-[300px]"
      />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -top-[100px] h-[200px] w-full overflow-visible"
      >
        <path
          ref={pathRef}
          className="wave-path-line fill-none stroke-current"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
