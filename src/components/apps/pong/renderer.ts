import type { Ball, Pad, Particle, Grid, World, PostFxBuffers } from './types';
import { GameState } from './types';
import {
  GLOW, PAD_WIDTH, PAD_HEIGHT, PAD_CENTER_X, PAD_CENTER_Y,
  PAD_ONE_RELX, PAD_TWO_RELX, BALL_WIDTH, BALL_HEIGHT,
  BALL_CENTER_X, BALL_CENTER_Y, MIDDLE_WIDTH, MIDDLE_HEIGHT,
  MIDDLE_CENTER_X, GRID_SIZE_X, GRID_SIZE_Y, GRID_DECAY,
  TITLE_SIZE, SUBTITLE_SIZE, POINTS_SIZE, POINTS_X, POINTS_Y,
  PROJECT_D, PROJECT_X, PROJECT_Y,
  POST_FX, PARTICLES_FX, BACKGROUND,
} from './constants';

type Ctx = CanvasRenderingContext2D;
type Canvas = HTMLCanvasElement;

const font = (size: number) => `bold ${size}px VT323, sans-serif`;

/** Text with each character bobbing on a sine wave, centred on the canvas. */
function renderSinText(ctx: Ctx, canvas: Canvas, now: number, text: string, size: number): void {
  for (let i = 0; i < text.length; i++) {
    ctx.fillText(
      text.charAt(i),
      (canvas.width * 0.5) - (((text.length - 1) * 0.5) * size) + (i * size),
      (canvas.height * 0.5) + Math.sin(((now + (i * 300) % 2500) / 2500) * Math.PI * 2) * size * 0.5
    );
  }
}

function renderBlinkingPrompt(ctx: Ctx, canvas: Canvas, now: number, text: string): void {
  ctx.font = font(SUBTITLE_SIZE);
  ctx.globalAlpha = (Math.sin((now / 1000) * Math.PI * 2.0) + 1) * 0.5;
  ctx.fillText(text, canvas.width * 0.5, canvas.height * 0.8);
}

function renderTitle(ctx: Ctx, canvas: Canvas, now: number): void {
  ctx.font = font(TITLE_SIZE);
  ctx.textAlign = "center";
  renderSinText(ctx, canvas, now, "PONG", TITLE_SIZE);
  renderBlinkingPrompt(ctx, canvas, now, "Press any key to start.");
}

function renderEndScreen(ctx: Ctx, canvas: Canvas, now: number, headline: string): void {
  ctx.font = font(TITLE_SIZE);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  renderSinText(ctx, canvas, now, headline, TITLE_SIZE);
  renderBlinkingPrompt(ctx, canvas, now, "press any key to start");
}

function renderPoints(ctx: Ctx, canvas: Canvas, padOne: Pad, padTwo: Pad): void {
  ctx.font = font(POINTS_SIZE);
  ctx.textBaseline = "top";

  ctx.textAlign = "right";
  ctx.fillText(String(padOne.points), (canvas.width * 0.5) - POINTS_X, POINTS_Y);

  ctx.textAlign = "left";
  ctx.fillText(String(padTwo.points), (canvas.width * 0.5) + POINTS_X, POINTS_Y);
}

function renderPads(ctx: Ctx, canvas: Canvas, padOne: Pad, padTwo: Pad): void {
  ctx.fillRect((canvas.width * PAD_ONE_RELX) - PAD_CENTER_X, padOne.y - PAD_CENTER_Y, PAD_WIDTH, PAD_HEIGHT);
  ctx.fillRect((canvas.width * PAD_TWO_RELX) - PAD_CENTER_X, padTwo.y - PAD_CENTER_Y, PAD_WIDTH, PAD_HEIGHT);
}

function renderBall(ctx: Ctx, ball: Ball): void {
  ctx.fillRect(ball.x - BALL_CENTER_X, ball.y - BALL_CENTER_Y, BALL_WIDTH, BALL_HEIGHT);
}

function renderMiddle(ctx: Ctx, canvas: Canvas): void {
  for (let y = 0; y < canvas.height; y += MIDDLE_HEIGHT * 2) {
    ctx.fillRect((canvas.width * 0.5) - MIDDLE_CENTER_X, y, MIDDLE_WIDTH, MIDDLE_HEIGHT);
  }
}

function renderParticles(ctx: Ctx, particles: Particle[]): void {
  for (const p of particles) {
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
    ctx.stroke();
  }
}

function renderBackground(ctx: Ctx, canvas: Canvas, grid: Grid): void {
  grid.alpha *= GRID_DECAY;
  ctx.globalAlpha = grid.alpha;

  for (let x = 0; x < canvas.width; x += GRID_SIZE_X) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y < canvas.height; y += GRID_SIZE_Y) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function renderProjectionEffect(ctx: Ctx, canvas: Canvas, fx: PostFxBuffers, grid: Grid): void {
  fx.redCtx.globalCompositeOperation = "destination-atop";
  fx.redCtx.fillStyle = "#f00";
  fx.redCtx.fillRect(0, 0, fx.red.width, fx.red.height);
  fx.redCtx.drawImage(canvas, 0, 0);

  fx.blueCtx.globalCompositeOperation = "destination-atop";
  fx.blueCtx.fillStyle = "#0ff";
  fx.blueCtx.fillRect(0, 0, fx.blue.width, fx.blue.height);
  fx.blueCtx.drawImage(canvas, 0, 0);

  ctx.globalCompositeOperation = "lighter";
  ctx.drawImage(fx.red, PROJECT_X * grid.alpha * PROJECT_D, PROJECT_Y * grid.alpha * PROJECT_D);
  ctx.drawImage(fx.blue, -PROJECT_X * grid.alpha * PROJECT_D, -PROJECT_Y * grid.alpha * PROJECT_D);
}

/** Dim the court and explain how to resume when the window loses focus mid-game. */
function renderPausedOverlay(ctx: Ctx, canvas: Canvas, now: number): void {
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#fff";
  ctx.globalAlpha = 1.0;
  ctx.font = font(POINTS_SIZE);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("PAUSED", canvas.width * 0.5, canvas.height * 0.5 - 20);
  renderBlinkingPrompt(ctx, canvas, now, "click the window to resume");
}

export function render(
  ctx: Ctx,
  canvas: Canvas,
  state: GameState,
  now: number,
  world: World,
  fx: PostFxBuffers | null,
  paused: boolean,
): void {
  const { ball, padOne, padTwo, particles, grid } = world;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.shadowBlur = GLOW;
  ctx.shadowColor = "#fff";
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  ctx.textBaseline = "top";

  switch (state) {
    case GameState.TITLE:
      renderTitle(ctx, canvas, now);
      break;
    case GameState.GAME:
      renderPoints(ctx, canvas, padOne, padTwo);
      renderPads(ctx, canvas, padOne, padTwo);
      renderBall(ctx, ball);
      renderMiddle(ctx, canvas);
      ctx.shadowBlur = 0;
      if (PARTICLES_FX) renderParticles(ctx, particles);
      break;
    case GameState.WON:
      renderEndScreen(ctx, canvas, now, "YOU WON");
      break;
    case GameState.LOST:
      renderEndScreen(ctx, canvas, now, "YOU LOST");
      break;
  }

  if (BACKGROUND) renderBackground(ctx, canvas, grid);
  if (state === GameState.GAME && POST_FX && fx) renderProjectionEffect(ctx, canvas, fx, grid);
  if (state === GameState.GAME && paused) renderPausedOverlay(ctx, canvas, now);
}
