import type { Ball, Pad, Particle, World } from './types';
import {
  PAD_CENTER_Y, PAD_CENTER_X, PAD_ONE_RELX, PAD_TWO_RELX,
  PAD_DIVISOR, BALL_CENTER_Y, BALL_HEIGHT,
  BALL_INITIAL_VELX, BALL_INITIAL_VELY, MAX_BALL_VELOCITY,
  VELX_BALL_MULTIPLIER, VELY_BALL_MULTIPLIER,
  PARTICLE_DECAY, PARTICLES, PARTICLES_FX, GRID_HIT_ALPHA,
} from './constants';

const PAD_FRICTION = 0.9;

/** Player paddle: apply velocity, clamp to the court, apply friction. */
export function updatePadOne(pad: Pad, canvasHeight: number): void {
  pad.y += pad.vy;
  if (pad.y < PAD_CENTER_Y) {
    pad.y = PAD_CENTER_Y;
    pad.vy = 0;
  } else if (pad.y > canvasHeight - PAD_CENTER_Y) {
    pad.y = canvasHeight - PAD_CENTER_Y;
    pad.vy = 0;
  }
  pad.vy *= PAD_FRICTION;
}

/** AI paddle: accelerate toward the ball, clamp to the court, apply friction. */
export function updatePadTwo(pad: Pad, ball: Ball, canvasHeight: number): void {
  if (ball.y < pad.y - PAD_CENTER_Y) {
    pad.vy -= 1;
  } else if (ball.y > pad.y + PAD_CENTER_Y) {
    pad.vy += 1;
  }

  pad.y += pad.vy;

  if (pad.y < PAD_CENTER_Y) {
    pad.y = PAD_CENTER_Y;
  } else if (pad.y > canvasHeight - PAD_CENTER_Y) {
    pad.y = canvasHeight - PAD_CENTER_Y;
  }

  pad.vy *= PAD_FRICTION;
}

export function handleInput(keys: ReadonlySet<string>, padOne: Pad): void {
  if (keys.has('ArrowUp')) padOne.vy -= 1;
  if (keys.has('ArrowDown')) padOne.vy += 1;
}

export function createParticles(ball: Ball, particles: Particle[]): void {
  if (!PARTICLES_FX) return;

  for (let i = 0; i < PARTICLES; i++) {
    particles.push({
      x: ball.x,
      y: ball.y + ((Math.random() - 0.5) * BALL_HEIGHT),
      vx: -(ball.vx + ((Math.random() + 1) * VELX_BALL_MULTIPLIER)),
      vy: ((Math.random() - 0.5) * VELY_BALL_MULTIPLIER),
      alpha: 1.0,
    });
  }
}

/** Speed the ball up (capped) and send it back the other way after a paddle hit. */
function bounceOffPad(ball: Ball, pad: Pad): void {
  if (ball.vx < 0 && ball.vx > -MAX_BALL_VELOCITY) ball.vx--;
  else if (ball.vx > 0 && ball.vx < MAX_BALL_VELOCITY) ball.vx++;

  ball.vx = -ball.vx;
  ball.vy = (ball.y - pad.y) / PAD_DIVISOR;
}

export function updateBall(world: World, canvasWidth: number, canvasHeight: number): void {
  const { ball, padOne, padTwo, particles, grid } = world;

  ball.x += ball.vx;
  ball.y += ball.vy;

  const withinPadY = (pad: Pad) =>
    ball.y >= pad.y - (PAD_CENTER_Y + BALL_CENTER_Y) && ball.y <= pad.y + (PAD_CENTER_Y + BALL_CENTER_Y);

  // Pad one (player, left) collision
  const padOneX = canvasWidth * PAD_ONE_RELX;
  if (withinPadY(padOne) && ball.x <= padOneX + PAD_CENTER_X && ball.x >= padOneX - PAD_CENTER_X) {
    ball.x = padOneX + PAD_CENTER_X;
    createParticles(ball, particles);
    grid.alpha = GRID_HIT_ALPHA;
    bounceOffPad(ball, padOne);
  }

  // Pad two (AI, right) collision
  const padTwoX = canvasWidth * PAD_TWO_RELX;
  if (withinPadY(padTwo) && ball.x >= padTwoX - PAD_CENTER_X && ball.x <= padTwoX + PAD_CENTER_X) {
    ball.x = padTwoX - PAD_CENTER_X;
    createParticles(ball, particles);
    grid.alpha = GRID_HIT_ALPHA;
    bounceOffPad(ball, padTwo);
  }

  // Score: ball left the court on either side
  if (ball.x > canvasWidth || ball.x < 0) {
    if (ball.x > canvasWidth) padOne.points++;
    else padTwo.points++;

    ball.x = canvasWidth * 0.5;
    ball.y = canvasHeight * 0.5;
    ball.vx = BALL_INITIAL_VELX;
    ball.vy = BALL_INITIAL_VELY;

    padOne.y = canvasHeight * 0.5;
    padTwo.y = canvasHeight * 0.5;
  }

  // Top/bottom wall bounce
  if (ball.y > canvasHeight) {
    ball.y = canvasHeight;
    ball.vy = -ball.vy;
  } else if (ball.y < 0) {
    ball.y = 0;
    ball.vy = -ball.vy;
  }
}

export function updateParticles(particles: Particle[]): void {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= PARTICLE_DECAY;
    p.vy *= PARTICLE_DECAY;
    p.alpha *= PARTICLE_DECAY;

    if (p.alpha <= 0.1) {
      particles.splice(i, 1);
    }
  }
}
