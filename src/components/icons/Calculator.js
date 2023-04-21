import React from 'react';
import '../svg.css';

export default function Calculator() {
    return (
        <div className="calculator">
            <svg id="calc-layer-2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="-33 -22 160 160">
            <g id="calculator">
                <g>
                    <rect className="calc-cls-1" x=".5" y=".5" width="87.6" height="111.5"/>
                    <rect className="calc-cls-1" x="44.3" y="32.36" width="35.84" height="35.84"/>
                    <rect className="calc-cls-1" x="44.3" y="68.19" width="35.84" height="35.84"/>
                    <rect className="calc-cls-1" x="8.46" y="8.46" width="71.68" height="23.89"/>
                    <rect className="calc-cls-1" x="8.46" y="32.36" width="35.84" height="35.84"/>
                    <line className="calc-cls-2" x1="52.27" y1="86.11" x2="72.18" y2="86.11"/>
                    <line className="calc-cls-2" x1="52.27" y1="50.27" x2="72.18" y2="50.27"/>
                <g>
                    <line className="calc-cls-2" x1="16.43" y1="50.27" x2="36.34" y2="50.27"/>
                    <line className="calc-cls-2" x1="26.38" y1="40.32" x2="26.38" y2="60.23"/>
                </g>
                <rect className="calc-cls-1" x="8.46" y="68.19" width="35.84" height="35.84"/>
                <g>
                    <line className="calc-cls-2" x1="19.34" y1="79.07" x2="33.42" y2="93.15"/>
                    <line className="calc-cls-2" x1="33.42" y1="79.07" x2="19.34" y2="93.15"/>
                </g>
                <circle className="calc-cls-3" cx="62.22" cy="78.15" r="1.99"/>
                <circle className="calc-cls-3" cx="62.22" cy="94.08" r="1.99"/>
                </g>
            </g>
            </svg>
        </div>
    )
}