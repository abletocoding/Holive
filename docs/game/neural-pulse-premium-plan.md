# Neural Pulse Premium Plan

## 5.0 Freestyle / Healing Drum as first-class mode

Neural Pulse now treats **Classic Pulse** and **Freestyle Healing Drum** as sibling training modes rather than a single linear memory game.

- **Classic Pulse** remains the score-and-clear experience: sequence memory, progressive depths, rewards, and lead capture after deeper progress.
- **Freestyle Healing Drum** is a no-fail rhythm space: tuned pads, persisted kit preferences, heal audio bed, metronome, session timer, and hit tracking.
- The arena opens to a **Train Hub** so players choose intent first: focus challenge or healing rhythm.

### P2 product scope

P2 should elevate Freestyle from playful side mode to a premium practice loop:

1. Expand kit presets for focus, calm, launch, and recovery rituals.
2. Add richer session summaries: hits, duration, tempo, favorite pad, and completed missions.
3. Unlock Freestyle cosmetic themes through daily mission streaks.
4. Offer a soft CTA after meaningful practice, parallel to Classic deep-progress lead capture.
5. Persist mission history so daily progress can become weekly rhythm insights.

### Domains

- **Game domain:** phases `train`, `hub`, `freestyle`, and Classic play states.
- **Audio domain:** Classic beds plus `heal`; Freestyle hits use drum + pad layers and optional metronome clicks.
- **Persistence domain:** Classic progress, Freestyle kit preferences, and daily mission progress in localStorage.
- **Growth domain:** keep LeadCapture/email CTA and Supabase score inserts intact while introducing Freestyle practice signals.
- **Content domain:** bilingual HoliGame copy for hubs, Freestyle controls, and missions.

### Missions

Daily missions combine Classic and Freestyle so both modes contribute to player momentum:

- Clear one Classic depth.
- Reach today's Classic score target.
- Land today's Freestyle drum hit target.
- Hold a healing Freestyle session for the daily duration target.

Mission recording should happen at gameplay boundaries:

- Classic score on miss or clear.
- Classic clear on level completion.
- Freestyle hit on each pad tap.
- Freestyle session duration when leaving Freestyle or exiting the arena.
