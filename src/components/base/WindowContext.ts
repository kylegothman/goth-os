import { createContext } from 'react';

/**
 * True while the enclosing Window is the front-most (focused) window.
 * Apps use it to ignore keyboard input or pause when another window is active.
 * Defaults to true so a screen rendered outside a Window still works.
 */
export const WindowFocusContext = createContext(true);
