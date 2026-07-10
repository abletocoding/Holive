/**
 * Neural ambient bed via Web Audio API.
 *
 * Binaural beats: carrier 220 Hz L / 226 Hz R → 6 Hz difference
 * (theta band, calm focus). Soft zen pad (filtered noise + low drone)
 * sits underneath. Start only after a user gesture (resume AudioContext).
 */

const CARRIER_HZ = 220;
const BEAT_HZ = 6; // theta — calm focus
const DEFAULT_VOLUME = 0.35;

export type NeuralAmbientOptions = {
  volume?: number;
};

export class NeuralAmbient {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private binauralGain: GainNode | null = null;
  private padGain: GainNode | null = null;
  private nodes: AudioNode[] = [];
  private started = false;
  private muted = false;
  private volume = DEFAULT_VOLUME;

  get isRunning() {
    return this.started && this.ctx?.state === "running";
  }

  get isMuted() {
    return this.muted;
  }

  get currentVolume() {
    return this.volume;
  }

  /** Must be called from a user gesture. */
  async start(opts?: NeuralAmbientOptions) {
    if (typeof window === "undefined") return;
    if (opts?.volume != null) this.volume = clamp(opts.volume, 0, 1);

    if (!this.ctx) {
      const AC =
        window.AudioContext ||
        (
          window as unknown as {
            webkitAudioContext: typeof AudioContext;
          }
        ).webkitAudioContext;
      this.ctx = new AC();
      this.buildGraph(this.ctx);
    }

    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }

    this.applyVolume();
    this.started = true;
  }

  setVolume(v: number) {
    this.volume = clamp(v, 0, 1);
    this.applyVolume();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    this.applyVolume();
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  stop() {
    this.started = false;
    if (this.master && this.ctx) {
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setValueAtTime(this.master.gain.value, now);
      this.master.gain.linearRampToValueAtTime(0, now + 0.35);
    }
    window.setTimeout(() => this.dispose(), 400);
  }

  dispose() {
    for (const n of this.nodes) {
      try {
        n.disconnect();
        if ("stop" in n && typeof (n as OscillatorNode).stop === "function") {
          (n as OscillatorNode).stop();
        }
      } catch {
        /* already stopped */
      }
    }
    this.nodes = [];
    this.master = null;
    this.binauralGain = null;
    this.padGain = null;
    if (this.ctx) {
      void this.ctx.close().catch(() => undefined);
      this.ctx = null;
    }
    this.started = false;
  }

  private applyVolume() {
    if (!this.master || !this.ctx) return;
    const target = this.muted ? 0 : this.volume;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(target, now + 0.12);
  }

  private buildGraph(ctx: AudioContext) {
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    this.master = master;

    const binauralGain = ctx.createGain();
    binauralGain.gain.value = 0.45;
    binauralGain.connect(master);
    this.binauralGain = binauralGain;

    const padGain = ctx.createGain();
    padGain.gain.value = 0.55;
    padGain.connect(master);
    this.padGain = padGain;

    // --- Binaural: two slightly detuned carriers, hard-panned L/R ---
    this.addTone(ctx, CARRIER_HZ, -1, binauralGain, "sine");
    this.addTone(ctx, CARRIER_HZ + BEAT_HZ, 1, binauralGain, "sine");

    // Soft harmonic shimmer (very quiet)
    this.addTone(ctx, CARRIER_HZ * 2, -0.6, binauralGain, "sine", 0.08);
    this.addTone(ctx, (CARRIER_HZ + BEAT_HZ) * 2, 0.6, binauralGain, "sine", 0.08);

    // --- Zen pad: low drone + filtered noise ---
    this.addTone(ctx, 55, 0, padGain, "sine", 0.35);
    this.addTone(ctx, 82.5, -0.3, padGain, "triangle", 0.12);
    this.addTone(ctx, 110, 0.3, padGain, "sine", 0.1);
    this.addNoisePad(ctx, padGain);

    this.nodes.push(master, binauralGain, padGain);
  }

  private addTone(
    ctx: AudioContext,
    freq: number,
    pan: number,
    dest: AudioNode,
    type: OscillatorType,
    gain = 0.22,
  ) {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;

    const g = ctx.createGain();
    g.gain.value = gain;

    const panner = ctx.createStereoPanner();
    panner.pan.value = pan;

    osc.connect(g);
    g.connect(panner);
    panner.connect(dest);
    osc.start();

    this.nodes.push(osc, g, panner);
  }

  private addNoisePad(ctx: AudioContext, dest: AudioNode) {
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      // Brown-ish noise (softer than white)
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 480;
    filter.Q.value = 0.7;

    const g = ctx.createGain();
    g.gain.value = 0.18;

    src.connect(filter);
    filter.connect(g);
    g.connect(dest);
    src.start();

    this.nodes.push(src, filter, g);
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Documented beat params for UI / comments. */
export const BINAURAL_META = {
  carrierHz: CARRIER_HZ,
  beatHz: BEAT_HZ,
  band: "theta",
  intent: "calm focus",
} as const;
