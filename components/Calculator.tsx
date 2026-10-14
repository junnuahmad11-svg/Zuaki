import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CalculatorProps {
  onClose: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleNumber = (num: string) => {
    setDisplay(display === '0' ? num : display + num);
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      const fullEquation = equation + display;
      // eslint-disable-next-line no-eval
      const result = eval(fullEquation.replace('×', '*').replace('÷', '/'));
      setDisplay(String(result));
      setEquation('');
    } catch (e) {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
  };

  const percentage = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const square = () => {
    setDisplay(String(Math.pow(parseFloat(display), 2)));
  };

  const sqrt = () => {
    setDisplay(String(Math.sqrt(parseFloat(display))));
  };

  const btns = [
    { label: 'C', action: clear, type: 'clear' },
    { label: 'x²', action: square, type: 'func' },
    { label: '√', action: sqrt, type: 'func' },
    { label: '÷', action: () => handleOperator('/'), type: 'op' },
    
    { label: '7', action: () => handleNumber('7'), type: 'num' },
    { label: '8', action: () => handleNumber('8'), type: 'num' },
    { label: '9', action: () => handleNumber('9'), type: 'num' },
    { label: '×', action: () => handleOperator('*'), type: 'op' },
    
    { label: '4', action: () => handleNumber('4'), type: 'num' },
    { label: '5', action: () => handleNumber('5'), type: 'num' },
    { label: '6', action: () => handleNumber('6'), type: 'num' },
    { label: '-', action: () => handleOperator('-'), type: 'op' },
    
    { label: '1', action: () => handleNumber('1'), type: 'num' },
    { label: '2', action: () => handleNumber('2'), type: 'num' },
    { label: '3', action: () => handleNumber('3'), type: 'num' },
    { label: '+', action: () => handleOperator('+'), type: 'op' },
    
    { label: '0', action: () => handleNumber('0'), type: 'num', wide: true },
    { label: '.', action: () => handleNumber('.'), type: 'num' },
    { label: '=', action: calculate, type: 'equal' },
  ];

  const getBtnStyle = (type: string) => {
    switch (type) {
      case 'clear': return 'text-cyber-pink border-cyber-pink/30 shadow-[0_0_10px_rgba(255,0,60,0.1)] hover:shadow-[0_0_20px_rgba(255,0,60,0.3)] hover:bg-cyber-pink/10';
      case 'func': return 'text-cyber-cyan border-cyber-cyan/30 shadow-[0_0_10px_rgba(0,243,255,0.1)] hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:bg-cyber-cyan/10';
      case 'op': return 'text-cyber-purple border-cyber-purple/30 shadow-[0_0_10px_rgba(157,0,255,0.1)] hover:shadow-[0_0_20px_rgba(157,0,255,0.3)] hover:bg-cyber-purple/10';
      case 'equal': return 'bg-cyber-cyan text-black border-cyber-cyan font-bold shadow-[0_0_20px_rgba(0,243,255,0.5)] hover:shadow-[0_0_30px_rgba(0,243,255,0.7)] hover:scale-105';
      default: return 'text-white border-white/10 hover:border-white/30 hover:bg-white/5 hover:text-cyber-cyan hover:shadow-[0_0_10px_rgba(0,243,255,0.2)]'; // num
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-6 relative overflow-hidden bg-[#050818]">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_100%)] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-cyber-purple/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[20%] w-[300px] h-[300px] bg-cyber-cyan/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

      {/* Floating Calculator Panel */}
      <div className="relative w-full max-w-sm rounded-[40px] glass-panel border border-white/10 p-8 shadow-2xl backdrop-blur-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Neon Edge Glows */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-purple to-transparent opacity-50"></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8 relative z-10">
            <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-cyber-pink shadow-[0_0_5px_#ff003c]"></div>
                    <div className="w-2 h-2 rounded-full bg-cyber-cyan shadow-[0_0_5px_#00f3ff]"></div>
                    <div className="w-2 h-2 rounded-full bg-cyber-purple shadow-[0_0_5px_#9d00ff]"></div>
                </div>
                <h2 className="text-sm font-display font-bold text-cyber-cyan tracking-[0.2em] uppercase drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]">
                    Zuaki Calculator
                </h2>
            </div>
            
            <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan hover:bg-cyber-cyan/10 hover:shadow-[0_0_10px_#00f3ff] transition-all"
            >
                <X size={16} />
            </button>
        </div>

        {/* Display Screen */}
        <div className="bg-black/20 border border-white/5 rounded-[24px] p-6 mb-6 text-right relative overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
           <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>
           <div className="relative z-10">
               <p className="text-cyber-cyan/50 text-xs font-mono h-6 mb-1 tracking-widest">{equation}</p>
               <h1 className="text-5xl font-mono text-white tracking-widest drop-shadow-[0_0_10px_rgba(0,243,255,0.3)] flex justify-end items-center gap-1">
                   {display}
                   <span className="w-1 h-8 bg-cyber-cyan animate-pulse"></span>
               </h1>
           </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-3 relative z-10">
            {btns.map((btn, idx) => (
                <button
                    key={idx}
                    onClick={btn.action}
                    className={`
                        h-16 rounded-[20px] border flex items-center justify-center font-display font-bold text-xl transition-all duration-200 active:scale-95
                        ${getBtnStyle(btn.type)}
                        ${btn.wide ? 'col-span-2' : ''}
                    `}
                >
                    {btn.label}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};
