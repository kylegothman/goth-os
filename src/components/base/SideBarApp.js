import React, { useState, useEffect } from 'react';


export default function SideBarApp({ id, icon, title, isMinimized, isClose, isFocus, openApp }) {
  const [showTitle, setShowTitle] = useState(false);
  const [scaleImage, setScaleImage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScaleImage(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [scaleImage]);

  const handleOpenApp = () => {
    if (!isMinimized[id] && isClose[id]) {
      setScaleImage(true);
    }
    openApp(id);
    setShowTitle(false);
  };


  return (
    <div
      tabIndex="0"
      onClick={handleOpenApp}
      onMouseEnter={() => setShowTitle(true)}
      onMouseLeave={() => setShowTitle(false)}
      className={(isClose[id] === false && isFocus[id] ? "bg-white bg-opacity-10 " : "") + " w-auto p-2 outline-none relative transition hover:bg-white hover:bg-opacity-10 rounded m-1 jcenter items-center flex flex-col"}
      id={`sidebar-${id}`}
    >
      {icon}
      {!isClose[id] && <div className="indicator" />}
      <div className={`title-container ${showTitle ? 'visible' : 'invisible'} w-max py-0.5 px-1.5 absolute top-1.5 left-full ml-3 m-1 text-ubt-grey text-opacity-90 text-sm bg-ub-grey bg-opacity-70 border-gray-400 border border-opacity-40 rounded-md`}>
        {title}
      </div>
    </div>
  );
}
