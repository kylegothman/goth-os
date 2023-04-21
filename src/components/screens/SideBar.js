import React from "react";
import SideBarApp from "../base/SideBarApp";


let renderApps = (props) => {
  let sideBarAppsJsx = [];
  props.apps.forEach((app, index) => {
    sideBarAppsJsx.push(
      <SideBarApp
        key={index}
        id={app.id}
        title={app.title}
        icon={app.icon}
        isClose={props.closed_windows}
        isFocus={props.focused_windows}
        openApp={props.openAppByAppId}
        isMinimized={props.isMinimized}
        openFromMinimised={props.openFromMinimised}
      />
    );
  });
  return sideBarAppsJsx;
};

export default function SideBar(props) {
  function showSideBar() {
    props.hideSideBar(null, false);
  }

  function hideSideBar() {
    setTimeout(() => {
      props.hideSideBar(null, true);
    }, 2000);
  }

  return (
    <>
      <div
        className={(props.hide ? " -translate-x-full " : "") + " absolute transform duration-300 select-none z-40 left-0 top-0 h-full pt-14 w-auto flex flex-col justify-start items-center border-black border-opacity-60 bg-black bg-opacity-50"}
      >
       {renderApps(props)}
 
      </div>
      <div
        onMouseEnter={showSideBar}
        onMouseLeave={hideSideBar}
        className={"w-1 h-full absolute top-0 left-0 bg-transparent z-50"}
      ></div>
    </>
  );
}