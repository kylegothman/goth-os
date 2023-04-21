import React from "react";
import Volume from "./Volume";
import Clock from "./Clock";

export default function Status() {
  const enterFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
  };

  return (
    <div className="flex justify-center items-center">
      <span className="hidden lg:inline mx-1.5">
        <Volume />
      </span>
      <span className="mx-3.5" onClick={enterFullscreen}>
        <img
          width="16px"
          height="16px"
          src={process.env.PUBLIC_URL + "/assets/icons/SVG/fullscreen.svg"}
          alt="full screen"
          className="inline status-symbol min-w-16 h-4"
        />
        <span className="hidden lg:inline mx-3.5 font-vt323 text-xl">Fullscreen</span>
      </span>
        <div
            tabIndex="0"
            className={
              'pl-2 pr-2 text-xs lg:text-sm outline-none transition duration-100 ease-in-out border-b-2 border-transparent focus:border-ubb-orange py-1'
            }
        >
          <Clock />
        </div>
    </div>
  );
}