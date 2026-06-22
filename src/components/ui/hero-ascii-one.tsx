"use client";

import { useEffect, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized?: boolean;
      init?: () => void;
      destroy?: () => void;
    };
  }
}

type HeroAsciiOneProps = ComponentProps<"section">;

const signalBars = [8, 15, 11, 19, 13, 23, 16, 10];

export default function HeroAsciiOne({
  className,
  ...props
}: HeroAsciiOneProps) {
  useEffect(() => {
    const scriptId = "unicorn-studio-embed";

    const hideUnicornChrome = () => {
      const root = document.querySelector(".ascii-hero");

      if (!root) {
        return;
      }

      const chromeSelectors = [
        'a[href*="unicorn"]',
        'button[title*="unicorn" i]',
        'button[aria-label*="unicorn" i]',
        '[data-us-project] [title*="Made with" i]',
        '[data-us-project] [aria-label*="Made with" i]',
        '[data-us-project] [class*="brand" i]',
        '[data-us-project] [class*="credit" i]',
        '[data-us-project] [class*="watermark" i]',
      ];

      root.querySelectorAll(chromeSelectors.join(",")).forEach((element) => {
        element.remove();
      });

      root
        .querySelectorAll("a, button, [title], [aria-label]")
        .forEach((element) => {
          const text = (element.textContent || "").toLowerCase();
          const title = (element.getAttribute("title") || "").toLowerCase();
          const label = (
            element.getAttribute("aria-label") || ""
          ).toLowerCase();
          const href = (element.getAttribute("href") || "").toLowerCase();

          if (
            text.includes("made with unicorn") ||
            title.includes("made with unicorn") ||
            label.includes("made with unicorn") ||
            href.includes("unicorn.studio")
          ) {
            element.remove();
          }
        });
    };

    const initUnicorn = () => {
      if (!window.UnicornStudio?.init) {
        return;
      }

      // Always (re)scan on mount. UnicornStudio skips scenes it has already
      // initialised, but a persistent `isInitialized` flag would wrongly
      // suppress the re-init after an HMR swap / remount and leave the freshly
      // rendered embed div blank.
      window.UnicornStudio.init();
      window.setTimeout(hideUnicornChrome, 150);
    };

    const existingScript = document.getElementById(
      scriptId,
    ) as HTMLScriptElement | null;

    const chromeInterval = window.setInterval(hideUnicornChrome, 150);
    const chromeTimeouts = [400, 900, 1800, 3200, 5000].map((delay) =>
      window.setTimeout(hideUnicornChrome, delay),
    );

    if (existingScript) {
      initUnicorn();
      existingScript.addEventListener("load", initUnicorn, { once: true });

      return () => {
        window.clearInterval(chromeInterval);
        chromeTimeouts.forEach((timeout) => window.clearTimeout(timeout));
        existingScript.removeEventListener("load", initUnicorn);
      };
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src =
      "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js";
    script.async = true;
    script.addEventListener("load", initUnicorn, { once: true });
    document.head.appendChild(script);

    return () => {
      window.clearInterval(chromeInterval);
      chromeTimeouts.forEach((timeout) => window.clearTimeout(timeout));
      script.removeEventListener("load", initUnicorn);
    };
  }, []);

  return (
    <section
      className={cn(
        "ascii-hero dark relative min-h-screen overflow-hidden",
        className,
      )}
      {...props}
    >
      <div className="lab-backdrop" aria-hidden="true" />

      <div
        className="ascii-unicorn-wrap ascii-unicorn-wrap--archive"
        aria-hidden="true"
      >
        <div className="ascii-unicorn" data-us-project="OMzqyUv6M3kSnv0JeAtC" />
      </div>

      <div className="ascii-stars-bg lg:hidden" aria-hidden="true" />

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
