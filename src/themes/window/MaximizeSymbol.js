import React from 'react';
import './window.css';


export default function MaximizeSymbol() {
    return (
        <div className="maximize-symbol">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                <path fill="#fff" d="M4 4v8h8V4zm1 1h6v6H5z" color="#000" overflow="visible" white-space="normal"/>
            </svg>      
        </div>
    );
}