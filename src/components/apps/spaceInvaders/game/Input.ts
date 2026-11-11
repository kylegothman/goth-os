import type { InputSource } from './GameLogic';

/**
 * Keyboard state (port of invaders.ui.Input): arrows or A/D move, Space fires, Enter starts
 * (edge-triggered) and restarts (level-triggered).
 */
export class Input implements InputSource {
  private startEdge = false;
  private left = false;
  private right = false;
  private fire = false;
  private enter = false;

  /** Returns true if the key is one the game uses (so the caller can preventDefault). */
  keyDown(key: string): boolean {
    if (key === 'Enter') this.startEdge = true;
    return this.setFlag(key, true);
  }

  keyUp(key: string): boolean {
    return this.setFlag(key, false);
  }

  /** Drop every held key, e.g. when the window loses focus mid-press. */
  releaseAll(): void {
    this.left = this.right = this.fire = this.enter = false;
  }

  /** True exactly once per Enter press. */
  consumeStart(): boolean {
    const v = this.startEdge;
    this.startEdge = false;
    return v;
  }

  isLeftPressed(): boolean { return this.left; }
  isRightPressed(): boolean { return this.right; }
  isFirePressed(): boolean { return this.fire; }
  isRestartPressed(): boolean { return this.enter; }

  private setFlag(key: string, value: boolean): boolean {
    switch (key) {
      case 'ArrowLeft': case 'a': case 'A':
        this.left = value; return true;
      case 'ArrowRight': case 'd': case 'D':
        this.right = value; return true;
      case ' ':
        this.fire = value; return true;
      case 'Enter':
        this.enter = value; return true;
      default:
        return false;
    }
  }
}
