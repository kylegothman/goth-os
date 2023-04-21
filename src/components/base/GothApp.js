import React from 'react';
import './GothApp.css';

export default function GothApp({ id, icon, name, openApp }) {
  const handleOpenApp = (event) => {
    event.stopPropagation(); // Added this to stop event propagation
    openApp(id);
  };

  return (
    <div
      className="p-1 m-px z-10 bg-white bg-opacity-0 hover:bg-opacity-20 focus:bg-ub-orange focus:bg-opacity-50 focus:border-yellow-700 focus:border-opacity-100 border border-transparent outline-none rounded select-none w-24 h-20 flex flex-col justify-start items-center text-center text-xs font-normal text-white "
      id={"app-" + id}
      onClick={handleOpenApp}
      tabIndex={0}
    >
      {icon}
      {name}
    </div>
  );
}
