import React, { useState } from 'react';
import * as math from 'mathjs';

const DisCalculator = () => {
  const operators = ['+', '-', '/', '*'];
  const [input, setInput] = useState('0');
  const [resultDisplayed, setResultDisplayed] = useState(false);
  const [decimalAdded, setDecimalAdded] = useState(false);

  // Clear the input and reset states
  const handleClear = () => {
    setInput('0');
    setDecimalAdded(false);
    setResultDisplayed(false);
  };

  // Calculate and display the result
  const handleEqual = (inputVal) => {
    const lastChar = inputVal[inputVal.length - 1];
  
    if (operators.indexOf(lastChar) > -1 || lastChar === '.') {
      inputVal = inputVal.replace(/.$/, '');
    }
  
    if (inputVal) {
      try {
        setInput(math.evaluate(inputVal));
      } catch (error) {
        console.error('Invalid expression:', error);
      }
      setResultDisplayed(true);
      setDecimalAdded(false);
    }
  };

  // Handle operator input
  const handleOperator = (inputVal, btnVal, lastChar) => {
    if (!resultDisplayed) {
      if (inputVal !== '0' && operators.indexOf(lastChar) === -1) {
        setInput(inputVal + btnVal);
      } else if (inputVal === '0' && btnVal === '-') {
        setInput(btnVal);
      } else if (operators.indexOf(lastChar) > -1 && inputVal.length > 1) {
        setInput(inputVal.replace(/.$/, btnVal));
      }
      setDecimalAdded(false);
    }
  };

  // Handle decimal input
  const handleDecimal = (inputVal) => {
    if (!resultDisplayed && !decimalAdded) {
      setInput(inputVal + '.');
      setDecimalAdded(true);
    }
  };

  // Handle percentage input
  const handlePercentage = (inputVal) => {
    setInput(parseFloat(inputVal * 0.01));
    setDecimalAdded(true);
  };

  // Handle negation input
  const handleNegation = (inputVal) => {
    if (inputVal > 0) {
      setInput(-inputVal);
    } else {
      setInput(inputVal.replace(/-/g, ''));
    }
  };

  // Handle number input
  const handleNumber = (inputVal, btnVal) => {
    if (inputVal === '0' || resultDisplayed) {
      setInput(btnVal);
      setResultDisplayed(false);
    } else {
      setInput(inputVal + btnVal);
    }
  };

  const handleClick = (btnVal) => {
    const inputVal = input;
    const lastChar = inputVal[inputVal.length - 1];

    switch (btnVal) {
      case 'C':
        handleClear();
        break;
      case '=':
        handleEqual(inputVal);
        break;
      case '.':
        handleDecimal(inputVal);
        break;
      case '%':
        handlePercentage(inputVal);
        break;
      case '+/-':
        handleNegation(inputVal);
        break;
      default:
        if (operators.indexOf(btnVal) > -1) {
          handleOperator(inputVal, btnVal, lastChar);
        } else {
          handleNumber(inputVal, btnVal);
        }
    }
  };

  return (
    <div className="w-96 h-144 relative m-auto mt-20 shadow-md overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-neutral-950/95 bg-no-repeat bg-fixed"></div>
      <div className="w-full h-full bg-white bg-opacity-60"></div>
      <div className="w-full h-full relative">
        <div className="h-24 border-b border-white border-opacity-30">
          <div className="h-full w-full pt-6 px-4 text-right text-4xl text-white">{input}</div>
        </div>
        <div className="grid grid-cols-4 gap-px" >
          <button className="h-24 bg-opacity-70 bg-gray-600/95 text-white" onClick={() => handleClick('C')}>C</button>
          <button className="h-24 bg-opacity-70 bg-gray-600/95 text-white" onClick={() => handleClick('+/-')}>+/-</button>
          <button className="h-24 bg-opacity-70 bg-gray-600/95 text-white" onClick={() => handleClick('%')}>%</button>
          <button className="h-24 bg-opacity-70 bg-amber-500/95 text-white" onClick={() => handleClick('/')}>&divide;</button>
          <button className="h-24 bg-opacity-70 bg-gray-600/95 text-white" onClick={() => handleClick('7')}>7</button>
          <button className="h-24 bg-opacity-70 bg-gray-600/95 text-white" onClick={() => handleClick('8')}>8</button>
          <button className="h-24 bg-opacity-70 bg-gray-600/95 text-white" onClick={() => handleClick('9')}>9</button>
          <button className="h-24 bg-opacity-70 bg-amber-500/95 text-white" onClick={() => handleClick('*')}>x</button>
          <button className="h-24 bg-opacity-70 bg-gray-600/95 text-white" onClick={() => handleClick('4')}>4</button>
          <button className="h-24 bg-opacity-70 bg-gray-600/95 text-white" onClick={() => handleClick('5')}>5</button>
          <button className="h-24 bg-opacity-70 bg-gray-600/95 text-white" onClick={() => handleClick('6')}>6</button>
          <button className="h-24 bg-opacity-70 bg-amber-500/95 text-white" onClick={() => handleClick('-')}>-</button>
          <button className="h-24 bg-opacity-70 bg-gray-600/95 text-white" onClick={() => handleClick('1')}>1</button>
          <button className="h-24 bg-opacity-70 bg-gray-600/95 text-white" onClick={() => handleClick('2')}>2</button>
          <button className="h-24 bg-opacity-70 bg-gray-600/95 text-white" onClick={() => handleClick('3')}>3</button>
          <button className="h-24 bg-opacity-70 bg-amber-500/95 text-white" onClick={() => handleClick('+')}>+</button>
          <button className="h-24 col-span-2 bg-opacity-70 bg-gray-600/95 text-white" onClick={() => handleClick('0')}>0</button>
          <button className="h-24 bg-opacity-70 bg-gray-600/95 text-white" onClick={() => handleClick('.')}>.</button>
          <button className="h-24 bg-opacity-70 bg-amber-500/95 text-white" onClick={() => handleClick('=')}>=</button>
        </div>
      </div>
    </div>
  );
};

export default DisCalculator;