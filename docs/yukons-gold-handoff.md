# Yukon's Gold ↔ Goth OS hand-off

Two things, for two different people:

1. **For whoever edits the game repo** (`kylegothman/yukons-gold`): a small change to `src/view/audio.ts` so the game follows the Goth OS volume slider when it is embedded.
2. **For the agent writing portfolio copy**: what the Projects card on the Goth OS "Aboot" tab needs.

---

## 1. Volume receiver — `src/view/audio.ts`

### Why

Goth OS (https://kylegothman.github.io/goth-os/) shows the game inside an iframe window and has one volume slider in its navbar. Each time the iframe finishes loading, and on every slider move after that, it posts this to the game's window:

```js
{ type: 'goth-os:volume', volume: 0.75 }   // volume is 0..1
```

Right now the game ignores it. `Sfx` already has a master `GainNode` at 0.7 (0 when muted), so the change is: scale that level by the received value. The game's own mute button keeps priority, and standalone (not embedded) nothing changes because the factor defaults to 1.

### The change — six small edits, all in `src/view/audio.ts`

**a. Name the master level.** Below `const MUTE_KEY = 'yukons-gold-muted';` add:

```ts
const MASTER_LEVEL = 0.7;
```

**b. Add a field to `Sfx`**, next to `muted = false;`:

```ts
  /** 0..1, set by Goth OS when the game is embedded there; 1 when standalone. */
  siteVolume = 1;
```

**c. Listen for the message in the constructor.** Replace the one-line constructor with:

```ts
  constructor() {
    try { this.muted = localStorage.getItem(MUTE_KEY) === '1'; } catch { /* default on */ }
    // Goth OS (kylegothman.github.io/goth-os) embeds the game and forwards its volume slider.
    window.addEventListener('message', (e: MessageEvent) => {
      if (!/^https:\/\/kylegothman\.github\.io$|^http:\/\/localhost(:\d+)?$/.test(e.origin)) return;
      if (!e.data || e.data.type !== 'goth-os:volume') return;
      this.setSiteVolume(Number(e.data.volume));
    });
  }
```

**d. Add two helpers** (anywhere in the class, e.g. right after `setMuted`):

```ts
  private level() { return this.muted ? 0 : MASTER_LEVEL * this.siteVolume; }

  setSiteVolume(v: number) {
    this.siteVolume = Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 1;
    if (this.ctx) this.master.gain.setTargetAtTime(this.level(), this.ctx.currentTime, 0.05);
  }
```

**e. In `start()`**, change

```ts
this.master = ctx.createGain(); this.master.gain.value = this.muted ? 0 : 0.7; this.master.connect(ctx.destination);
```

to

```ts
this.master = ctx.createGain(); this.master.gain.value = this.level(); this.master.connect(ctx.destination);
```

**f. In `setMuted()`**, change

```ts
if (this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 0.7, this.ctx.currentTime, 0.05);
```

to

```ts
if (this.ctx) this.master.gain.setTargetAtTime(this.level(), this.ctx.currentTime, 0.05);
```

Nothing else changes: `play()` and the cricket check still key off `muted`; with the site slider at 0 the master gain is 0, which is silence either way.

### Check it

`npm run ci` (the simulation tests don't touch audio, so it should pass unchanged). Then `npm run dev`, open the game, click once so audio starts, and in the DevTools console:

```js
window.postMessage({ type: 'goth-os:volume', volume: 0.25 }, '*');
__game.ses.sfx.master.gain.value   // → 0.175 (0.7 × 0.25) a moment later; back to 0.7 after volume: 1
```

Push to `main`; the repo's workflow deploys it, and the Goth OS window picks it up on its next load. Nothing changes on the Goth OS side.

---

## 2. Projects card copy — for the Goth OS "Aboot → Projects" tab

Each card has exactly these fields:

| Field | Format | Notes |
| --- | --- | --- |
| `name` | string | the card displays it lower-case ("yukon's gold") |
| `date` | `Mon YYYY` | the repo's single commit is dated 12 Nov 2026 → `Nov 2026`, unless you'd rather date it to when the game was actually built |
| `link` | URL | `https://github.com/kylegothman/yukons-gold` — the card links here and derives a live GitHub star button from it |
| `description` | 1–3 bullets, roughly 15–35 words each | plain voice, no marketing; see the examples below |
| `domains` | 2–4 short tags | tags with a colour already: `typescript`, `javascript`, `react`, `tailwindcss`, `python`, `postgresql`, `ai`, `sass`, `html5`. A new tag renders grey until a colour is added (one line); `three.js` would be a natural new one |

Also say **where in the list** it goes. Current order, top to bottom: Autonomous Trading System (May 2026), Hammerpick (Sep 2026), QuantumCanvas (Apr 2026), 3D Space Invaders (Jul 2026), Goth-OS Portfolio (Apr 2023), Groove Box (Apr 2023), See-Food (Feb 2023).

Worth working into the copy: it is playable inside Goth OS itself (the 3D Space Invaders card already says "playable right here on the Goth OS desktop"), plus the README's distinctive points — a deterministic simulation kept separate from the Three.js view, no asset files (every model and sound is generated in code), a single-file build, and the balance bot that plays full seasons.

House style, from cards already on the page:

> **3D Space Invaders** — "A 3D remake of Space Invaders, playable right here on the Goth OS desktop" — tags: javascript

> **QuantumCanvas** — "A browser-based quantum circuit composer and simulator: drag gates onto qubit wires, watch the state evolve across Bloch spheres and amplitude views, then export to QASM 2.0 or Qiskit" / "137 tests cover the gate math and QASM round-trips. Try it live at kylegothman.github.io/Quantum-Canvas" — tags: typescript, react, tailwindcss

Deliver it in that shape (name, date, link, bullets, tags, position) and it drops straight into `src/components/apps/aboot/Projects.tsx`.
