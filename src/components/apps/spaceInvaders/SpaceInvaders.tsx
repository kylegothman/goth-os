import { useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { SpaceInvadersGame, type HudState } from './SpaceInvadersGame';
import { GameLogic } from './game/GameLogic';
import { WindowFocusContext } from '../../base/WindowContext';
import VolumeContext from '../../utils/VolumeContext';
import { isEditableTarget } from '../../../utils/isEditableTarget';

const REPO_URL = 'https://github.com/kylegothman/3D-Space-Invaders';

// Colours from MenuScreen / HudRenderer
const GREEN = '#33e666';
const LIFE_RED = '#e64040';
const LOSE_RED = '#f24d4d';

const INITIAL_HUD: HudState = {
  inMenu: true, paused: false, score: 0, wave: 1, maxWaves: GameLogic.MAX_WAVES, lives: 3, state: 'playing',
};

/** 3D Space Invaders — Three.js port of the Java/JOGL original. Loaded lazily (three is ~600 KB). */
export default function SpaceInvaders() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<SpaceInvadersGame | null>(null);
  const [hud, setHud] = useState<HudState>(INITIAL_HUD);
  const windowFocused = useContext(WindowFocusContext);
  const { volume } = useContext(VolumeContext);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const game = new SpaceInvadersGame(canvas, setHud);
    gameRef.current = game;

    const fit = () => game.setSize(container.clientWidth, container.clientHeight);
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(container);

    const onKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;
      if (game.keyDown(e.key)) e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;
      if (game.keyUp(e.key)) e.preventDefault();
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      observer.disconnect();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      game.dispose();
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    gameRef.current?.setFocused(windowFocused);
  }, [windowFocused]);

  useEffect(() => {
    gameRef.current?.setVolume(volume / 100);
  }, [volume]);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-[#08080f] font-vt323 select-none">
      <canvas ref={canvasRef} className="block h-full w-full" />
      {hud.inMenu ? <MenuOverlay /> : <HudOverlay hud={hud} />}
    </div>
  );
}

interface LineProps {
  top: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/** A centred line of text at a fraction of the height (the Java UI positioned text the same way). */
function Line({ top, className = '', style, children }: LineProps) {
  return (
    <div className={`absolute inset-x-0 -translate-y-1/2 text-center whitespace-pre leading-none ${className}`} style={{ top, ...style }}>
      {children}
    </div>
  );
}

function MenuOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Line top="38%" className="text-5xl md:text-6xl" style={{ color: GREEN }}>3D SPACE INVADERS</Line>
      <Line top="48%" className="text-3xl text-gray-300">TEAM 7</Line>
      <Line top="66%" className="text-2xl text-white animate-pulse">PRESS ENTER TO START</Line>
      <Line top="74%" className="text-xl text-gray-400">ARROWS / A D  MOVE    SPACE  FIRE</Line>
      <a
        href={REPO_URL}
        target="_blank"
        rel="noreferrer"
        className="pointer-events-auto absolute bottom-3 inset-x-0 text-center text-base text-gray-500 hover:text-gray-200"
      >
        Java + JOGL original by Team 7 · ported to Three.js · source ↗
      </a>
    </div>
  );
}

function HudOverlay({ hud }: { hud: HudState }) {
  const over = hud.state !== 'playing';
  const won = hud.state === 'won';

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-3 inset-x-5 flex justify-between text-2xl whitespace-pre leading-none">
        <span className="text-white">SCORE  {hud.score}</span>
        <span className="text-white">WAVE {hud.wave}/{hud.maxWaves}</span>
        <span style={{ color: LIFE_RED }}>LIVES  {'▲ '.repeat(hud.lives).trim()}</span>
      </div>

      {over && (
        <>
          <Line top="30%" className="text-5xl md:text-6xl" style={{ color: won ? GREEN : LOSE_RED }}>
            {won ? 'YOU WIN' : 'GAME OVER'}
          </Line>
          <Line top="40%" className="text-3xl text-white">PRESS ENTER TO RESTART</Line>
        </>
      )}

      {hud.paused && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center">
          <div className="text-5xl text-white">PAUSED</div>
          <div className="mt-2 text-xl text-gray-300 animate-pulse">click the window to resume</div>
        </div>
      )}
    </div>
  );
}
