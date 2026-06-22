# Product

## Register

brand

## Users
The owner (a self-hoster) and the small circle of people they hand the URL to. There's no public discovery path — you arrive because someone gave it to you, which is exactly what the first line plays on. Context: opened on a desktop or phone, usually idle curiosity, sometimes to actually reach a home-lab service behind it.

## Product Purpose
"Unify" is a personal home-lab homepage / dashboard. It exists to be a *destination*, not a utility: the front door is a small piece of theatre (a spiral 

-gate, then a mascot that greets you) before the real dashboard underneath. Success = the visitor feels they've found a secret, smiles, and remembers it.

## Brand Personality
Mysterious, playful, hand-made. Voice is dry and knowing ("How, did you find this page?"), never corporate. A retro-computer soul — phosphor terminals, CRT glow — animated by a curious little creature with actual personality. Three words: **curious, crafted, clandestine.**

## Anti-references
- Generic homelab dashboards (Heimdall / Homarr / Dashy grids of service tiles). The dashboard can come later; the front door must not look like one.
- SaaS landing pages: hero-metric templates, identical card grids, gradient-text, uppercase tracked eyebrows.
- "Developer = monospace costume." Here the terminal/CRT aesthetic is literal and earned (amber CRT), not decorative shorthand.

## Design Principles
- **The first line is the whole pitch.** Everything in the first view should make "How, did you find this page?" feel deliberate and a little uncanny.
- **The mascot is a character, not a logo.** It watches, blinks, reacts. Personality over polish-for-polish's-sake.
- **Theatre, then utility.** Earn delight at the door; reveal the functional dashboard as you go deeper.
- **Default-visible, motion enhances.** The peek pose reads correctly with zero JS / reduced motion; animation adds life, never gates content.

## Accessibility & Inclusion
- Respect `prefers-reduced-motion`: no flicker, no blink loop, no cursor tracking, no scanline crawl — static peek pose instead.
- Amber-on-near-black must clear WCAG AA for the real copy (headline + any body); the mascot art is decorative (`aria-hidden`) with a text alternative.
- Effects (scanlines, glow, vignette) stay subtle enough not to harm legibility.
