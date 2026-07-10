/**
 * Neural ambient beds via Web Audio API.
 *
 * Multiple zen/ambient beds + binaural variants per world.
 * Singing-bowl hits on node taps. Start only after a user gesture.
 */

import type { AudioBedId } from "@/lib/game/levels";

const DEFAULT_VOLUME = 0.35;

export type NeuralAmbientOptions = {
  volume?: number;
  bed?: AudioBedId;
};

type BedConfig = {
  carrierHz: number;
  beatHz: number;
  band: string;
  intent: string;
  padGain: number;
  binauralGain: number;
  droneHz: number[];
  noiseLp: number;
  noiseGain: number;
};

const BEDS: Record<AudioBedId, BedConfig> = {
  seed: {
    carrierHz: 220,
    beatHz: 6,
    band: "theta",
    intent: "calm focus",
    padGain: 0.55,
    binauralGain: 0.42,
    droneHz: [55, 82.5, 110],
    noiseLp: 480,
    noiseGain: 0.16,
  },
  root: {
    carrierHz: 196,
    beatHz: 10,
    band: "alpha",
    intent: "relaxed alertness",
    padGain: 0.58,
    binauralGain: 0.4,
    droneHz: [49, 73.5, 98],
    noiseLp: 420,
    noiseGain: 0.14,
  },
  mesh: {
    carrierHz: 233,
    beatHz: 5,
    band: "theta",
    intent: "deep weave",
    padGain: 0.5,
    binauralGain: 0.48,
    droneHz: [58, 87, 116],
    noiseLp: 560,
    noiseGain: 0.2,
  },
  orbit: {
    carrierHz: 246,
    beatHz: 7,
    band: "theta+",
    intent: "orbital focus",
    padGain: 0.52,
    binauralGain: 0.45,
    droneHz: [61.5, 92, 123],
    noiseLp: 520,
    noiseGain: 0.17,
  },
  deep: {
    carrierHz: 180,
    beatHz: 4,
    band: "delta-edge",
    intent: "deep sync",
    padGain: 0.62,
    binauralGain: 0.38,
    droneHz: [45, 67.5, 90],
    noiseLp: 360,
    noiseGain: 0.12,
  },
  master: {
    carrierHz: 261,
    beatHz: 8,
    band: "theta-alpha",
    intent: "master pulse",
    padGain: 0.48,
    binauralGain: 0.5,
    droneHz: [65, 98, 130],
    noiseLp: 640,
    noiseGain: 0.18,
  },
};

export class NeuralAmbient {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private binauralGain: GainNode | null = null;
  private padGain: GainNode | null = null;
  private bedNodes: AudioNode[] = [];
  private sharedNodes: AudioNode[] = [];
  private started = false;
  private muted = false;
  private volume = DEFAULT_VOLUME;
  private bed: AudioBedId = "seed";

  get isRunning() {
    return this.started && this.ctx?.state === "running";
  }

  get isMuted() {
    return this.muted;
  }

  get currentVolume() {
    return this.volume;
  }

  get currentBed() {
    return this.bed;
  }

  get bedMeta() {
    const c = BEDS[this.bed];
    return {
      carrierHz: c.carrierHz,
      beatHz: c.beatHz,
      band: c.band,
      intent: c.intent,
    };
  }

  /** Must be called from a user gesture. */
  async start(opts?: NeuralAmbientOptions) {
    if (typeof window === "undefined") return;
    if (opts?.volume != null) this.volume = clamp(opts.volume, 0, 1);
    if (opts?.bed) this.bed = opts.bed;

    if (!this.ctx) {
      const AC =
        window.AudioContext ||
        (
          window as unknown as {
            webkitAudioContext: typeof AudioContext;
          }
        ).webkitAudioContext;
      this.ctx = new AC();
      this.buildMaster(this.ctx);
    }

    this.rebuildBed(this.ctx!);

    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }

    this.applyVolume();
    this.started = true;
  }

  async setBed(bed: AudioBedId) {
    if (this.bed === bed && this.bedNodes.length) return;
    this.bed = bed;
    if (!this.ctx || !this.started) return;
    this.rebuildBed(this.ctx);
    this.applyVolume();
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
    this.teardownBed();
    for (const n of this.sharedNodes) {
      try {
        n.disconnect();
      } catch {
        /* already stopped */
      }
    }
    this.sharedNodes = [];
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

  /**
   * Singing-bowl / cuenco hit — inharmonic partials with exponential decay.
   */
  playBowlHit(nodeIndex = 0) {
    if (!this.ctx || this.muted || !this.started) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const dest = this.master;
    if (!dest) return;

    const base = 185 + (nodeIndex % 6) * 24;
    const partials: { ratio: number; gain: number; decay: number }[] = [
      { ratio: 1, gain: 0.42, decay: 1.8 },
      { ratio: 1.52, gain: 0.28, decay: 1.45 },
      { ratio: 2.05, gain: 0.18, decay: 1.15 },
      { ratio: 2.74, gain: 0.12, decay: 0.95 },
      { ratio: 3.48, gain: 0.07, decay: 0.7 },
      { ratio: 4.21, gain: 0.04, decay: 0.5 },
    ];

    const hitGain = ctx.createGain();
    hitGain.gain.value = 0.55;
    hitGain.connect(dest);

    for (const p of partials) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = base * p.ratio;

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(p.gain, now + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(4200, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + p.decay * 0.6);
      filter.Q.value = 0.9;

      osc.connect(g);
      g.connect(filter);
      filter.connect(hitGain);
      osc.start(now);
      osc.stop(now + p.decay + 0.05);
    }

    const noiseLen = Math.floor(ctx.sampleRate * 0.04);
    const buf = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (noiseLen * 0.18));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.22, now);
    ng.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    const nf = ctx.createBiquadFilter();
    nf.type = "bandpass";
    nf.frequency.value = 1800 + nodeIndex * 100;
    nf.Q.value = 1.2;
    noise.connect(nf);
    nf.connect(ng);
    ng.connect(hitGain);
    noise.start(now);
  }

  /** Soft chime on level clear / streak. */
  playChime() {
    if (!this.ctx || this.muted || !this.started || !this.master) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const freqs = [392, 523.25, 659.25];
    for (let i = 0; i < freqs.length; i++) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freqs[i]!;
      const g = ctx.createGain();
      const t0 = now + i * 0.08;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.18, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.9);
      osc.connect(g);
      g.connect(this.master);
      osc.start(t0);
      osc.stop(t0 + 1);
    }
  }

  private buildMaster(ctx: AudioContext) {
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

    this.sharedNodes.push(master, binauralGain, padGain);
  }

  private teardownBed() {
    for (const n of this.bedNodes) {
      try {
        n.disconnect();
        if ("stop" in n && typeof (n as OscillatorNode).stop === "function") {
          (n as OscillatorNode).stop();
        }
      } catch {
        /* already stopped */
      }
    }
    this.bedNodes = [];
  }

  private rebuildBed(ctx: AudioContext) {
    if (!this.binauralGain || !this.padGain) return;
    this.teardownBed();

    const cfg = BEDS[this.bed];
    this.binauralGain.gain.value = cfg.binauralGain;
    this.padGain.gain.value = cfg.padGain;

    this.addTone(ctx, cfg.carrierHz, -1, this.binauralGain, "sine");
    this.addTone(ctx, cfg.carrierHz + cfg.beatHz, 1, this.binauralGain, "sine");
    this.addTone(ctx, cfg.carrierHz * 2, -0.6, this.binauralGain, "sine", 0.08);
    this.addTone(
      ctx,
      (cfg.carrierHz + cfg.beatHz) * 2,
      0.6,
      this.binauralGain,
      "sine",
      0.08,
    );

    const pans = [0, -0.3, 0.3];
    const gains = [0.35, 0.12, 0.1];
    const types: OscillatorType[] = ["sine", "triangle", "sine"];
    cfg.droneHz.forEach((hz, i) => {
      this.addTone(
        ctx,
        hz,
        pans[i] ?? 0,
        this.padGain!,
        types[i] ?? "sine",
        gains[i] ?? 0.1,
      );
    });

    this.addNoisePad(ctx, this.padGain, cfg.noiseLp, cfg.noiseGain);
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

    this.bedNodes.push(osc, g, panner);
  }

  private addNoisePad(
    ctx: AudioContext,
    dest: AudioNode,
    lpHz: number,
    gainVal: number,
  ) {
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = lpHz;
    filter.Q.value = 0.7;

    const g = ctx.createGain();
    g.gain.value = gainVal;

    src.connect(filter);
    filter.connect(g);
    g.connect(dest);
    src.start();

    this.bedNodes.push(src, filter, g);
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Default bed meta for UI before audio starts. */
export const BINAURAL_META = {
  carrierHz: BEDS.seed.carrierHz,
  beatHz: BEDS.seed.beatHz,
  band: BEDS.seed.band,
  intent: BEDS.seed.intent,
} as const;

export function bedMeta(id: AudioBedId) {
  const c = BEDS[id];
  return {
    carrierHz: c.carrierHz,
    beatHz: c.beatHz,
    band: c.band,
    intent: c.intent,
  };
}
