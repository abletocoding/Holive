# Freestyle elevation notes (2026-07)

## Shipped in this pass

- **iOS keyboard fix**: no text focus on play surface; range sliders blur after change (`inputMode="none"`); pad `touch-action: manipulation` + touchstart preventDefault; blur `activeElement` on Freestyle enter; LeadCapture stays off freestyle play.
- **Healer beds** (fully synthesized Web Audio, no downloads): `crystal`, `forest`, `deepheal`, `golden`, plus classic `heal`. Crossfade via existing ambient engine; preference in kit localStorage.
- **Step sequencer**: 8/16 steps, multi-track pad grid, paint + tap-record, play/stop loop synced to tempo/metronome, pattern presets, saved with kit.
- **Jam depth**: breath-gated pads, intention timer (warm/flow/cool), harmonic scale mode, mood chips (no keyboard), Holi streak reactions, pattern library.
- **Pad clipping fix**: board uses `max-h` against `svh`, inset layouts (18–82%), `ResizeObserver` + `fitPadDiameterPx` so 4/6/8 pads stay fully inside the play area on 320–430 widths and short heights (~667+).
- **UI**: sacred-matrix Freestyle board, kit/sequencer drawers, Train hub crayon-premium mode cards.

Beds are generative oscillators/noise only — no Spotify/YouTube/third-party audio assets.
