'use client'

import { type ComponentProps } from 'react'
import { AsciiField } from '@/components/ui/ascii-field'
import { cn } from '@/lib/utils'

type HeroAsciiProps = ComponentProps<'section'>

const signalBars = [12, 18, 9, 24, 15, 21, 13, 17]

export default function HeroAscii({ className, ...props }: HeroAsciiProps) {
  return (
    <section
      className={cn(
        'ascii-hero ascii-hero--home dark relative min-h-screen overflow-hidden',
        className,
      )}
      {...props}
    >
      <div className="lab-backdrop" aria-hidden="true" />

      <AsciiField focus={0.66} />

      <div className="ascii-topbar">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
          <div className="flex items-center gap-3">
            <div className="ascii-brand">DUNEIFY</div>
            <div className="h-4 w-px bg-current opacity-35" />
            <span className="ascii-meta">EST. LOCAL</span>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <span>NODE: HOME-LAB</span>
            <span className="h-1 w-1 rounded-full bg-current opacity-45" />
            <span>MODE: YOURS</span>
          </div>
        </div>
      </div>

      <div className="ascii-corner ascii-corner-tl" aria-hidden="true" />
      <div className="ascii-corner ascii-corner-tr" aria-hidden="true" />
      <div className="ascii-corner ascii-corner-bl" aria-hidden="true" />
      <div className="ascii-corner ascii-corner-br" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-4 pb-28 pt-24 sm:px-6 lg:px-8 lg:pt-20">
        <div className="ascii-panel w-full max-w-xl">
          <div className="ascii-rule mb-4">
            <div className="h-px w-10 bg-current" />
            <span>001</span>
            <div className="h-px flex-1 bg-current" />
          </div>

          <div className="relative">
            <div className="ascii-dither hidden lg:block" aria-hidden="true" />
            <h1 className="ascii-hero-title text-4xl font-bold sm:text-5xl lg:text-6xl">
              DUNEIFY
              <span className="block">HOME LAB</span>
            </h1>
          </div>

          <div className="ascii-dot-row hidden lg:flex" aria-hidden="true">
            {Array.from({ length: 40 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>

          <div className="ascii-copy-block">
            <p className="ascii-hero-copy text-sm leading-relaxed sm:text-base">
              Your media, cloud, network, and tunnels running local first.
              Stream it, sync it, transcode it, and keep owning the stack
              instead of renting access to it.
            </p>
          </div>

          <div className="ascii-terminal-note">
            <span>LOCAL.PROTOCOL</span>
            <div className="h-px flex-1 bg-current" />
            <span>OWNED.STACK</span>
          </div>
        </div>
      </div>

      <div className="ascii-footer ascii-footer--home">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8 lg:py-3">
          <div className="flex items-center gap-3 lg:gap-6">
            <span className="hidden lg:inline">SYSTEM.ACTIVE</span>
            <span className="lg:hidden">SYS.ACT</span>
            <div className="hidden items-end gap-1 lg:flex" aria-hidden="true">
              {signalBars.map((height, index) => (
                <span key={index} style={{ height }} />
              ))}
            </div>
            <span>V1.0.0</span>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <span className="hidden lg:inline">RENDERING</span>
            <div className="ascii-pulse" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <span className="hidden lg:inline">FRAME: LOCAL</span>
          </div>
        </div>
      </div>
    </section>
  )
}
