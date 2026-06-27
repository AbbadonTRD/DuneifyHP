"use client";

import { useMemo, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

// An ASCII glyph field for the hero backgrounds, rendered as plain DOM text.
// No canvas, no WebGL, no requestAnimationFrame — it is just amber characters
// in a <pre>, so it always renders (earlier canvas/WebGL versions went blank on
// some machines). A gentle CSS opacity breathe is the only motion.
const RAMP = " .·:-=+*#%▒▓█";
const ROWS = 90;
const COLS = 200;

type AsciiFieldProps = ComponentProps<"div"> & {
  /** Horizontal focus of the brightest band, 0..1 (home leans right). */
  focus?: number;
};

export function AsciiField({ className, focus = 0.5, ...props }: AsciiFieldProps) {
  const text = useMemo(() => {
    const lines: string[] = [];
    for (let r = 0; r < ROWS; r++) {
      let line = "";
      for (let c = 0; c < COLS; c++) {
        const swell =
          Math.sin(c * 0.16) * Math.cos(r * 0.2) +
          Math.sin((c + r) * 0.08) * 0.6;
        const band = 1 - Math.abs(c / COLS - focus) * 0.8;
        const v = ((swell + 1.6) / 3.2) * Math.max(0.5, band);
        const idx = Math.max(
          0,
          Math.min(RAMP.length - 1, Math.floor(v * RAMP.length)),
        );
        line += RAMP[idx];
      }
      lines.push(line);
    }
    return lines.join("\n");
  }, [focus]);

  return (
    <div className={cn("ascii-field", className)} aria-hidden="true" {...props}>
      <pre className="ascii-field-pre">{text}</pre>
    </div>
  );
}
