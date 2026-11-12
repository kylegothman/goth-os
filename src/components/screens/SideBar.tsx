import { useEffect, useRef } from 'react';
import SideBarApp from '../base/SideBarApp';
import type { AppConfig } from '../../apps.config';

interface SideBarProps {
  apps: AppConfig[];
  hide: boolean;
  hideSideBar: (id: string | null, hide: boolean) => void;
  closed_windows: Record<string, boolean>;
  focused_windows: Record<string, boolean>;
  openAppByAppId: (id: string) => void;
}

const AUTO_HIDE_DELAY_MS = 2000;

export default function SideBar(props: SideBarProps) {
  const hideTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  const showSideBar = () => {
    window.clearTimeout(hideTimer.current);
    props.hideSideBar(null, false);
  };

  const scheduleHide = () => {
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => props.hideSideBar(null, true), AUTO_HIDE_DELAY_MS);
  };

  return (
    <>
      <div
        className={
          (props.hide ? '-translate-x-full ' : '') +
          'dock-scroll absolute transform duration-300 select-none z-40 left-0 top-0 h-full pt-14 pb-4 w-auto flex flex-col justify-start items-center overflow-y-auto border-black border-opacity-60 bg-black bg-opacity-50'
        }
      >
        {props.apps.map((app) => (
          <SideBarApp
            key={app.id}
            id={app.id}
            title={app.title}
            icon={app.icon}
            isClose={props.closed_windows}
            isFocus={props.focused_windows}
            openApp={props.openAppByAppId}
          />
        ))}
      </div>
      <div
        onMouseEnter={showSideBar}
        onMouseLeave={scheduleHide}
        className="w-1 h-full absolute top-0 left-0 bg-transparent z-50"
      />
    </>
  );
}
