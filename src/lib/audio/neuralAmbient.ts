/**
 * Neural ambient beds via Web Audio API.
 *
 * Distinct zen/ambient beds + binaural variants per depth.
 * Smooth crossfade on bed change. Singing-bowl hits on node taps.
 * Start only after a user gesture.
 */

import type { AudioBedId } from "@/lib/game/levels";

const DEFAULT_VOLUME = 0.35;
const CROSSFADE_SEC = 0.85;

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
  lfoHz?: number;
  lfoDepth?: number;
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
    lfoHz: 0.08,
    lfoDepth: 0.04,
  },
  heal: {
    carrierHz: 216,
    beatHz: 4.5,
    band: "theta-heal",
    intent: "healing drum",
    padGain: 0.64,
    binauralGain: 0.36,
    droneHz: [54, 81, 108, 162],
    noiseLp: 380,
    noiseGain: 0.13,
    lfoHz: 0.04,
    lfoDepth: 0.035,
  },
  sprout: {
    carrierHz: 208,
    beatHz: 7.5,
    band: "theta+",
    intent: "gentle lift",
    padGain: 0.52,
    binauralGain: 0.4,
    droneHz: [52, 78, 104, 156],
    noiseLp: 520,
    noiseGain: 0.15,
    lfoHz: 0.12,
    lfoDepth: 0.05,
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
    lfoHz: 0.06,
    lfoDepth: 0.03,
  },
  stem: {
    carrierHz: 233,
    beatHz: 9,
    band: "alpha-",
    intent: "rising stem",
    padGain: 0.54,
    binauralGain: 0.44,
    droneHz: [58, 87, 116, 174],
    noiseLp: 500,
    noiseGain: 0.17,
    lfoHz: 0.1,
    lfoDepth: 0.06,
  },
  mesh: {
    carrierHz: 246,
    beatHz: 5,
    band: "theta",
    intent: "deep weave",
    padGain: 0.5,
    binauralGain: 0.48,
    droneHz: [61.5, 92, 123],
    noiseLp: 560,
    noiseGain: 0.2,
    lfoHz: 0.15,
    lfoDepth: 0.07,
  },
  orbit: {
    carrierHz: 261,
    beatHz: 7,
    band: "theta+",
    intent: "orbital focus",
    padGain: 0.52,
    binauralGain: 0.45,
    droneHz: [65, 98, 130],
    noiseLp: 540,
    noiseGain: 0.17,
    lfoHz: 0.18,
    lfoDepth: 0.08,
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
    lfoHz: 0.05,
    lfoDepth: 0.04,
  },
  master: {
    carrierHz: 277,
    beatHz: 8,
    band: "theta-alpha",
    intent: "master pulse",
    padGain: 0.48,
    binauralGain: 0.5,
    droneHz: [69, 104, 138, 207],
    noiseLp: 640,
    noiseGain: 0.18,
    lfoHz: 0.22,
    lfoDepth: 0.09,
  },
};

export class NeuralAmbient {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bedBus: GainNode | null = null;
  private activeBedGain: GainNode | null = null;
  private bedNodes: AudioNode[] = [];
  private fadingNodes: AudioNode[] = [];
  private sharedNodes: AudioNode[] = [];
  private started = false;
  private muted = false;
  private volume = DEFAULT_VOLUME;
  private bed: AudioBedId = "seed";
  private crossfadeTimer: ReturnType<typeof setTimeout> | null = null;
  private visibilityHandler: (() => void) | null = null;

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
      this.bindVisibility();
    }

    if (!this.activeBedGain || this.bedNodes.length === 0) {
      this.spawnBed(this.ctx!, this.bed, 0);
    }

    if (this.ctx.state === "suspended" && !this.muted) {
      await this.ctx.resume();
    }

    this.applyVolume();
    this.started = true;
  }

  async setBed(bed: AudioBedId) {
    if (this.bed === bed && this.bedNodes.length) return;
    const prev = this.bed;
    this.bed = bed;
    if (!this.ctx || !this.started || !this.bedBus) return;
    if (prev === bed) return;
    this.crossfadeTo(this.ctx, bed);
    this.applyVolume();
  }

  setVolume(v: number) {
    this.volume = clamp(v, 0, 1);
    this.applyVolume();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    this.applyVolume();
    if (!this.ctx) return;
    if (muted) {
      void this.ctx.suspend().catch(() => undefined);
    } else if (this.started) {
      void this.ctx.resume().catch(() => undefined);
    }
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  /** Pause processing when arena exits or tab hides. */
  pauseGraph() {
    if (!this.ctx) return;
    void this.ctx.suspend().catch(() => undefined);
  }

  resumeGraph() {
    if (!this.ctx || this.muted || !this.started) return;
    void this.ctx.resume().catch(() => undefined);
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
    if (this.crossfadeTimer) {
      clearTimeout(this.crossfadeTimer);
      this.crossfadeTimer = null;
    }
    this.unbindVisibility();
    this.teardownBed(this.bedNodes);
    this.teardownBed(this.fadingNodes);
    this.bedNodes = [];
    this.fadingNodes = [];
    this.activeBedGain = null;
    for (const n of this.sharedNodes) {
      try {
        n.disconnect();
      } catch {
        /* already stopped */
      }
    }
    this.sharedNodes = [];
    this.master = null;
    this.bedBus = null;
    if (this.ctx) {
      void this.ctx.close().catch(() => undefined);
      this.ctx = null;
    }
    this.started = false;
  }

  private bindVisibility() {
    if (typeof document === "undefined" || this.visibilityHandler) return;
    this.visibilityHandler = () => {
      if (document.hidden) this.pauseGraph();
      else this.resumeGraph();
    };
    document.addEventListener("visibilitychange", this.visibilityHandler);
  }

  private unbindVisibility() {
    if (!this.visibilityHandler) return;
    document.removeEventListener("visibilitychange", this.visibilityHandler);
    this.visibilityHandler = null;
  }

  private applyVolume() {
    if (!this.master || !this.ctx) return;
    const target = this.muted ? 0 : this.volume;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(Math.max(0.0001, this.master.gain.value), now);
    this.master.gain.linearRampToValueAtTime(Math.max(0.0001, target) * (target === 0 ? 0 : 1), now + 0.12);
    if (target === 0) {
      this.master.gain.linearRampToValueAtTime(0, now + 0.12);
    }
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

  /** Shorter tuned pad hit for freestyle pads and UI previews. */
  playPadHit(nodeIndex = 0, toneHz?: number) {
    if (!this.ctx || this.muted || !this.started || !this.master) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const base = toneHz ?? 196 + (nodeIndex % 8) * 28;

    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, now);
    out.gain.exponentialRampToValueAtTime(0.28, now + 0.014);
    out.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
    out.connect(this.master);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2600, now);
    filter.frequency.exponentialRampToValueAtTime(900, now + 0.7);
    filter.Q.value = 0.8;
    filter.connect(out);

    [1, 1.5, 2].forEach((ratio, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? "sine" : "triangle";
      osc.frequency.value = base * ratio;
      const g = ctx.createGain();
      g.gain.value = i === 0 ? 0.55 : 0.16;
      osc.connect(g);
      g.connect(filter);
      osc.start(now);
      osc.stop(now + 0.95);
    });
  }

  /** Low hand-drum transient used by Freestyle healing mode. */
  playDrumHit(nodeIndex = 0) {
    if (!this.ctx || this.muted || !this.started || !this.master) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const base = 88 + (nodeIndex % 4) * 12;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(base * 1.6, now);
    osc.frequency.exponentialRampToValueAtTime(base, now + 0.12);

    const body = ctx.createGain();
    body.gain.setValueAtTime(0.0001, now);
    body.gain.exponentialRampToValueAtTime(0.42, now + 0.01);
    body.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

    const noiseLen = Math.floor(ctx.sampleRate * 0.08);
    const buf = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (noiseLen * 0.24));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const nf = ctx.createBiquadFilter();
    nf.type = "lowpass";
    nf.frequency.value = 900 + nodeIndex * 80;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.18, now);
    ng.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(body);
    body.connect(this.master);
    noise.connect(nf);
    nf.connect(ng);
    ng.connect(this.master);
    osc.start(now);
    osc.stop(now + 0.5);
    noise.start(now);
  }

  playFreestyleHit(nodeIndex = 0, toneHz?: number) {
    this.playDrumHit(nodeIndex);
    this.playPadHit(nodeIndex, toneHz);
  }

  playMetronomeClick(accent = false) {
    if (!this.ctx || this.muted || !this.started || !this.master) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.value = accent ? 1400 : 980;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(accent ? 0.18 : 0.12, now + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);

    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = accent ? 1400 : 980;
    f.Q.value = 6;

    osc.connect(f);
    f.connect(g);
    g.connect(this.master);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  /** Soft chime on level clear / streak. */
  playChime() {
    if (!this.ctx || this.muted || !this.started || !this.master) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const freqs = [392, 523.25, 659.25, 784];
    for (let i = 0; i < freqs.length; i++) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freqs[i]!;
      const g = ctx.createGain();
      const t0 = now + i * 0.07;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.16, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.1);
      osc.connect(g);
      g.connect(this.master);
      osc.start(t0);
      osc.stop(t0 + 1.2);
    }
  }

  /** Richer celebrate flourish for victory / clear. */
  playCelebrate() {
    if (!this.ctx || this.muted || !this.started || !this.master) return;
    this.playChime();
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const sparkle = [1046.5, 1318.5, 1568];
    for (let i = 0; i < sparkle.length; i++) {
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = sparkle[i]!;
      const g = ctx.createGain();
      const t0 = now + 0.25 + i * 0.05;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.08, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55);
      osc.connect(g);
      g.connect(this.master);
      osc.start(t0);
      osc.stop(t0 + 0.6);
    }
  }

  private buildMaster(ctx: AudioContext) {
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    this.master = master;

    const bedBus = ctx.createGain();
    bedBus.gain.value = 1;
    bedBus.connect(master);
    this.bedBus = bedBus;

    this.sharedNodes.push(master, bedBus);
  }

  private teardownBed(nodes: AudioNode[]) {
    for (const n of nodes) {
      try {
        n.disconnect();
        if ("stop" in n && typeof (n as OscillatorNode).stop === "function") {
          (n as OscillatorNode).stop();
        }
      } catch {
        /* already stopped */
      }
    }
  }

  private crossfadeTo(ctx: AudioContext, bed: AudioBedId) {
    if (this.crossfadeTimer) {
      clearTimeout(this.crossfadeTimer);
      this.crossfadeTimer = null;
    }

    const now = ctx.currentTime;
    const oldGain = this.activeBedGain;
    const oldNodes = this.bedNodes;

    // Move old into fading set
    this.fadingNodes.push(...oldNodes);
    if (oldGain) {
      oldGain.gain.cancelScheduledValues(now);
      oldGain.gain.setValueAtTime(Math.max(0.0001, oldGain.gain.value), now);
      oldGain.gain.linearRampToValueAtTime(0.0001, now + CROSSFADE_SEC);
    }

    this.spawnBed(ctx, bed, CROSSFADE_SEC);

    this.crossfadeTimer = setTimeout(() => {
      this.teardownBed(this.fadingNodes);
      this.fadingNodes = [];
      this.crossfadeTimer = null;
    }, CROSSFADE_SEC * 1000 + 80);
  }

  private spawnBed(ctx: AudioContext, bed: AudioBedId, fadeInSec: number) {
    if (!this.bedBus) return;
    const cfg = BEDS[bed];
    const bedGain = ctx.createGain();
    const now = ctx.currentTime;
    if (fadeInSec > 0) {
      bedGain.gain.setValueAtTime(0.0001, now);
      bedGain.gain.linearRampToValueAtTime(1, now + fadeInSec);
    } else {
      bedGain.gain.value = 1;
    }
    bedGain.connect(this.bedBus);

    const nodes: AudioNode[] = [bedGain];
    const binauralGain = ctx.createGain();
    binauralGain.gain.value = cfg.binauralGain;
    binauralGain.connect(bedGain);
    nodes.push(binauralGain);

    const padGain = ctx.createGain();
    padGain.gain.value = cfg.padGain;
    padGain.connect(bedGain);
    nodes.push(padGain);

    this.addTone(ctx, cfg.carrierHz, -1, binauralGain, "sine", 0.22, nodes);
    this.addTone(ctx, cfg.carrierHz + cfg.beatHz, 1, binauralGain, "sine", 0.22, nodes);
    this.addTone(ctx, cfg.carrierHz * 2, -0.6, binauralGain, "sine", 0.08, nodes);
    this.addTone(
      ctx,
      (cfg.carrierHz + cfg.beatHz) * 2,
      0.6,
      binauralGain,
      "sine",
      0.08,
      nodes,
    );

    const pans = [0, -0.35, 0.35, 0.15];
    const gains = [0.35, 0.12, 0.1, 0.07];
    const types: OscillatorType[] = ["sine", "triangle", "sine", "sine"];
    cfg.droneHz.forEach((hz, i) => {
      this.addTone(
        ctx,
        hz,
        pans[i] ?? 0,
        padGain,
        types[i] ?? "sine",
        gains[i] ?? 0.1,
        nodes,
        cfg.lfoHz,
        cfg.lfoDepth,
      );
    });

    this.addNoisePad(ctx, padGain, cfg.noiseLp, cfg.noiseGain, nodes);

    this.activeBedGain = bedGain;
    this.bedNodes = nodes;
  }

  private addTone(
    ctx: AudioContext,
    freq: number,
    pan: number,
    dest: AudioNode,
    type: OscillatorType,
    gain = 0.22,
    bucket: AudioNode[],
    lfoHz?: number,
    lfoDepth?: number,
  ) {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;

    const g = ctx.createGain();
    g.gain.value = gain;

    const panner = ctx.createStereoPanner();
    panner.pan.value = pan;

    if (lfoHz && lfoDepth) {
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = lfoHz;
      const lfoG = ctx.createGain();
      lfoG.gain.value = freq * lfoDepth;
      lfo.connect(lfoG);
      lfoG.connect(osc.frequency);
      lfo.start();
      bucket.push(lfo, lfoG);
    }

    osc.connect(g);
    g.connect(panner);
    panner.connect(dest);
    osc.start();

    bucket.push(osc, g, panner);
  }

  private addNoisePad(
    ctx: AudioContext,
    dest: AudioNode,
    lpHz: number,
    gainVal: number,
    bucket: AudioNode[],
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

    bucket.push(src, filter, g);
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
