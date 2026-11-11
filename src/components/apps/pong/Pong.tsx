import { useContext, useEffect, useRef } from 'react';
import { GameState, type World, type PostFxBuffers } from './types';
import { BALL_INITIAL_VELX, BALL_INITIAL_VELY, POST_FX } from './constants';
import { handleInput, updatePadOne, updatePadTwo, updateBall, updateParticles } from './physics';
import { render } from './renderer';
import { WindowFocusContext } from '../../base/WindowContext';
import { isEditableTarget } from '../../../utils/isEditableTarget';

/** Points of lead needed to win (or lose). */
const WIN_MARGIN = 3;
const CONTROL_KEYS = new Set(['ArrowUp', 'ArrowDown']);

function createPostFxBuffers(width: number, height: number): PostFxBuffers | null {
  const red = document.createElement('canvas');
  const blue = document.createElement('canvas');
  red.width = blue.width = width;
  red.height = blue.height = height;
  const redCtx = red.getContext('2d');
  const blueCtx = blue.getContext('2d');
  return redCtx && blueCtx ? { red, redCtx, blue, blueCtx } : null;
}

export default function Pong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Only react to the keyboard (and only advance the game) while this window is front-most.
  const windowFocused = useContext(WindowFocusContext);
  const focusedRef = useRef(windowFocused);
  focusedRef.current = windowFocused;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !ctx) return;

    // The offscreen buffers cost ~3 MB each, so only allocate them when the effect is on.
    const fx = POST_FX ? createPostFxBuffers(canvas.width, canvas.height) : null;
    const keys = new Set<string>();
    const world: World = {
      ball: { x: canvas.width * 0.5, y: canvas.height * 0.5, vx: BALL_INITIAL_VELX, vy: BALL_INITIAL_VELY },
      padOne: { y: canvas.height * 0.5, vy: 0, points: 0 },
      padTwo: { y: canvas.height * 0.5, vy: 0, points: 0 },
      particles: [],
      grid: { alpha: 1.0 },
    };

    let state = GameState.TITLE;
    let frameId = 0;

    const resetGame = () => {
      const { ball, padOne, padTwo } = world;
      padOne.y = padTwo.y = canvas.height * 0.5;
      padOne.vy = padTwo.vy = 0;
      padOne.points = padTwo.points = 0;
      ball.x = canvas.width * 0.5;
      ball.y = canvas.height * 0.5;
      ball.vx = BALL_INITIAL_VELX;
      ball.vy = BALL_INITIAL_VELY;
      keys.clear();
      state = GameState.GAME;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!focusedRef.current || isEditableTarget(e.target)) return;
      if (state !== GameState.GAME || !CONTROL_KEYS.has(e.key)) return;
      e.preventDefault(); // keep the arrow keys from scrolling the window pane
      keys.add(e.key);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (!focusedRef.current || isEditableTarget(e.target)) return;
      if (state === GameState.GAME) {
        keys.delete(e.key);
      } else {
        resetGame(); // any key starts a new game from the title / end screens
      }
    };

    const tick = (now: number) => {
      const paused = state === GameState.GAME && !focusedRef.current;

      if (state === GameState.GAME && !paused) {
        handleInput(keys, world.padOne);
        updateParticles(world.particles);
        updatePadOne(world.padOne, canvas.height);
        updatePadTwo(world.padTwo, world.ball, canvas.height);
        updateBall(world, canvas.width, canvas.height);

        const lead = world.padOne.points - world.padTwo.points;
        if (lead >= WIN_MARGIN) state = GameState.WON;
        else if (lead <= -WIN_MARGIN) state = GameState.LOST;
      } else if (state !== GameState.GAME) {
        // Slow pulse of the background grid while idle
        world.grid.alpha = (Math.sin(((now % 10000) / 10000) * Math.PI * 2) + 1) * 0.1;
      }

      if (paused) keys.clear(); // a key released while unfocused would otherwise stay "held"

      render(ctx, canvas, state, now, world, fx, paused);
      frameId = window.requestAnimationFrame(tick);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center overflow-hidden bg-black">
      {/* Fixed 1000×750 game resolution, scaled by CSS to fit the window */}
      <canvas ref={canvasRef} height="750" width="1000" className="block max-w-full max-h-full w-auto h-auto" />
    </div>
  );
}
