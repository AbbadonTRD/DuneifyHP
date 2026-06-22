"use client";

import { useEffect, useState } from "react";
import { SpiralAnimation } from "@/components/ui/spiral-animation";
import { cn } from "@/lib/utils";

interface EnterScreenProps {
  /** Called once the exit transition has finished and the site should be revealed. */
  onEnter: () => void;
}

export function EnterScreen({ onEnter }: EnterScreenProps) {
  const [startVisible, setStartVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  // Let the gate breathe in while the spiral is still forming.
  useEffect(() => {
    const timer = setTimeout(() => setStartVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

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
