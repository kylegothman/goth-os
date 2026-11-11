import { useState, type ReactNode } from 'react';

interface SideBarAppProps {
  id: string;
  icon: ReactNode;
  title: string;
  isClose: Record<string, boolean>;
  isFocus: Record<string, boolean>;
  openApp: (id: string) => void;
}

export default function SideBarApp({ id, icon, title, isClose, isFocus, openApp }: SideBarAppProps) {
  const [showTitle, setShowTitle] = useState(false);
  const isOpen = isClose[id] === false;

  const handleOpenApp = () => {
    openApp(id);
    setShowTitle(false);
  };

  return (
    <div
      tabIndex={0}
      onClick={handleOpenApp}
      onMouseEnter={() => setShowTitle(true)}
      onMouseLeave={() => setShowTitle(false)}
      className={
        (isOpen && isFocus[id] ? 'bg-white bg-opacity-10 ' : '') +
        'w-auto p-2 outline-none relative transition hover:bg-white hover:bg-opacity-10 rounded m-1 justify-center items-center flex flex-col'
      }
      id={`sidebar-${id}`}
    >
      <div className="h-20">{icon}</div>
      {/* Dot marking an open app, like the Ubuntu dock. */}
      {isOpen && <div className="absolute left-0 top-1/2 w-1 h-1 rounded-full bg-ub-orange" aria-hidden="true" />}
      <div
        className={`${showTitle ? 'visible' : 'invisible'} w-max py-0.5 px-1.5 absolute top-1.5 left-full ml-3 m-1 text-ubt-grey text-opacity-90 text-sm bg-ub-grey bg-opacity-70 border-gray-400 border border-opacity-40 rounded-md`}
      >
        {title}
      </div>
    </div>
  );
}
