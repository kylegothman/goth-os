import { useState, useCallback } from 'react';
import SideBar from './SideBar';
import apps from '../../apps.config';
import Window from '../base/Window';
import GothApp from '../base/GothApp';
import ASCIIAnimation from '../ASCIIAnimation';

type WindowFlags = Record<string, boolean>;

const initialFlags = (value: boolean): WindowFlags =>
  Object.fromEntries(apps.map((app) => [app.id, value]));

const desktopApps = apps.filter((app) => app.desktop_shortcut);

export default function Desktop() {
  const [closedWindows, setClosedWindows] = useState<WindowFlags>(() => initialFlags(true));
  const [minimizedWindows, setMinimizedWindows] = useState<WindowFlags>(() => initialFlags(false));
  const [focusedWindows, setFocusedWindows] = useState<WindowFlags>(() => initialFlags(false));
  const [overlappedWindows, setOverlappedWindows] = useState<WindowFlags>(() => initialFlags(false));
  const [sideBarHidden, setSideBarHidden] = useState(false);
  /** Open windows in the order they were opened. */
  const [appStack, setAppStack] = useState<string[]>([]);

  const focus = useCallback((objId: string) => {
    setFocusedWindows((prev) =>
      prev[objId] ? prev : Object.fromEntries(Object.keys(prev).map((key) => [key, key === objId]))
    );
  }, []);

  /** Focus the most recently opened window that is still open and not minimized. */
  const focusLastOpenApp = useCallback((stack: string[], minimized: WindowFlags) => {
    const last = [...stack].reverse().find((id) => !minimized[id]);
    if (last) focus(last);
  }, [focus]);

  const hideSideBar = (objId: string | null, hide: boolean) => {
    if (hide === sideBarHidden) return;

    if (objId === null) {
      if (!hide) {
        setSideBarHidden(false);
      } else if (Object.values(overlappedWindows).some(Boolean)) {
        setSideBarHidden(true);
      }
      return;
    }

    // A window may only un-hide the sidebar if no *other* window still overlaps it.
    if (!hide && Object.entries(overlappedWindows).some(([key, overlapped]) => overlapped && key !== objId)) {
      return;
    }

    setOverlappedWindows((prev) => ({ ...prev, [objId]: hide }));
    setSideBarHidden(hide);
  };

  const openApp = useCallback((objId: string) => {
    if (minimizedWindows[objId]) {
      focus(objId);
      // Scoped to the desktop area: dock icons are inline SVGs whose exported ids can clash with window ids.
      const el = document.querySelector<HTMLElement>(`[data-context="desktop-area"] > [id="${objId}"]`);
      if (el) {
        const x = el.style.getPropertyValue('--window-transform-x');
        const y = el.style.getPropertyValue('--window-transform-y');
        el.style.transform = `translate(${x},${y}) scale(1)`;
      }
      setMinimizedWindows((prev) => ({ ...prev, [objId]: false }));
      return;
    }

    // Short delay so the dock icon reacts before the window appears.
    setTimeout(() => {
      setClosedWindows((prev) => ({ ...prev, [objId]: false }));
      focus(objId);
      setAppStack((prev) => (prev.includes(objId) ? prev : [...prev, objId]));
    }, 200);
  }, [minimizedWindows, focus]);

  const closeApp = (objId: string) => {
    const remaining = appStack.filter((id) => id !== objId);
    setAppStack(remaining);
    setClosedWindows((prev) => ({ ...prev, [objId]: true }));
    hideSideBar(null, false);
    focusLastOpenApp(remaining, minimizedWindows);
  };

  const minimizeApp = (objId: string) => {
    const minimized = { ...minimizedWindows, [objId]: true };
    setMinimizedWindows(minimized);
    setFocusedWindows((prev) => ({ ...prev, [objId]: false }));
    hideSideBar(null, false);
    focusLastOpenApp(appStack, minimized);
  };

  return (
    <div className="h-full w-full flex flex-col items-end justify-start content-start flex-wrap-reverse pt-8 bg-transparent overflow-hidden overscroll-none window-parent">
      <div className="absolute h-full w-full bg-transparent" data-context="desktop-area">
        {apps
          .filter((app) => !closedWindows[app.id])
          .map((app) => (
            <Window
              key={app.id}
              title={app.title}
              id={app.id}
              screen={app.screen}
              defaultSize={app.defaultWindowSize}
              closed={closeApp}
              focus={focus}
              isFocused={focusedWindows[app.id]}
              hideSideBar={hideSideBar}
              hasMinimized={minimizeApp}
            />
          ))}
      </div>

      <ASCIIAnimation
        folderPath="/assets/spheres_output"
        filePrefix="sphere_ascii"
        frameCount={149}
        frameRate={24}
      />

      <SideBar
        apps={apps}
        hide={sideBarHidden}
        hideSideBar={hideSideBar}
        closed_windows={closedWindows}
        focused_windows={focusedWindows}
        openAppByAppId={openApp}
      />

      {desktopApps.map((app) => (
        <GothApp key={app.id} name={app.title} id={app.id} icon={app.icon} openApp={openApp} />
      ))}
    </div>
  );
}
