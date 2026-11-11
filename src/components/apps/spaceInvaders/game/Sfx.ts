import type { GameEvent } from './GameLogic';

/** Keeps 100 % on the site slider comfortably below painful. */
const MASTER_SCALE = 0.35;

interface Blip {
  type: OscillatorType;
  from: number;
  to: number;
  duration: number;
  gain: number;
  delay?: number;
}

const SOUNDS: Record<GameEvent, Blip[]> = {
  player_shot: [{ type: 'square', from: 880, to: 330, duration: 0.09, gain: 0.5 }],
  enemy_shot: [{ type: 'triangle', from: 220, to: 110, duration: 0.12, gain: 0.35 }],
  enemy_killed: [{ type: 'sawtooth', from: 260, to: 40, duration: 0.18, gain: 0.6 }],
  bunker_hit: [{ type: 'square', from: 150, to: 80, duration: 0.06, gain: 0.3 }],
  player_hit: [{ type: 'sawtooth', from: 400, to: 60, duration: 0.5, gain: 0.8 }],
  wave_cleared: [
    { type: 'square', from: 440, to: 440, duration: 0.1, gain: 0.5 },
    { type: 'square', from: 554, to: 554, duration: 0.1, gain: 0.5, delay: 0.1 },
    { type: 'square', from: 659, to: 659, duration: 0.18, gain: 0.5, delay: 0.2 },
  ],
  won: [
    { type: 'square', from: 523, to: 523, duration: 0.12, gain: 0.5 },
    { type: 'square', from: 659, to: 659, duration: 0.12, gain: 0.5, delay: 0.12 },
    { type: 'square', from: 784, to: 784, duration: 0.12, gain: 0.5, delay: 0.24 },
    { type: 'square', from: 1047, to: 1047, duration: 0.35, gain: 0.5, delay: 0.36 },
  ],
  lost: [
    { type: 'sawtooth', from: 330, to: 330, duration: 0.2, gain: 0.5 },
    { type: 'sawtooth', from: 262, to: 262, duration: 0.2, gain: 0.5, delay: 0.2 },
    { type: 'sawtooth', from: 196, to: 98, duration: 0.6, gain: 0.5, delay: 0.4 },
  ],
};

/**
 * Tiny synthesized retro sound effects. The original Java game is silent; these follow the
 * Goth OS volume slider. The AudioContext is created on the first key press (browser autoplay rules).
 */
export class Sfx {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private volume = 0.75;

  /** Call from a user gesture (key press) before the first sound. */
  unlock(): void {
    if (!this.ctx) {
      const Ctor = window.AudioContext
        ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volume * MASTER_SCALE;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  /** 0..1 */
  setVolume(volume: number): void {
    this.volume = volume;
    if (this.master) this.master.gain.value = volume * MASTER_SCALE;
  }

  play(event: GameEvent): void {
    if (!this.ctx || !this.master || this.volume <= 0) return;
    for (const blip of SOUNDS[event]) this.blip(this.ctx, this.master, blip);
  }

  private blip(ctx: AudioContext, out: GainNode, { type, from, to, duration, gain, delay = 0 }: Blip): void {
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t0 + duration);
    env.gain.setValueAtTime(gain, t0);
    env.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
    osc.connect(env).connect(out);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  dispose(): void {
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
  }
}
