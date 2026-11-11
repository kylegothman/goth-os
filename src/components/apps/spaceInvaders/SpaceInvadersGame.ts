import { GameLogic, type GameState } from './game/GameLogic';
import { Input } from './game/Input';
import { Sfx } from './game/Sfx';
import { createModels } from './game/Models';
import { SceneRenderer } from './render/SceneRenderer';

export interface HudState {
  inMenu: boolean;
  paused: boolean;
  score: number;
  wave: number;
  maxWaves: number;
  lives: number;
  state: GameState;
}

type Frame = 0 | 1;

// Main.java toggled these every N frames of its 60 fps animator; expressed here in seconds.
const FLAP_INTERVAL = 20 / 60;
const BOLT_INTERVAL = 6 / 60;
/** angle += 0.7° per frame at 60 fps */
const MENU_SPIN_DEG_PER_SEC = 0.7 * 60;
const MAX_FRAME_DT = 0.1;

/**
 * Owns the loop: input → game logic → scene, plus title screen, pause and sound.
 * Equivalent of Main.java minus the window plumbing.
 */
export class SpaceInvadersGame {
  private readonly input = new Input();
  private readonly sfx = new Sfx();
  private readonly models = createModels();
  private readonly scene: SceneRenderer;
  private readonly logic: GameLogic;

  private inMenu = true;
  private focused = true;
  private menuAngle = 0;
  private flapFrame: Frame = 0;
  private flapTimer = 0;
  private boltFrame: Frame = 0;
  private boltTimer = 0;
  private lastNow = 0;
  private frameId = 0;
  private lastHudKey = '';

  constructor(canvas: HTMLCanvasElement, private readonly onHud: (hud: HudState) => void) {
    this.scene = new SceneRenderer(canvas);
    this.logic = new GameLogic(this.input, (event) => this.sfx.play(event));
    this.frameId = window.requestAnimationFrame(this.loop);
  }

  setSize(width: number, height: number): void {
    this.scene.setSize(width, height);
  }

  /** Unfocused: keys are ignored and the simulation freezes (the title screen keeps spinning). */
  setFocused(focused: boolean): void {
    this.focused = focused;
    if (!focused) this.input.releaseAll();
  }

  /** 0..1 */
  setVolume(volume: number): void {
    this.sfx.setVolume(volume);
  }

  /** Returns true when the key was consumed by the game. */
  keyDown(key: string): boolean {
    if (!this.focused) return false;
    this.sfx.unlock();
    return this.input.keyDown(key);
  }

  keyUp(key: string): boolean {
    if (!this.focused) return false;
    return this.input.keyUp(key);
  }

  dispose(): void {
    window.cancelAnimationFrame(this.frameId);
    this.scene.dispose();
    this.sfx.dispose();
  }

  private loop = (now: number): void => {
    const dt = this.lastNow ? Math.min((now - this.lastNow) / 1000, MAX_FRAME_DT) : 0;
    this.lastNow = now;
    const timeSec = now / 1000;

    this.flapTimer += dt;
    if (this.flapTimer >= FLAP_INTERVAL) {
      this.flapTimer -= FLAP_INTERVAL;
      this.flapFrame = this.flapFrame === 0 ? 1 : 0;
    }

    if (this.inMenu) {
      if (this.focused && this.input.consumeStart()) {
        this.inMenu = false;
      }
      this.menuAngle = (this.menuAngle + MENU_SPIN_DEG_PER_SEC * dt) % 360;
      this.scene.renderMenu(this.models, this.menuAngle, this.flapFrame, dt, timeSec);
    } else {
      if (this.focused) {
        this.logic.update(dt);
        this.boltTimer += dt;
        if (this.boltTimer >= BOLT_INTERVAL) {
          this.boltTimer -= BOLT_INTERVAL;
          this.boltFrame = this.boltFrame === 0 ? 1 : 0;
        }
      }
      this.scene.renderGame(this.logic, this.models, this.flapFrame, this.boltFrame, dt, timeSec);
    }

    this.publishHud();
    this.frameId = window.requestAnimationFrame(this.loop);
  };

  private publishHud(): void {
    const hud: HudState = {
      inMenu: this.inMenu,
      paused: !this.inMenu && !this.focused,
      score: this.logic.score,
      wave: this.logic.getWave(),
      maxWaves: GameLogic.MAX_WAVES,
      lives: Math.max(0, this.logic.player.lives),
      state: this.logic.state,
    };
    const key = JSON.stringify(hud);
    if (key === this.lastHudKey) return;
    this.lastHudKey = key;
    this.onHud(hud);
  }
}
