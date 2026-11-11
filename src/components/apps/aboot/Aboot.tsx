import { useState, useEffect, useCallback, type ReactNode } from 'react';
import ReactGA from 'react-ga4';
import Education from './Education';
import Skills from './Skills';
import Projects from './Projects';
import About from './About';
import RenderNavLinks, { type AbootScreen } from './RenderNavLinks';
import { assetPath } from '../../../utils/assetPath';

const STORAGE_KEY = 'about-section';

const Resume = () => (
  <iframe
    className="h-full w-full"
    src={assetPath('/files/KyleGothmanResume.pdf')}
    title="Kyle Gothman's resume"
    frameBorder="0"
  />
);

const screens: Record<AbootScreen, ReactNode> = {
  about: <About />,
  education: <Education />,
  skills: <Skills />,
  projects: <Projects />,
  resume: <Resume />,
};

const isAbootScreen = (value: string | null): value is AbootScreen =>
  value !== null && value in screens;

export default function Aboot() {
  const [activeScreen, setActiveScreen] = useState<AbootScreen>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isAbootScreen(saved) ? saved : 'about';
  });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Report a pageview for the initial screen and every change (no-op until GA is initialized).
  useEffect(() => {
    if (ReactGA.isInitialized) {
      ReactGA.send({ hitType: 'pageview', page: `/${activeScreen}` });
    }
  }, [activeScreen]);

  const changeScreen = useCallback((screen: AbootScreen) => {
    localStorage.setItem(STORAGE_KEY, screen);
    setActiveScreen(screen);
  }, []);

  return (
    <div className="w-full h-full flex bg-ub-cool-grey text-white select-none relative">
      <div className="md:flex hidden flex-col w-1/4 md:w-1/5 text-sm overflow-y-auto windowMainScreen border-r border-black">
        <RenderNavLinks activeScreen={activeScreen} changeScreen={changeScreen} />
      </div>
      <div
        onClick={() => setMobileNavOpen((open) => !open)}
        className="md:hidden flex flex-col items-center justify-center absolute bg-ub-cool-grey rounded w-6 h-6 top-1 left-1"
      >
        <div className="w-3.5 border-t border-white" />
        <div className="w-3.5 border-t border-white" style={{ marginTop: '2pt', marginBottom: '2pt' }} />
        <div className="w-3.5 border-t border-white" />
        <div
          className={
            (mobileNavOpen ? 'visible animateShow z-30 ' : 'invisible ') +
            'md:hidden text-xs absolute bg-ub-cool-grey py-0.5 px-1 rounded-sm top-full mt-1 left-0 shadow border-black border border-opacity-20'
          }
        >
          <RenderNavLinks activeScreen={activeScreen} changeScreen={changeScreen} />
        </div>
      </div>
      <div className="flex flex-col w-3/4 md:w-4/5 justify-start items-center flex-grow bg-ub-grey overflow-y-auto windowMainScreen">
        {screens[activeScreen]}
      </div>
    </div>
  );
}
