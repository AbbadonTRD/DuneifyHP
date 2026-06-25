"use client";

/**
 * Reworked from a Uiverse wallet (by byllzz) into the Duneify CRT theme.
 * Instead of a bank balance, it shows what you DON'T pay: each card is a
 * subscription you dropped (hover a card to see the self-hosted app that
 * replaced it), and the pocket reveals a Total Cost of $0.00.
 */

type Sub = {
  id: string;
  name: string;
  accent: string;
  plan: string;
  price: string;
  replacedBy: string;
};

const SUBS: Sub[] = [
  {
    id: "netflix",
    name: "Netflix",
    accent: "#e50914",
    plan: "Premium 4K",
    price: "$22.99/mo",
    replacedBy: "▸ Jellyfin",
  },
  {
    id: "spotify",
    name: "Spotify",
    accent: "#1db954",
    plan: "Family",
    price: "$16.99/mo",
    replacedBy: "▸ Navidrome",
  },
  {
    id: "onedrive",
    name: "OneDrive",
    accent: "#0364b8",
    plan: "1 TB cloud",
    price: "$9.99/mo",
    replacedBy: "▸ Immich",
  },
];

export function CostWallet() {
  return (
    <div className="cost-wallet" role="img" aria-label="Total subscription cost: zero dollars">
      <div className="cw-back" />

      {SUBS.map((sub) => (
        <div
          key={sub.id}
          className={`cw-card cw-card--${sub.id}`}
          style={{ ["--cw-accent" as string]: sub.accent }}
        >
          <div className="cw-card-inner">
            <div className="cw-card-top">
              <span>{sub.name}</span>
              <div className="cw-chip" />
            </div>
            <div className="cw-card-bottom">
              <div className="cw-card-info">
                <span className="cw-label">Plan</span>
                <span className="cw-value">{sub.plan}</span>
              </div>
              <div className="cw-number-wrap">
                <span className="cw-price">{sub.price}</span>
                <span className="cw-replaced">{sub.replacedBy}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="cw-pocket">
        <svg className="cw-pocket-svg" viewBox="0 0 280 160" fill="none" aria-hidden="true">
          <path
            className="cw-pocket-fill"
            d="M 0 20 C 0 10, 5 10, 10 10 C 20 10, 25 25, 40 25 L 240 25 C 255 25, 260 10, 270 10 C 275 10, 280 10, 280 20 L 280 120 C 280 155, 260 160, 240 160 L 40 160 C 20 160, 0 155, 0 120 Z"
          />
          <path
            className="cw-pocket-stitch"
            d="M 8 22 C 8 16, 12 16, 15 16 C 23 16, 27 29, 40 29 L 240 29 C 253 29, 257 16, 265 16 C 268 16, 272 16, 272 22 L 272 120 C 272 150, 255 152, 240 152 L 40 152 C 25 152, 8 152, 8 120 Z"
            strokeDasharray="6 4"
          />
        </svg>
        <div className="cw-pocket-content">
          <div className="cw-balance-stage">
            <div className="cw-balance-stars">$ ·······</div>
            <div className="cw-balance-real">$0.00</div>
          </div>
          <div className="cw-pocket-label">Total monthly cost</div>
          <div className="cw-eye-wrap" aria-hidden="true">
            <svg
              className="cw-eye cw-eye-slash"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
              <line x1="3" y1="3" x2="21" y2="21" />
            </svg>
            <svg
              className="cw-eye cw-eye-open"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
