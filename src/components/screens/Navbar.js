import React, { useState } from 'react';
import Status from '../utils/Status';

const Navbar = ({ shutDown, lockScreen }) => {
  const [statusCardVisible, setStatusCardVisible] = useState(false);

  const toggleStatusCardVisible = () => {
    setStatusCardVisible(!statusCardVisible);
  };

  const commonClass =
    'outline-none transition duration-100 ease-in-out border-b-2 border-transparent py-1';

  return (
    <div className="main-navbar-vp absolute content-center top-0 right-0 w-screen max-h-9 shadow-md flex flex-nowrap justify-between items-center bg-ub-cool-grey text-ubt-grey select-none z-50">
      <div
        tabIndex="0"
        className={`${commonClass} pl-4 pr-3 font-vt323 text-xl`}
      >
        Goth OS v0.1
      </div>
  
      <div
        id="status-bar"
        tabIndex="0"
        onFocus={toggleStatusCardVisible}
        className={`${commonClass} relative pr-3 pl-3`}
      >
        <Status />
      </div>
    </div>
  );
};

export default Navbar;