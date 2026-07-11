# Neural Pulse Premium Plan

## 5.0 Freestyle / Healing Drum as first-class mode

Neural Pulse now treats **Classic Pulse** and **Freestyle Healing Drum** as sibling training modes rather than a single linear memory game.

- **Classic Pulse** remains the score-and-clear experience: sequence memory, progressive depths, rewards, and lead capture after deeper progress.
- **Freestyle Healing Drum** is a no-fail rhythm space: tuned pads, persisted kit preferences, heal audio bed, metronome, session timer, and hit tracking.
- The arena opens to a **Train Hub** so players choose intent first: focus challenge or healing rhythm.

Freestyle is intentionally **free play, not Simon**. It should feel like sanación inside the Holive palette: calm purple/gold visuals, grounded drum transients, soft pad tones, and a rhythm assist that supports breath instead of judging failure. Any neuroplasticity language should stay careful: the product can talk about rhythm, calm, repetition, and attention practice; it should not claim medical treatment or guaranteed brain change.

### Hero differentiator

The premium differentiator is that Neural Pulse is not only a memory game. It becomes a tiny ritual instrument:

- Classic proves focus under constraint.
- Freestyle lets the player create rhythm and calm without a fail state.
- Missions connect both modes into one daily loop.
- Visual ripples and gold-dust feedback make every hit feel alive and branded.

### P2 product scope

P2 should elevate Freestyle from playful side mode to a premium practice loop:

1. Expand kit presets for focus, calm, launch, and recovery rituals.
2. Support customizable layouts, sounds, and themes:
   - 4 / 6 / 8 pad layouts.
   - Pitch controls per pad.
   - Theme presets inside Holive purple, gold, black, and healing variants.
   - Future timbre controls such as soft bowl, hand drum, digital pluck, and warm pad.
3. Add rhythm assist:
   - Optional metronome.
   - Gentle tempo bands for breath-led practice.
   - Session timer with calm completion states.
4. Add richer session summaries: hits, duration, tempo, favorite pad, selected theme, and completed missions.
5. Unlock Freestyle cosmetic themes through daily mission streaks.
6. Offer a soft CTA after meaningful practice, parallel to Classic deep-progress lead capture.
7. Move persistence from `localStorage` → Supabase when the product needs cross-device continuity, mission history, and lead-linked practice summaries.
8. Keep claims careful: position this as ritmo y calma, not a clinical neuroplasticity promise.

### Domains

- **Game domain:** phases `train`, `hub`, `freestyle`, and Classic play states.
- **Audio domain:** Classic beds plus `heal`; Freestyle hits use drum + pad layers and optional metronome clicks.
- **Freestyle domain:** kit layout, theme, tempo, metronome, per-pad pitch, hit count, session duration, and active visual feedback.
- **Persistence domain:** Classic progress, Freestyle kit preferences, and daily mission progress in localStorage first; Supabase later for account-backed continuity.
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

Phase 2 missions should make Freestyle feel like a first-class daily habit:

- Play a 3-minute healing session.
- Try a new 4 / 6 / 8 pad layout.
- Tune one pad and complete a short rhythm.
- Complete one Classic depth and one Freestyle session in the same day.
- Maintain a weekly rhythm streak without using fear-of-loss language.
