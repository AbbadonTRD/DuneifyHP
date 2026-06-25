"use client";

import { type ComponentProps } from "react";
import { AsciiField } from "@/components/ui/ascii-field";
import { OceanWaves } from "@/components/ui/ocean-waves";
import { cn } from "@/lib/utils";

type HeroAsciiOneProps = ComponentProps<"section">;

const signalBars = [8, 15, 11, 19, 13, 23, 16, 10];

export default function HeroAsciiOne({
  className,
  ...props
}: HeroAsciiOneProps) {
  return (
    <section
      className={cn(
        "ascii-hero dark relative min-h-screen overflow-hidden",
        className,
      )}
      {...props}
    >
      <div className="lab-backdrop" aria-hidden="true" />

      <AsciiField focus={0.34} />

      <OceanWaves />

      <div className="ascii-corner ascii-corner-bl" aria-hidden="true" />
      <div className="ascii-corner ascii-corner-br" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-4 pb-28 pt-24 sm:px-6 lg:justify-end lg:px-8 lg:pt-20">
        <div className="ascii-panel w-full max-w-xl lg:ml-auto">
          <div className="ascii-rule mb-4">
            <div className="h-px w-10 bg-current" />
            <span>LOCAL ARCHIVE</span>
            <div className="h-px flex-1 bg-current" />
          </div>

          <div className="relative">
            <div className="ascii-dither hidden lg:block" aria-hidden="true" />
            <h2 className="ascii-hero-title text-4xl font-bold sm:text-5xl lg:text-6xl">
              The library stays yours.
            </h2>
          </div>

          <div className="ascii-dot-row hidden lg:flex" aria-hidden="true">
            {Array.from({ length: 42 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>

          <div className="ascii-copy-block">
            <p className="ascii-hero-copy text-sm leading-relaxed sm:text-base">
              I carry the Burden or (Blessing whatever you think it is.) So that
              you wont have to worry about; No expiry window. No storefront
              check-in. No disappearing license. DUNEIFY keeps the stack local,
              indexed, transcoded, and ready for every screen when the internet
              gets weird.
            </p>
          </div>

          <div className="ascii-terminal-note">
            <span>ARCHIVE.PROTOCOL</span>
            <div className="h-px flex-1 bg-current" />
            <span>OWNED.MEDIA</span>
          </div>
        </div>
      </div>

      <div className="ascii-footer">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8 lg:py-3">
          <div className="flex items-center gap-3 lg:gap-6">
            <span className="hidden lg:inline">ARCHIVE.ACTIVE</span>
            <span className="lg:hidden">ARCH.ACT</span>
            <div className="hidden items-end gap-1 lg:flex" aria-hidden="true">
              {signalBars.map((height, index) => (
                <span key={index} style={{ height }} />
              ))}
            </div>
            <span>V1.0.0</span>
          </div>

          <a
            href="https://www.linkedin.com/in/tiago-cevallos-de-carvalho-13783a271/"
            target="_blank"
            rel="noopener noreferrer"
            className="ascii-credit inline-flex items-center gap-1 underline decoration-dotted underline-offset-2 transition-opacity hover:opacity-70"
          >
            Built with <span className="ascii-credit-heart">♥</span> by Tiago
          </a>

          <div className="flex items-center gap-2 lg:gap-4">
            <span className="hidden lg:inline">INDEXING</span>
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
  );
}
