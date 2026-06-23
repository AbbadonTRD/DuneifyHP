"use client";

import { useEffect, useState } from "react";
import { SpiralAnimation } from "@/components/ui/spiral-animation";
import { cn } from "@/lib/utils";

const INTRO_REVEAL_DELAY_MS = 6500;

interface EnterScreenProps {
  /** Called once the exit transition has finished and the site should be revealed. */
  onEnter: () => void;
}

export function EnterScreen({ onEnter }: EnterScreenProps) {
  const [startVisible, setStartVisible] = useState(false);
  const [revealQueued, setRevealQueued] = useState(false);
  const [exiting, setExiting] = useState(false);

  // Hold the prompt + enter button back until the spiral has finished
  // expanding (~6.5s), so the text resolves with the particles instead of
  // popping in over a still-forming background.
  useEffect(() => {
    const timer = window.setTimeout(
      () => setRevealQueued(true),
      INTRO_REVEAL_DELAY_MS,
    );
    return () => clearTimeout(timer);
  }, []);

  // Wait two frames before switching the visible class so the browser has a
  // clean, painted opacity: 0 state to animate while the spiral keeps moving.
  useEffect(() => {
    if (!revealQueued) return;

    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => setStartVisible(true));
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [revealQueued]);

  const handleEnter = () => {
    if (exiting) return;
    setExiting(true);
    // Let the fade-out play, then hand control back to the parent.
    setTimeout(onEnter, 1000);
  };

  return (
    <div
      className={cn(
        "enter-screen",
        exiting && "enter-screen--exiting",
      )}
    >
      <div className="enter-screen__spiral" aria-hidden="true">
        <SpiralAnimation />
      </div>
      <div className="enter-screen__veil" aria-hidden="true" />

      <div
        className={cn(
          "enter-screen__prompt",
          startVisible && !exiting && "enter-screen__prompt--visible",
        )}
      >
        <div className="enter-screen__trace" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="enter-screen__content">
          <div className="enter-screen__meta" aria-hidden="true">
            <span>DUNEIFY gate</span>
            <span>private trace</span>
          </div>

          <h1
            className="enter-screen__title"
            aria-label="How did you find this site?"
          >
            <span>How did you</span>
            <span>find this site?</span>
          </h1>

          <p className="enter-screen__copy">
            No index. No map. Just a warm signal, still alive.
          </p>
        </div>
      </div>

      <div
        className={cn(
          "enter-screen__center-action",
          startVisible && !exiting && "enter-screen__center-action--visible",
        )}
      >
        <button
          type="button"
          onClick={handleEnter}
          aria-label="Enter DUNEIFY"
          className="enter-screen__enter-text"
        >
          Enter
        </button>
      </div>
    </div>
  );
}
