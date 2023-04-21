import React, { useState, useEffect, useCallback } from 'react';
import SideBar from './SideBar';
import apps from '../../apps.config';
import Window from '../base/Window';
import GothApp from '../base/GothApp';
import ASCIIAnimation from '../ASCIIAnimation';




export default function Desktop(props) {
    const [minimizedWindowsState, setMinimizedWindowsState] = useState({});
    const [closedWindowsState, setClosedWindowsState] = useState({});
    const [hideSideBarState, setHideSideBar] = useState(false);
    const [overlappedWindowsState, setOverlappedWindows] = useState({});
    const [focusedWindowsState, setFocusedWindowsState] = useState({});
    const [appStack, setAppStack] = useState([]);
    const [desktopApps, setDesktopApps] = useState([]);


    const closeApp = (objId) => {
        // remove app from the app stack
        setAppStack(appStack.filter((id) => id !== objId));
      
        giveFocusToLastApp();
      
        hideSideBar(null, false);
      
        // close window
        setClosedWindowsState({ ...closedWindowsState, [objId]: true });
      };
      
      const focus = useCallback((objId) => {
        // removes focus from all windows and 
        // gives focus to the window with 'id = objId'
        let focusedWindows = { ...focusedWindowsState };
        focusedWindows[objId] = true;
        for (let key in focusedWindows) {
            if (key !== objId) {
                focusedWindows[key] = false;
            }
        }
        setFocusedWindowsState(focusedWindows);
    }, [focusedWindowsState]);

    const openApp = useCallback((objId) => {

        if (minimizedWindowsState[objId]) {
            // focus this app's window
            focus(objId);
            console.log("focus", objId);

            // set window's last position
            var r = document.querySelector("#" + objId);
            r.style.transform = `translate(${r.style.getPropertyValue("--window-transform-x")},${r.style.getPropertyValue("--window-transform-y")}) scale(1)`;
            console.log("set window", objId);

            // tell child components that this app has been not minimized
            setMinimizedWindowsState({ ...minimizedWindowsState, [objId]: false });
            return;
        }

        setTimeout(() => {
            setClosedWindowsState({ ...closedWindowsState, [objId]: false }); // open app's window
            focus(objId);
            setAppStack((prevAppStack) => [...prevAppStack, objId]);
        }, 200);
        }, [minimizedWindowsState, focus, closedWindowsState]);


      const fetchAppsData = useCallback(() => {
        console.log("fetching apps data")
        let focused_windows = {}, closed_windows = {}, overlapped_windows = {}, minimized_windows = {};
        let desktop_apps = [];
        apps.forEach((app) => {
            focused_windows = {
                ...focused_windows,
                [app.id]: false,
            };
            closed_windows = {
                ...closed_windows,
                [app.id]: true,
            };
            overlapped_windows = {
                ...overlapped_windows,
                [app.id]: false,
            };
            minimized_windows = {
                ...minimized_windows,
                [app.id]: false,
            }
            if (app.desktop_shortcut) desktop_apps.push(app.id);
        });
        setFocusedWindowsState(focused_windows);
        setClosedWindowsState(closed_windows);
        setOverlappedWindows(overlapped_windows);
        setMinimizedWindowsState(minimized_windows);
      }, []);

        useEffect(() => {
            fetchAppsData();
        }, [fetchAppsData]);
    
    
    const RenderDesktopApps = () => {
        if (Object.keys(closedWindowsState).length === 0) return null;
        let appsJsx = [];
        apps.forEach((app, index) => {
          if (desktopApps.includes(app.id)) {

            const props = {
                name: app.title,
                id: app.id,
                icon: app.icon,
                openApp: openApp,
            }
      
            appsJsx.push(
                <GothApp key={index} {...props} />
            )
            }
        });
        return appsJsx;
    }
      
    const renderWindows = () => {
        let windowsJsx = [];
        apps.forEach((app, index) => {
            if (closedWindowsState[app.id] === false) {
                const props = {
                title: app.title,
                id: app.id,
                screen: app.screen,
                closed: closeApp,
                openApp: openApp,
                focus: focus,
                isFocused: focusedWindowsState[app.id],
                hideSideBar: hideSideBar,
                hasMinimized: hasMinimized,
                minimized: minimizedWindowsState[app.id],
                }

                windowsJsx.push(
                    <Window key={index} {...props} />
                )
            }
        });
        return windowsJsx;
    };
      

    const hideSideBar = (objId, hide) => {
        if (hide === hideSideBarState) return;

        if (objId === null) {
            if (hide === false) {
            setHideSideBar(false);
            } else {
            for (const key in overlappedWindowsState) {
                if (overlappedWindowsState[key]) {
                setHideSideBar(true);
                return;
                } // if any window is overlapped then hide the SideBar
            }
            }
            return;
        }

        if (hide === false) {
            for (const key in overlappedWindowsState) {
            if (overlappedWindowsState[key] && key !== objId) return; // if any window is overlapped then don't show the SideBar
            }
        }

        let overlappedWindows = overlappedWindowsState;
        overlappedWindows[objId] = hide;
        setHideSideBar(hide);
        setOverlappedWindows(overlappedWindows);
        };

        const hasMinimized = (objId) => {
            let minimizedWindows = minimizedWindowsState;
            var focusedWindows = focusedWindowsState;

            // remove focus and minimize this window
            minimizedWindows[objId] = true;
            focusedWindows[objId] = false;
            setMinimizedWindowsState(minimizedWindows);
            setFocusedWindowsState(focusedWindows);

            hideSideBar(null, false);

            giveFocusToLastApp();
        };

    const giveFocusToLastApp = () => {
        // if there is at least one app opened, give it focus
        if (!checkAllMinimised()) {
            for (const index in appStack) {
            if (!minimizedWindowsState[appStack[index]]) {
                focus(appStack[index]);
                break;
            }
            }
        }
    };
      
    const checkAllMinimised = () => {
    let result = true;
    for (const key in minimizedWindowsState) {
        if (!closedWindowsState[key]) { // if app is opened
        result = result & minimizedWindowsState[key];
        }
    }
    return result;
    };
      
      return (
        <div className="h-full w-full flex flex-col items-end justify-start content-start flex-wrap-reverse pt-8 bg-transparent overflow-hidden overscroll-none window-parent">
          {/* Window Area */}
          <div className="absolute h-full w-full bg-transparent" data-context="desktop-area">
          {renderWindows()}
          </div>
    
          {/* Background Image */}
          <ASCIIAnimation
            folderPath="/assets/spheres_output"
            frameCount={148}
            frameRate={24}
          />
    
          {/* Side Menu Bar */}
          <SideBar
            apps={apps}
            hide={hideSideBarState}
            hideSideBar={hideSideBar}
            closed_windows={closedWindowsState}
            focused_windows={focusedWindowsState}
            isMinimized={minimizedWindowsState}
            openAppByAppId={openApp}
          />
    
          {/* Desktop Apps */}
          {RenderDesktopApps()}
        </div>
      );
    }
    
    


