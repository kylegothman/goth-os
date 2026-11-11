import {
  useState, useEffect, useRef, useCallback,
  type PointerEvent as ReactPointerEvent, type ReactNode,
} from 'react';
import Draggable from 'react-draggable';
import { assetPath } from '../../utils/assetPath';
import { WindowFocusContext } from './WindowContext';

/** Preferred window size in CSS pixels (converted to viewport % when the window opens). */
export interface WindowPixelSize {
  width: number;
  height: number;
}

interface WindowProps {
  id: string;
  title: string;
  screen: ReactNode;
  defaultSize?: WindowPixelSize;
  closed: (id: string) => void;
  focus: (id: string) => void;
  isFocused: boolean;
  hideSideBar: (id: string | null, hide: boolean) => void;
  hasMinimized: (id: string) => void;
}

/** Window size as a percentage of the viewport. */
interface WindowSize {
  width: number;
  height: number;
}

type ResizeAxis = 'x' | 'y' | 'xy';

const DEFAULT_SIZE: WindowSize = { width: 60, height: 85 };
const MOBILE_SIZE: WindowSize = { width: 85, height: 60 };
const MAXIMIZED_SIZE: WindowSize = { width: 100.2, height: 96.3 };
const MOBILE_BREAKPOINT_PX = 640;
const START_POSITION = { x: 150, y: 10 };
/** A window dragged this close to the left edge hides the dock. */
const DOCK_OVERLAP_PX = 50;
const MIN_WIDTH_PX = 320;
const MIN_HEIGHT_PX = 240;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

const pxToViewportPercent = (px: WindowPixelSize): WindowSize => ({
  width: Math.min(95, (px.width / window.innerWidth) * 100),
  height: Math.min(90, (px.height / window.innerHeight) * 100),
});

const initialSizeFor = (defaultSize?: WindowPixelSize): WindowSize => {
  if (window.innerWidth < MOBILE_BREAKPOINT_PX) return MOBILE_SIZE;
  return defaultSize ? pxToViewportPercent(defaultSize) : DEFAULT_SIZE;
};

/** The usual offset, pulled left just enough that a wide window still fits the viewport. */
const startPositionFor = (size: WindowSize) => ({
  x: Math.max(0, Math.min(START_POSITION.x, window.innerWidth - (size.width / 100) * window.innerWidth)),
  y: START_POSITION.y,
});

export default function Window({
  id, title, screen, defaultSize, closed, focus, isFocused, hideSideBar, hasMinimized,
}: WindowProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [cursorType, setCursorType] = useState('cursor-default');
  const [size, setSize] = useState<WindowSize>(() => initialSizeFor(defaultSize));
  const [startPosition] = useState(() => startPositionFor(size));
  const [isClosed, setIsClosed] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [bounds, setBounds] = useState({ right: 100, bottom: 100 });

  // Mirrors of props/state for use inside timers and event listeners without stale closures.
  const sizeRef = useRef(size);
  const maximizedRef = useRef(maximized);
  const focusRef = useRef(focus);
  sizeRef.current = size;
  maximizedRef.current = maximized;
  focusRef.current = focus;

  /** How far the window may be dragged while staying inside the viewport (below the navbar). */
  const updateBounds = useCallback(() => {
    const { width, height } = sizeRef.current;
    setBounds({
      right: window.innerWidth - window.innerWidth * (width / 100),
      bottom: window.innerHeight - window.innerHeight * (height / 100) - 28,
    });
  }, []);

  const applySize = useCallback((next: WindowSize) => {
    sizeRef.current = next;
    setSize(next);
  }, []);

  const setDefaultWindowDimension = useCallback(() => {
    applySize(initialSizeFor(defaultSize));
    updateBounds();
  }, [applySize, defaultSize, updateBounds]);

  useEffect(() => {
    setDefaultWindowDimension();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, [setDefaultWindowDimension, updateBounds]);

  // Clicking inside an iframe (browser, music player…) focuses the iframe's document, which
  // never produces a pointer event here. The parent window does get a `blur`, so use that.
  useEffect(() => {
    const onWindowBlur = () => {
      setTimeout(() => {
        const active = document.activeElement;
        if (active instanceof HTMLIFrameElement && nodeRef.current?.contains(active)) {
          focusRef.current(id);
        }
      }, 0);
    };
    window.addEventListener('blur', onWindowBlur);
    return () => window.removeEventListener('blur', onWindowBlur);
  }, [id]);

  /** Store the current on-screen position in CSS vars used by the close/minimize animations. */
  const rememberPosition = () => {
    const el = nodeRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--window-transform-x', `${rect.x.toFixed(1)}px`);
    el.style.setProperty('--window-transform-y', `${(parseFloat(rect.y.toFixed(1)) - 32).toFixed(1)}px`);
  };

  /** Hide the dock while the window overlaps it. */
  const checkOverlap = () => {
    const el = nodeRef.current;
    if (!el) return;
    hideSideBar(id, el.getBoundingClientRect().x < DOCK_OVERLAP_PX);
  };

  const focusWindow = () => focus(id);

  const handleDragStart = () => {
    focusWindow();
    if (maximizedRef.current) restoreWindow();
    setCursorType('cursor-move');
  };

  const handleDragStop = () => setCursorType('cursor-default');

  const minimizeWindow = () => {
    const el = nodeRef.current;
    const dockIcon = document.getElementById(`sidebar-${id}`);
    if (!el || !dockIcon) return;
    rememberPosition();
    const shrinkX = maximizedRef.current ? -510 : -310;
    el.style.transform = `translate(${shrinkX}px,${dockIcon.getBoundingClientRect().y.toFixed(1)}px) scale(0.2)`;
    hasMinimized(id);
  };

  const restoreWindow = () => {
    const el = nodeRef.current;
    if (!el) return;
    setDefaultWindowDimension();
    const x = el.style.getPropertyValue('--window-transform-x');
    const y = el.style.getPropertyValue('--window-transform-y');
    el.style.transform = `translate(${x},${y})`;
    setTimeout(() => {
      setMaximized(false);
      checkOverlap();
    }, 300);
  };

  const maximizeWindow = () => {
    if (maximizedRef.current) {
      restoreWindow();
      return;
    }
    const el = nodeRef.current;
    if (!el) return;
    focusWindow();
    rememberPosition();
    el.style.transform = 'translate(-1pt,-2pt)';
    setMaximized(true);
    applySize(MAXIMIZED_SIZE);
    hideSideBar(id, true);
  };

  const closeWindow = () => {
    rememberPosition();
    setIsClosed(true);
    hideSideBar(id, false);
    setTimeout(() => closed(id), 300);
  };

  /** Pointer-driven resize from the right edge, bottom edge or bottom-right corner. */
  const beginResize = (axis: ResizeAxis) => (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = nodeRef.current;
    if (!el || e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    focusWindow();

    const handle = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const start = { x: e.clientX, y: e.clientY, width: rect.width, height: rect.height, left: rect.left, top: rect.top };
    handle.setPointerCapture(e.pointerId);
    document.body.classList.add('is-resizing');

    const onMove = (ev: PointerEvent) => {
      const width = axis === 'y'
        ? start.width
        : clamp(start.width + (ev.clientX - start.x), MIN_WIDTH_PX, window.innerWidth - start.left);
      const height = axis === 'x'
        ? start.height
        : clamp(start.height + (ev.clientY - start.y), MIN_HEIGHT_PX, window.innerHeight - start.top);
      applySize({ width: (width / window.innerWidth) * 100, height: (height / window.innerHeight) * 100 });
    };

    const end = () => {
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', end);
      handle.removeEventListener('pointercancel', end);
      document.body.classList.remove('is-resizing');
      updateBounds();
    };

    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  };

  const rounding = maximized ? 'rounded-none' : 'rounded-lg rounded-b-none';

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".window-drag-handle"
      defaultPosition={startPosition}
      bounds={{ left: 0, top: 0, right: bounds.right, bottom: bounds.bottom }}
      onStart={handleDragStart}
      onStop={handleDragStop}
      onDrag={checkOverlap}
    >
      <div
        ref={nodeRef}
        id={id}
        style={{ width: `${size.width}%`, height: `${size.height}%` }}
        onPointerDownCapture={focusWindow}
        className={[
          cursorType,
          isClosed ? 'closed-window' : '',
          maximized ? 'duration-300' : '',
          rounding,
          isFocused ? 'z-30' : 'z-20 notFocused',
          'main-window absolute window-shadow min-w-[320px] min-h-[240px]',
        ].join(' ')}
      >
        <div className={`h-full w-full flex flex-col overflow-hidden border border-t-0 border-black border-opacity-40 ${rounding}`}>
          <WindowTopBar title={title} />
          <WindowEditButtons
            minimize={minimizeWindow}
            maximize={maximizeWindow}
            isMaximized={maximized}
            close={closeWindow}
            id={id}
          />
          <WindowFocusContext.Provider value={isFocused}>
            <WindowMainScreen screen={screen} />
          </WindowFocusContext.Provider>
        </div>

        {!maximized && (
          <>
            <div className="absolute top-0 -right-1 h-full w-1.5 cursor-ew-resize z-40 touch-none" onPointerDown={beginResize('x')} />
            <div className="absolute left-0 -bottom-1 w-full h-1.5 cursor-ns-resize z-40 touch-none" onPointerDown={beginResize('y')} />
            <div className="absolute -right-1 -bottom-1 h-4 w-4 cursor-nwse-resize z-40 touch-none" onPointerDown={beginResize('xy')} />
          </>
        )}
      </div>
    </Draggable>
  );
}

function WindowTopBar({ title }: { title: string }) {
  return (
    <div className="window-drag-handle relative bg-ub-window-title border-t-2 border-white border-opacity-5 py-1.5 px-3 text-white w-full select-none rounded-b-none">
      <div className="flex justify-center text-xl font-vt323">{title}</div>
    </div>
  );
}

interface WindowEditButtonsProps {
  minimize: () => void;
  maximize: () => void;
  isMaximized: boolean;
  close: () => void;
  id: string;
}

function WindowEditButtons({ minimize, maximize, isMaximized, close, id }: WindowEditButtonsProps) {
  const toggleIcon = isMaximized ? 'window-restore-symbol.svg' : 'window-maximize-symbol.svg';
  const toggleLabel = isMaximized ? 'window restore' : 'window maximize';

  return (
    <div className="absolute select-none right-0 top-0 mt-1 mr-1 flex justify-center items-center">
      <span
        className="mx-1.5 bg-white bg-opacity-0 hover:bg-opacity-10 rounded-full flex justify-center mt-1 h-5 w-5 items-center"
        onClick={minimize}
      >
        <img src={assetPath('/assets/window/window-minimize-symbol.svg')} alt="window minimize" className="h-5 w-5 inline" />
      </span>
      <span
        className="mx-2 bg-white bg-opacity-0 hover:bg-opacity-10 rounded-full flex justify-center mt-1 h-5 w-5 items-center"
        onClick={maximize}
      >
        <img src={assetPath(`/assets/window/${toggleIcon}`)} alt={toggleLabel} className="h-5 w-5 inline" />
      </span>
      <button
        tabIndex={-1}
        id={`close-${id}`}
        className="mx-1.5 focus:outline-none cursor-default bg-ub-orange bg-opacity-90 hover:bg-opacity-100 rounded-full flex justify-center mt-1 h-5 w-5 items-center"
        onClick={close}
      >
        <img src={assetPath('/assets/window/window-close-symbol.svg')} alt="window close" className="h-5 w-5 inline" />
      </button>
    </div>
  );
}

function WindowMainScreen({ screen }: { screen: ReactNode }) {
  return (
    <div className="w-full flex-grow z-20 max-h-full overflow-y-auto windowMainScreen">
      {screen}
    </div>
  );
}
