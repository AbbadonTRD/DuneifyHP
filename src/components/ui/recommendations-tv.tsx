"use client";

import {
  Fragment,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useReducedMotion,
  useSpring,
} from "framer-motion";

/* ────────────────────────────────────────────────────────────────────────────
 * EDIT YOUR RECOMMENDATIONS HERE.
 * Each platform is a tab on the TV. Each app shows on the screen when picked.
 * name      → big label on the CRT
 * category  → small kicker ("Jellyfin client", "Media player", …)
 * blurb     → the description shown on screen
 * Swap in your own picks (e.g. Zeno on iOS, Blink on Windows) freely.
 * ──────────────────────────────────────────────────────────────────────────── */

type App = { name: string; category: string; blurb: string };
type Platform = { id: string; label: string; apps: App[] };

const PLATFORMS: Platform[] = [
  {
    id: "ios",
    label: "iOS",
    apps: [
      {
        name: "Swiftfin",
        category: "Jellyfin client",
        blurb:
          "Open-source native Jellyfin app for iPhone and iPad. Direct play, offline downloads, no transcoding tax.",
      },
      {
        name: "Infuse",
        category: "Media player",
        blurb:
          "Polished player with rich metadata. Points straight at your Jellyfin library or SMB share.",
      },
      {
        name: "VLC",
        category: "Media player",
        blurb:
          "Plays every codec you throw at it. The dependable fallback for anything exotic.",
      },
    ],
  },
  {
    id: "android",
    label: "Android",
    apps: [
      {
        name: "Findroid",
        category: "Jellyfin client",
        blurb:
          "Modern, native Jellyfin client for Android. Downloads, Chromecast and a clean UI.",
      },
      {
        name: "Streamyfin",
        category: "Jellyfin client",
        blurb:
          "Cross-platform Jellyfin client with native transcoding control and a tidy interface.",
      },
      {
        name: "VLC",
        category: "Media player",
        blurb:
          "Universal codec support, streaming straight from your network share.",
      },
    ],
  },
  {
    id: "windows",
    label: "Windows",
    apps: [
      {
        name: "Jellyfin Media Player",
        category: "Desktop client",
        blurb:
          "Official desktop app with MPV under the hood. Hardware decode and a TV-style big-screen mode.",
      },
      {
        name: "mpv",
        category: "Media player",
        blurb:
          "Minimal, scriptable, hardware-accelerated. The power user's player.",
      },
      {
        name: "VLC",
        category: "Media player",
        blurb: "Opens anything, transcodes nothing it doesn't have to.",
      },
    ],
  },
  {
    id: "macos",
    label: "macOS",
    apps: [
      {
        name: "Infuse",
        category: "Media player",
        blurb:
          "The best-looking player on Apple platforms. Reads your Jellyfin library natively.",
      },
      {
        name: "IINA",
        category: "Media player",
        blurb:
          "Modern macOS player built on mpv. Native, fast and gorgeous.",
      },
      {
        name: "Swiftfin",
        category: "Jellyfin client",
        blurb: "Native Jellyfin app that runs on Apple Silicon Macs too.",
      },
    ],
  },
  {
    id: "tv",
    label: "TV",
    apps: [
      {
        name: "Jellyfin for Android TV",
        category: "Living-room client",
        blurb:
          "Official big-screen client for Android TV and Google TV boxes.",
      },
      {
        name: "Kodi",
        category: "Media center",
        blurb:
          "The veteran media center. Point the Jellyfin add-on at your server and go.",
      },
      {
        name: "Swiftfin",
        category: "Apple TV client",
        blurb: "Native Jellyfin client for Apple TV with direct play.",
      },
    ],
  },
];

export function RecommendationsTV() {
  const reduce = useReducedMotion();
  const [platformId, setPlatformId] = useState(PLATFORMS[0].id);
  const [appIndex, setAppIndex] = useState(0);

  const platform =
    PLATFORMS.find((p) => p.id === platformId) ?? PLATFORMS[0];
  const app = platform.apps[appIndex] ?? platform.apps[0];

  const screenRef = useRef<HTMLDivElement>(null);

  // Cursor-tracking glow — decorative, so it rides a spring.
  const glowX = useSpring(50, { stiffness: 140, damping: 18, mass: 0.6 });
  const glowY = useSpring(40, { stiffness: 140, damping: 18, mass: 0.6 });
  const glow = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, oklch(0.82 0.16 75 / 0.22) 0%, oklch(0.82 0.16 75 / 0.07) 32%, transparent 62%)`;

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const el = screenRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    glowX.set(((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100);
    glowY.set(((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100);
  };

  const handlePointerLeave = () => {
    glowX.set(50);
    glowY.set(40);
  };

  const selectPlatform = (id: string) => {
    setPlatformId(id);
    setAppIndex(0);
  };

  return (
    <section className="rack-terminal recs-tv" aria-label="App recommendations by platform">
      <div className="rack-terminal-shell">
        <span className="rack-terminal-screw rack-terminal-screw--tl" />
        <span className="rack-terminal-screw rack-terminal-screw--tr" />
        <span className="rack-terminal-screw rack-terminal-screw--bl" />
        <span className="rack-terminal-screw rack-terminal-screw--br" />

        <div
          ref={screenRef}
          className="rack-terminal-screen recs-tv-screen"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <motion.div
            className="rack-terminal-glow"
            aria-hidden="true"
            style={{ background: glow }}
          />
          <div className="rack-terminal-scanlines" aria-hidden="true" />
          <div className="rack-terminal-glass" aria-hidden="true" />

          <div className="rack-terminal-boot">
            <header className="rack-terminal-topbar">
              <div className="rack-terminal-title">
                RECOMMENDED / {platform.label.toUpperCase()}
              </div>
              <div className="rack-terminal-line" />
              <div className="rack-terminal-stats">
                <span>
                  PICKS <strong>{platform.apps.length}</strong>
                </span>
                <span className="rack-terminal-pulse">///</span>
              </div>
            </header>

            <main className="rack-terminal-main recs-tv-main">
              <aside className="rack-terminal-module rack-terminal-side-menu recs-tv-list">
                {platform.apps.map((item, index) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setAppIndex(index)}
                    aria-pressed={index === appIndex}
                    className={
                      "rack-terminal-side-row" +
                      (index === appIndex
                        ? " rack-terminal-side-row--active"
                        : "")
                    }
                  >
                    <span>{item.name}</span>
                    <small>{item.category}</small>
                  </button>
                ))}
              </aside>

              <section className="rack-terminal-module rack-terminal-status-display recs-tv-display">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={platform.id + appIndex}
                    initial={
                      reduce ? { opacity: 0 } : { opacity: 0, y: 10 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="recs-tv-display-inner"
                  >
                    <p className="rack-terminal-kicker">
                      {platform.label} / {app.category}
                    </p>
                    <h3 className="recs-tv-display-name">{app.name}</h3>
                    <p className="recs-tv-display-desc">{app.blurb}</p>
                  </motion.div>
                </AnimatePresence>

                <div className="rack-terminal-tape" aria-hidden="true">
                  <span>
                    own your media / pick your client / no storefront lease /&nbsp;
                  </span>
                  <span>
                    own your media / pick your client / no storefront lease /&nbsp;
                  </span>
                </div>
              </section>
            </main>

            <footer className="rack-terminal-nav recs-tv-nav">
              {PLATFORMS.map((item, index) => (
                <Fragment key={item.id}>
                  <button
                    type="button"
                    className="rack-terminal-tab"
                    data-active={item.id === platformId}
                    aria-selected={item.id === platformId}
                    onClick={() => selectPlatform(item.id)}
                  >
                    {item.label}
                  </button>
                  {index < PLATFORMS.length - 1 && (
                    <div className="rack-terminal-line" />
                  )}
                </Fragment>
              ))}
              <div className="rack-terminal-eq" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}
