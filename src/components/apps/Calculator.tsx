import { useState } from 'react';
import * as math from 'mathjs';

const OPERATORS = ['+', '-', '/', '*'];

interface CalcButton {
  label: string;
  value: string;
  kind?: 'operator';
  wide?: boolean;
}

const BUTTONS: CalcButton[] = [
  { label: 'C', value: 'C' }, { label: '+/-', value: '+/-' }, { label: '%', value: '%' }, { label: '÷', value: '/', kind: 'operator' },
  { label: '7', value: '7' }, { label: '8', value: '8' }, { label: '9', value: '9' }, { label: '×', value: '*', kind: 'operator' },
  { label: '4', value: '4' }, { label: '5', value: '5' }, { label: '6', value: '6' }, { label: '-', value: '-', kind: 'operator' },
  { label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' }, { label: '+', value: '+', kind: 'operator' },
  { label: '0', value: '0', wide: true }, { label: '.', value: '.' }, { label: '=', value: '=', kind: 'operator' },
];

export default function DisCalculator() {
  const [input, setInput] = useState<string | number>('0');
  const [resultDisplayed, setResultDisplayed] = useState(false);
  const [decimalAdded, setDecimalAdded] = useState(false);

  const handleClear = () => {
    setInput('0');
    setDecimalAdded(false);
    setResultDisplayed(false);
  };

  const handleEqual = (inputVal: string) => {
    const lastChar = inputVal[inputVal.length - 1];
    if (OPERATORS.includes(lastChar) || lastChar === '.') {
      inputVal = inputVal.replace(/.$/, '');
    }
    if (!inputVal) return;

    try {
      setInput(math.evaluate(inputVal));
    } catch (error) {
      console.error('Invalid expression:', error);
    }
    setResultDisplayed(true);
    setDecimalAdded(false);
  };

  const handleOperator = (inputVal: string, btnVal: string, lastChar: string) => {
    if (resultDisplayed) return;

    if (inputVal !== '0' && !OPERATORS.includes(lastChar)) {
      setInput(inputVal + btnVal);
    } else if (inputVal === '0' && btnVal === '-') {
      setInput(btnVal);
    } else if (OPERATORS.includes(lastChar) && inputVal.length > 1) {
      setInput(inputVal.replace(/.$/, btnVal));
    }
    setDecimalAdded(false);
  };

  const handleDecimal = (inputVal: string) => {
    if (!resultDisplayed && !decimalAdded) {
      setInput(inputVal + '.');
      setDecimalAdded(true);
    }
  };

  const handlePercentage = (inputVal: string) => {
    setInput(Number(inputVal) * 0.01);
    setDecimalAdded(true);
  };

  const handleNegation = (inputVal: string) => {
    if (Number(inputVal) > 0) {
      setInput(-Number(inputVal));
    } else {
      setInput(inputVal.replace(/-/g, ''));
    }
  };

  const handleNumber = (inputVal: string, btnVal: string) => {
    if (inputVal === '0' || resultDisplayed) {
      setInput(btnVal);
      setResultDisplayed(false);
    } else {
      setInput(inputVal + btnVal);
    }
  };

  const handleClick = (btnVal: string) => {
    const inputVal = String(input);
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
        if (OPERATORS.includes(btnVal)) {
          handleOperator(inputVal, btnVal, lastChar);
        } else {
          handleNumber(inputVal, btnVal);
        }
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-neutral-950/95 text-white select-none">
      <div className="h-24 shrink-0 flex items-end justify-end px-4 pb-3 border-b border-white border-opacity-30">
        <div className="text-4xl truncate" title={String(input)}>{input}</div>
      </div>
      <div className="flex-1 grid grid-cols-4 grid-rows-5 gap-px">
        {BUTTONS.map(({ label, value, kind, wide }) => (
          <button
            key={value}
            type="button"
            onClick={() => handleClick(value)}
            className={[
              'text-2xl text-white transition-colors',
              kind === 'operator'
                ? 'bg-amber-500/95 hover:bg-amber-400/95 active:bg-amber-300/95'
                : 'bg-gray-600/95 hover:bg-gray-500/95 active:bg-gray-400/95',
              wide ? 'col-span-2' : '',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
