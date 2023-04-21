import React from "react";
import Pong from "./icons/Pong";
import MusicPlayer from "./icons/MusicPlayer";
import DrumMachine from "./icons/GrooveBox";
import WebBrowser from "./icons/WebBrowser";
import Terminal from "./icons/Terminal";
import Calculator from "./icons/Calculator";
import Aboot from "./icons/Aboot";
import "./svg.css";



export default function Svg({ togglePong }) {
    return (
        <div className="app-dock">
            <div className="app-set">
            
                <Terminal/>

                <Calculator/>
                
                <Pong onClick={togglePong} />

                <MusicPlayer/>

                <DrumMachine/>

                <WebBrowser/>
                            
                <Aboot/>
                        
            </div>
       
        </div>
    );
}


