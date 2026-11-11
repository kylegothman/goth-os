import Volume from './Volume';
import Clock from './Clock';
import { assetPath } from '../../utils/assetPath';

export default function Status() {
  const enterFullscreen = () => {
    // Optional chaining covers browsers without the Fullscreen API (e.g. iOS Safari);
    // the promise rejects if the user agent refuses, which is fine to ignore.
    void document.documentElement.requestFullscreen?.().catch(() => {});
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
          src={assetPath('/assets/icons/SVG/fullscreen.svg')}
          alt="full screen"
          className="hidden lg:inline h-4"
        />
        <span className="hidden lg:inline mx-3.5 font-vt323 text-xl">Fullscreen</span>
      </span>
      <div
        tabIndex={0}
        className="pl-2 pr-2 text-xs lg:text-sm outline-none transition duration-100 ease-in-out border-b-2 border-transparent focus:border-ubb-orange py-1"
      >
        <Clock />
      </div>
    </div>
  );
}
