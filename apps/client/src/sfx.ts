import type { BattleEvent, PlayerIndex } from '@koidle/rules';
import { type SfxCue, sfxFor } from './sfxMap';

// WebAudio ile üretilen kısa efektler; ses dosyası yok. AudioContext ilk kullanıcı
// dokunuşundan sonra açılır (tarayıcı otomatik oynatma kuralı).

const KEY = 'koidle.sfx.muted';

let ctx: AudioContext | null = null;
let unlocked = false;
let muted = false;
const listeners = new Set<() => void>();

try {
  muted = localStorage.getItem(KEY) === '1';
} catch {
  /* depolama yok: varsayılan açık */
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(v: boolean): void {
  muted = v;
  try {
    localStorage.setItem(KEY, v ? '1' : '0');
  } catch {
    /* yok say */
  }
  for (const l of listeners) l();
}

export function subscribeMuted(l: () => void): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

function unlock(): void {
  if (unlocked) return;
  unlocked = true;
  try {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AC) ctx = new AC();
    void ctx?.resume();
  } catch {
    ctx = null;
  }
}

if (typeof window !== 'undefined') {
  for (const ev of ['pointerdown', 'keydown', 'touchstart'] as const) {
    window.addEventListener(ev, unlock, { passive: true });
  }
}

interface Tone {
  f: number;
  to?: number;
  dur: number;
  type?: OscillatorType;
  gain?: number;
  at?: number;
}

function tone(c: AudioContext, t0: number, o: Tone): void {
  const osc = c.createOscillator();
  const g = c.createGain();
  const start = t0 + (o.at ?? 0);
  osc.type = o.type ?? 'sine';
  osc.frequency.setValueAtTime(o.f, start);
  if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, start + o.dur);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(o.gain ?? 0.15, start + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, start + o.dur);
  osc.connect(g).connect(c.destination);
  osc.start(start);
  osc.stop(start + o.dur + 0.02);
}

function noise(c: AudioContext, t0: number, dur: number, gain: number): void {
  const n = Math.max(1, Math.floor(c.sampleRate * dur));
  const buf = c.createBuffer(1, n, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const src = c.createBufferSource();
  src.buffer = buf;
  const g = c.createGain();
  g.gain.value = gain;
  src.connect(g).connect(c.destination);
  src.start(t0);
}

function playCue(c: AudioContext, cue: SfxCue, t0: number): void {
  switch (cue.kind) {
    case 'play':
      tone(c, t0, { f: 520, to: 880, dur: 0.09, type: 'triangle', gain: 0.1 });
      break;
    case 'hit': {
      const k = Math.min(1, cue.amount / 16); // 0..1 şiddet
      tone(c, t0, {
        f: 170 - 70 * k,
        to: 45,
        dur: 0.12 + 0.18 * k,
        type: 'sawtooth',
        gain: 0.14 + 0.2 * k,
      });
      noise(c, t0, 0.06 + 0.12 * k, 0.1 + 0.2 * k);
      break;
    }
    case 'shield':
      tone(c, t0, { f: 660, to: 990, dur: 0.14, type: 'square', gain: 0.07 });
      tone(c, t0, { f: 990, dur: 0.2, type: 'sine', gain: 0.08, at: 0.08 });
      break;
    case 'crit':
      tone(c, t0, { f: 1200, to: 400, dur: 0.18, type: 'square', gain: 0.1 });
      tone(c, t0, { f: 1600, dur: 0.1, type: 'triangle', gain: 0.08, at: 0.05 });
      break;
    case 'evade':
      tone(c, t0, { f: 300, to: 1400, dur: 0.16, type: 'sine', gain: 0.09 });
      break;
    case 'poison':
      tone(c, t0, { f: 220, to: 120, dur: 0.14, type: 'sawtooth', gain: 0.06 });
      tone(c, t0, { f: 180, to: 100, dur: 0.14, type: 'sawtooth', gain: 0.05, at: 0.1 });
      break;
    case 'win':
      [523, 659, 784, 1047].forEach((f, i) => {
        tone(c, t0, { f, dur: 0.22, type: 'triangle', gain: 0.12, at: i * 0.12 });
      });
      break;
    case 'lose':
      [392, 330, 262, 196].forEach((f, i) => {
        tone(c, t0, { f, dur: 0.28, type: 'sawtooth', gain: 0.08, at: i * 0.16 });
      });
      break;
  }
}

/** Olay yığınına karşılık gelen sesleri çalar (sessizde, kilitliyken ya da API yokken sessiz). */
export function playSfxFor(events: readonly BattleEvent[], me: PlayerIndex): void {
  if (muted || !ctx) return;
  const cues = sfxFor(events, me);
  if (cues.length === 0) return;
  try {
    void ctx.resume();
    const t0 = ctx.currentTime;
    // Çok ses üst üste binmesin: en fazla 4 işaret, hafif ötelenir.
    cues.slice(0, 4).forEach((cue, i) => {
      if (ctx) playCue(ctx, cue, t0 + i * 0.07);
    });
  } catch {
    /* ses hatası oyunu bozmaz */
  }
}
