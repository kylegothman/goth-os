import React from 'react';
import './window.css';


export default function CloseSymbol() {
    return (
        <div className="close-symbol">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                <path fill="#fff" fillRule="evenodd" d="M4.795 3.912l-.883.883.147.146L7.117 8 4.06 11.059l-.147.146.883.883.146-.147L8 8.883l3.059 3.058.146.147.883-.883-.147-.146L8.883 8l3.058-3.059.147-.146-.883-.883-.146.147L8 7.117 4.941 4.06z" color="#000" overflow="visible" white-space="normal"/>
            </svg>
        </div>
    );
}