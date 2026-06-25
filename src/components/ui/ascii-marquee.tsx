"use client";

import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * A single-line ASCII ticker used as a section divider. Pure terminal texture:
 * shaded block glyphs + a short phrase, scrolling under normal motion and
 * sitting still under reduced motion.
 */
type AsciiMarqueeProps = ComponentProps<"div"> & {
  text?: string;
};

const DEFAULT =
  "░▒▓█ OWN YOUR MEDIA █▓▒░ ·· SINCE BUYING ISN'T OWNING ·· ░▒▓█ LOCAL.FIRST █▓▒░ ·· NO LEASE / NO STOREFRONT / NO EXPIRY ··";

export function AsciiMarquee({ text = DEFAULT, className, ...props }: AsciiMarqueeProps) {
  return (
    <div
      className={cn("ascii-marquee", className)}
      role="presentation"
      aria-hidden="true"
      {...props}
    >
      <div className="ascii-marquee-track">
        <span>{text}&nbsp;&nbsp;&nbsp;</span>
        <span>{text}&nbsp;&nbsp;&nbsp;</span>
      </div>
    </div>
  );
}
