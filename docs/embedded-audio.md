# Site volume for embedded apps

The slider in the Goth OS navbar is the one volume control for the whole desktop. Apps that run
inside an `<iframe>` (Groove Box, and anything added later) receive the level as a window message:

```js
{ type: 'goth-os:volume', volume: 0.75 }   // volume is 0..1
```

Goth OS sends it whenever the slider moves and again each time the iframe loads
(`src/components/utils/useIframeVolume.ts`).

## Receiver for Groove Box (Tone.js)

Add this once, anywhere in `src/js/main.js` of the `groove-box` repo. Tone.js volume is in decibels,
so the 0..1 level is converted with `20·log10(v)`; 0 maps to silence.

```js
// Goth OS (kylegothman.github.io/goth-os) embeds this page and forwards its master volume.
window.addEventListener('message', (event) => {
  const trusted = /^https:\/\/kylegothman\.github\.io$|^http:\/\/localhost(:\d+)?$/;
  if (!trusted.test(event.origin) || event.data?.type !== 'goth-os:volume') return;

  const level = Math.min(1, Math.max(0, Number(event.data.volume)));
  const destination = typeof Tone.getDestination === 'function' ? Tone.getDestination() : Tone.Destination;
  destination.volume.value = level === 0 ? -Infinity : 20 * Math.log10(level);
});
```

## Receiver for Yukon's Gold (`src/view/audio.ts` in the yukons-gold repo)

`Sfx` already owns a master `GainNode` (0.7, or 0 when muted). Scale it by the site volume:

```ts
const MASTER_LEVEL = 0.7;

export class Sfx {
  // ...existing fields...
  /** 0..1, forwarded by Goth OS when the game is embedded there. */
  siteVolume = 1;

  constructor() {
    try { this.muted = localStorage.getItem(MUTE_KEY) === '1'; } catch { /* default on */ }
    window.addEventListener('message', (e) => {
      if (!/^https:\/\/kylegothman\.github\.io$|^http:\/\/localhost(:\d+)?$/.test(e.origin)) return;
      if (e.data?.type !== 'goth-os:volume') return;
      this.setSiteVolume(Number(e.data.volume));
    });
  }

  private level() { return this.muted ? 0 : MASTER_LEVEL * this.siteVolume; }

  setSiteVolume(v: number) {
    this.siteVolume = Math.min(1, Math.max(0, v || 0));
    if (this.ctx) this.master.gain.setTargetAtTime(this.level(), this.ctx.currentTime, 0.05);
  }
  // in start():   this.master.gain.value = this.level();
  // in setMuted(): this.master.gain.setTargetAtTime(this.level(), this.ctx.currentTime, 0.05);
}
```

## Receiver for a plain `<audio>` / `<video>` page

```js
window.addEventListener('message', (event) => {
  if (event.data?.type !== 'goth-os:volume') return;
  document.querySelectorAll('audio, video').forEach((el) => { el.volume = event.data.volume; });
});
```

## Not controllable

The Music Player is a Spotify embed. Spotify's iFrame API exposes play/pause/seek but no volume
control, so the slider cannot affect it.
