import React from 'react';
import './window.css';


export default function MinimizeSymbol() {
    return (
        <div className="minimize-symbol">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                <path fill="#fff" d="M4 10v1h8v-1z" color="#000" overflow="visible" white-space="normal"/>
            </svg>        
        </div>
    );
}