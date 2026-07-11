# Freestyle elevation notes (2026-07)

## iOS “typing” root cause + hard fix

**Root cause:** Safari treated Freestyle as text entry because the play path still mounted native `<input type="range">` (tempo + pitch in the kit drawer, plus the arena volume slider). Even with `inputMode="none"` and blur-on-change, focusing a range control on iOS can show the keyboard accessory bar / caret / writing chrome — especially when fullscreen or when another focusable page field sits behind the overlay.

**Hard fix shipped:**

1. **Zero form controls on the Freestyle play path** — tempo/pitch use button steppers (`PointerStepper`); freestyle volume uses −/＋ buttons (no `<input>` / `<textarea>` / `contenteditable`).
2. **Focus kill** — on Freestyle mount and every pad `pointerdown`: `document.activeElement?.blur()` + `window.getSelection()?.removeAllRanges()`.
3. **`inert` behind the arena** — siblings of the fixed `[role=application]` stage are marked `inert` so next-intl/theme/search chrome cannot steal focus.
4. **Exit fullscreen when entering Freestyle** — avoid fullscreen + residual input chrome pairing on iOS.
5. **CSS on arena/pads** — `-webkit-user-select: none; user-select: none; caret-color: transparent; -webkit-touch-callout: none`.
6. **Drawers/settings** — kit/seq panels use buttons only; drawers unmount when immersive/chart mode is on.
7. **Pads** — `tabIndex={-1}`, touch `preventDefault`, no focus rings that imply text editing.

## Shipped in this pass

- **Immersive / Solo** — hides kit, sequencer, and HUD chrome; pads + thin edge handle (tap or swipe up) restore controls; minimal exit affordance.
- **Song / Chart mode** — 6 original generative healer songs (crystal drive, forest pulse, golden heart, deep heal ritual, aurora spiral, sunroot groove). Timed pad charts, approaching highway cues, perfect/good/miss + streaks, stars, encore jam on that song’s kit. No copyrighted music — Web Audio beds + step charts only.
- **Retention** — daily song mission, unlockable themes/Holi dances via song clears, jam streak reactions, pick song → play chart → encore freestyle flow.
- **Pad fitting** — unchanged fit math (`fitPadDiameterPx` + inset layouts); verify unclipped on 390×844 smoke.

Beds are generative oscillators/noise only — no Spotify/YouTube/third-party audio assets.
