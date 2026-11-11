export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface Pad {
  y: number;
  vy: number;
  points: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
}

export interface Grid {
  alpha: number;
}

/** Everything that moves. Mutated in place each frame. */
export interface World {
  ball: Ball;
  padOne: Pad;
  padTwo: Pad;
  particles: Particle[];
  grid: Grid;
}

/** Offscreen canvases used by the chromatic-aberration post effect (POST_FX). */
export interface PostFxBuffers {
  red: HTMLCanvasElement;
  redCtx: CanvasRenderingContext2D;
  blue: HTMLCanvasElement;
  blueCtx: CanvasRenderingContext2D;
}

export enum GameState {
  TITLE = 0,
  GAME = 1,
  WON = 2,
  LOST = 3,
}
