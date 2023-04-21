import React, { useState, useEffect, useCallback } from 'react';
import ReactGA from 'react-ga';
import Education from './Education';
import Skills from './Skills';
import Projects from './Projects';
import About from './About';
import RenderNavLinks from './RenderNavLinks';

export default function Aboot() {
  const [screens, setScreens] = useState({});
  const [activeScreen, setActiveScreen] = useState('About');
  const [navbar, setNavbar] = useState(false);

  const changeScreen = useCallback((e) => {
    const screen = e.id || e.target.id;

    localStorage.setItem('about-section', screen);
    ReactGA.pageview(`/${screen}`);

    setActiveScreen(screen);
  }, []);

  useEffect(() => {
    setScreens({
      about: <About />,
      education: <Education />,
      skills: <Skills />,
      projects: <Projects />,
      resume: <Resume/>,
    });

    const lastVisitedScreen = localStorage.getItem('about-section') || 'about';
    changeScreen(document.getElementById(lastVisitedScreen));
  }, [changeScreen]);

  const showNavBar = () => {
    setNavbar(!navbar);
  };

  return (
    <div className="w-full h-full flex bg-ub-cool-grey text-white select-none relative">
      <div className="md:flex hidden flex-col w-1/4 md:w-1/5 text-sm overflow-y-auto windowMainScreen border-r border-black">
        <RenderNavLinks changeScreen={changeScreen}/>
      </div>
      <div onClick={showNavBar} className="md:hidden flex flex-col items-center justify-center absolute bg-ub-cool-grey rounded w-6 h-6 top-1 left-1">
        <div className=" w-3.5 border-t border-white"></div>
        <div className=" w-3.5 border-t border-white" style={{ marginTop: "2pt", marginBottom: "2pt" }}></div>
        <div className=" w-3.5 border-t border-white"></div>
        <div className={(navbar ? " visible animateShow z-30 " : " invisible ") + " md:hidden text-xs absolute bg-ub-cool-grey py-0.5 px-1 rounded-sm top-full mt-1 left-0 shadow border-black border border-opacity-20"}>
          <RenderNavLinks changeScreen={changeScreen}/>
        </div>
      </div>
      <div className="flex flex-col w-3/4 md:w-4/5 justify-start items-center flex-grow bg-ub-grey overflow-y-auto windowMainScreen">
        {screens[activeScreen]}
      </div>
    </div>
  );
};

const Resume = () => {
  return (
    <iframe className="h-full w-full" src={process.env.PUBLIC_URL + "/files/kyleGothmanResume.pdf"} title="Kyle Gothman's resume" frameBorder="0"></iframe>
  )
};