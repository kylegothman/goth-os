import { lazy, Suspense, type ReactNode } from 'react';
import DisMusicPlayer from './components/apps/MusicPlayer';
import DisWebBrowser from './components/apps/WebBrowser';
import DisGrooveBox from './components/apps/GrooveBox';
import DisAboot from './components/apps/aboot/Aboot';
import DisPong from './components/apps/pong/Pong';
import DisYukonsGold from './components/apps/YukonsGold';
import YukonsGold from './components/icons/YukonsGold';
import WebBrowser from './components/icons/WebBrowser';
import MusicPlayer from './components/icons/MusicPlayer';
import GrooveBox from './components/icons/GrooveBox';
import Calculator from './components/icons/Calculator';
import Aboot from './components/icons/Aboot';
import Pong from './components/icons/Pong';
import SpaceInvaders from './components/icons/SpaceInvaders';
import type { WindowPixelSize } from './components/base/Window';

// The calculator pulls in mathjs (~600 KB minified), so it is loaded on first open
// instead of being bundled into the initial page load.
const DisCalculator = lazy(() => import('./components/apps/Calculator'));
// Three.js is similarly heavy, so the Space Invaders port loads when its window opens.
const DisSpaceInvaders = lazy(() => import('./components/apps/spaceInvaders/SpaceInvaders'));

export interface AppConfig {
  id: string;
  title: string;
  icon: ReactNode;
  /** Reserved for greying out a dock icon; not implemented yet. */
  disabled: boolean;
  /** Also render a shortcut on the desktop, not just in the dock. */
  desktop_shortcut: boolean;
  /** Window size when opened (CSS px). Omit for the viewport-relative default. */
  defaultWindowSize?: WindowPixelSize;
  screen: ReactNode;
}

const apps: AppConfig[] = [
  {
    id: "Aboot",
    title: "Aboot",
    icon: <Aboot/>,
    disabled: false,
    desktop_shortcut: false,
    screen: <DisAboot/>,
  },
  {
    id: "web-browser",
    title: "Web Browser",
    icon: <WebBrowser/>,
    disabled: false,
    desktop_shortcut: false,
    screen: <DisWebBrowser/>,
  },
  {
    id: "music-player",
    title: "Music Player",
    icon: <MusicPlayer/>,
    disabled: false,
    desktop_shortcut: false,
    screen: <DisMusicPlayer/>,
  },
  {
    id: "Pong",
    title: "Pong",
    icon: <Pong/>,
    disabled: false,
    desktop_shortcut: false,
    screen: <DisPong/>,
  },
  {
    id: "space-invaders",
    title: "3D Space Invaders",
    icon: <SpaceInvaders/>,
    disabled: false,
    desktop_shortcut: false,
    defaultWindowSize: { width: 1000, height: 790 },
    screen: (
      <Suspense fallback={<div className="h-full w-full bg-[#08080f]" />}>
        <DisSpaceInvaders/>
      </Suspense>
    ),
  },
  {
    id: "yukons-gold",
    title: "Yukon's Gold",
    icon: <YukonsGold/>,
    disabled: false,
    desktop_shortcut: false,
    defaultWindowSize: { width: 1280, height: 820 },
    screen: <DisYukonsGold/>,
  },
  {
    id: "Calculator",
    title: "Calculator",
    icon: <Calculator/>,
    disabled: false,
    desktop_shortcut: false,
    defaultWindowSize: { width: 400, height: 600 },
    screen: (
      <Suspense fallback={null}>
        <DisCalculator/>
      </Suspense>
    ),
  },
  {
    id: "GrooveBox",
    title: "GrooveBox",
    icon: <GrooveBox/>,
    disabled: false,
    desktop_shortcut: false,
    screen: <DisGrooveBox/>,
  },
];

export default apps;
