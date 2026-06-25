"use client";

import { useEffect, useRef, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

// A flowing field of amber ASCII glyphs drawn on a 2D canvas. Pure terminal
// texture for the hero backgrounds — no WebGL, so it renders the same on every
// machine (the previous WebGL embed went blank wherever WebGL was unavailable).
const RAMP = " .·:-=+*#%▒▓█";
const AMBER = "255, 196, 92";
const CELL = 16; // px per glyph cell

type AsciiFieldProps = ComponentProps<"div"> & {
  /** Horizontal focus of the brightest band, 0..1 (home leans right). */
  focus?: number;
};

export function AsciiField({ className, focus = 0.5, ...props }: AsciiFieldProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 1;
    let height = 1;
    let cols = 0;
    let rows = 0;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(Math.round(rect.width), 1);
      height = Math.max(Math.round(rect.height), 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / CELL) + 1;
      rows = Math.ceil(height / CELL) + 1;
      ctx.font = `${CELL}px "JetBrains Mono", ui-monospace, monospace`;
      ctx.textBaseline = "top";
    };

    // Layered sines → a slow diagonal swell, brightest along a vertical band so
    // it reads as a soft column of glyphs rather than uniform noise.
    const value = (c: number, r: number, t: number) => {
      const swell =
        Math.sin(c * 0.17 + t * 0.00055) * Math.cos(r * 0.21 - t * 0.0004) +
        Math.sin((c + r) * 0.085 + t * 0.0008) * 0.6;
      const band = 1 - Math.abs(c / cols - focus) * 1.5;
      return (swell + 1.6) / 3.2 * Math.max(0.15, band);
    };

    let last = 0;
    const draw = (t: number) => {
      rafRef.current = requestAnimationFrame(draw);
      if (t - last < 55) return; // ~18fps is plenty for ambient texture
      last = t;

      ctx.clearRect(0, 0, width, height);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const v = value(c, r, t);
          if (v <= 0.14) continue;
          const idx = Math.min(
            RAMP.length - 1,
            Math.max(0, Math.floor(v * RAMP.length)),
          );
          const ch = RAMP[idx];
          if (ch === " ") continue;
          ctx.fillStyle = `rgba(${AMBER}, ${Math.min(0.42, v * 0.46)})`;
          ctx.fillText(ch, c * CELL, r * CELL);
        }
      }
    };

    resize();
    rafRef.current = requestAnimationFrame(draw);
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [focus]);

  return (
    <div ref={wrapRef} className={cn("ascii-field", className)} aria-hidden="true" {...props}>
      <canvas ref={canvasRef} className="ascii-field-canvas" />
    </div>
  );
}
