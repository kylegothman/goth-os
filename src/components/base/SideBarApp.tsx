import { useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface SideBarAppProps {
  id: string;
  icon: ReactNode;
  title: string;
  isClose: Record<string, boolean>;
  isFocus: Record<string, boolean>;
  openApp: (id: string) => void;
}

interface TooltipPosition {
  x: number;
  y: number;
}

export default function SideBarApp({ id, icon, title, isClose, isFocus, openApp }: SideBarAppProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipPosition | null>(null);
  const isOpen = isClose[id] === false;

  // The label is rendered on document.body (a portal) rather than inside the dock, because the
  // dock clips its overflow (it scrolls on short viewports) and the label sits to its right.
  const showTooltip = () => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) setTooltip({ x: rect.right + 12, y: rect.top + 10 });
  };
  const hideTooltip = () => setTooltip(null);

  const handleOpenApp = () => {
    openApp(id);
    hideTooltip();
  };

  return (
    <div
      ref={ref}
      tabIndex={0}
      onClick={handleOpenApp}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      className={
        (isOpen && isFocus[id] ? 'bg-white bg-opacity-10 ' : '') +
        'w-auto p-2 outline-none relative transition hover:bg-white hover:bg-opacity-10 rounded m-1 justify-center items-center flex flex-col'
      }
      id={`sidebar-${id}`}
    >
      {/* Icons shrink on short viewports so the whole dock stays on screen. */}
      <div className="h-20 w-[100px] [@media(max-height:820px)]:h-14 [@media(max-height:820px)]:w-[72px] flex items-center justify-center">
        {icon}
      </div>
      {/* Dot marking an open app, like the Ubuntu dock. */}
      {isOpen && <div className="absolute left-0 top-1/2 w-1 h-1 rounded-full bg-ub-orange" aria-hidden="true" />}
      {tooltip && createPortal(
        <div
          className="fixed z-50 pointer-events-none w-max py-0.5 px-1.5 text-ubt-grey text-opacity-90 text-sm bg-ub-grey bg-opacity-70 border-gray-400 border border-opacity-40 rounded-md"
          style={{ left: tooltip.x, top: tooltip.y }}
          role="tooltip"
        >
          {title}
        </div>,
        document.body,
      )}
    </div>
  );
}
